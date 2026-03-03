"use client";

import { useState, useMemo } from "react";
import {
  syncEvents,
  getSurfaceById,
} from "@/data/mock-data";
import type { SyncEvent, SyncEventStatus, SyncEventType } from "@/lib/types";
import { FeatureSubnav } from "@/components/layout/feature-subnav";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ChevronUp,
  ChevronDown,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  SkipForward,
  XCircle,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatLatency(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function formatEventType(type: SyncEventType): string {
  const labels: Record<SyncEventType, string> = {
    webhook_trigger: "Webhook",
    scheduled_job: "Scheduled Job",
    recompute: "Recompute",
    manual_reconcile: "Manual Reconcile",
    dead_letter_retry: "DLQ Retry",
  };
  return labels[type];
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function SyncStatusBadge({ status }: { status: SyncEventStatus }) {
  const config: Record<
    SyncEventStatus,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    success: {
      label: "Success",
      color: "text-success bg-success/10",
      icon: <CheckCircle2 className="h-2.5 w-2.5" />,
    },
    failed: {
      label: "Failed",
      color: "text-destructive bg-destructive/10",
      icon: <XCircle className="h-2.5 w-2.5" />,
    },
    partial: {
      label: "Partial",
      color: "text-warning bg-warning/10",
      icon: <AlertCircle className="h-2.5 w-2.5" />,
    },
    pending: {
      label: "Pending",
      color: "text-primary bg-primary/10",
      icon: <Loader2 className="h-2.5 w-2.5 animate-spin" />,
    },
    timed_out: {
      label: "Timed Out",
      color: "text-warning bg-warning/10",
      icon: <Clock className="h-2.5 w-2.5" />,
    },
    dead_lettered: {
      label: "Dead Letter",
      color: "text-destructive bg-destructive/10",
      icon: <SkipForward className="h-2.5 w-2.5" />,
    },
  };
  const c = config[status] ?? {
    label: status,
    color: "text-muted-foreground bg-muted",
    icon: null,
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-medium border-0 rounded-sm px-1.5 py-0.5",
        c.color
      )}
    >
      {c.icon}
      {c.label}
    </Badge>
  );
}

// ─── Column Sort ──────────────────────────────────────────────────────────────

type SortKey = keyof Pick<
  SyncEvent,
  "triggeredAt" | "status" | "latencyMs" | "retryCount" | "recordsProcessed"
>;

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
}) {
  if (col !== sortKey) return null;
  return sortDir === "asc" ? (
    <ChevronUp className="h-3 w-3" />
  ) : (
    <ChevronDown className="h-3 w-3" />
  );
}

// ─── Stat Bar ─────────────────────────────────────────────────────────────────

function StatBar() {
  const total = syncEvents.length;
  const failed = syncEvents.filter(
    (e) => e.status === "failed" || e.status === "dead_lettered"
  ).length;
  const timedOut = syncEvents.filter((e) => e.status === "timed_out").length;
  const avgLatency = Math.round(
    syncEvents
      .filter((e) => e.latencyMs !== null)
      .reduce((sum, e) => sum + (e.latencyMs ?? 0), 0) /
      syncEvents.filter((e) => e.latencyMs !== null).length
  );

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-muted/40 border-b border-border text-xs font-mono">
      <span className="text-muted-foreground">
        Events (24h):{" "}
        <span className="text-foreground font-semibold">{total}</span>
      </span>
      <span className="text-muted-foreground">
        Failed:{" "}
        <span className="text-destructive font-semibold">{failed}</span>
      </span>
      <span className="text-muted-foreground">
        Timed Out:{" "}
        <span className="text-warning font-semibold">{timedOut}</span>
      </span>
      <span className="text-muted-foreground">
        Avg Latency:{" "}
        <span className="text-foreground font-semibold">{avgLatency} ms</span>
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SyncMonitorPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("triggeredAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleSort(col: SortKey) {
    if (col === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir("desc");
    }
  }

  const displayed = useMemo(() => {
    return syncEvents
      .filter((e) => {
        const src = getSurfaceById(e.sourceSurfaceId)?.name ?? e.sourceSurfaceId;
        const tgt = getSurfaceById(e.targetSurfaceId)?.name ?? e.targetSurfaceId;
        const q = search.toLowerCase();
        const matchSearch =
          q === "" ||
          e.id.toLowerCase().includes(q) ||
          src.toLowerCase().includes(q) ||
          tgt.toLowerCase().includes(q) ||
          e.eventType.toLowerCase().includes(q) ||
          (e.errorCode ?? "").toLowerCase().includes(q);
        const matchStatus =
          statusFilter === "all" || e.status === statusFilter;
        const matchType = typeFilter === "all" || e.eventType === typeFilter;
        return matchSearch && matchStatus && matchType;
      })
      .sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const an = av ?? (sortDir === "asc" ? Infinity : -Infinity);
        const bn = bv ?? (sortDir === "asc" ? Infinity : -Infinity);
        if (an < bn) return sortDir === "asc" ? -1 : 1;
        if (an > bn) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, statusFilter, typeFilter, sortKey, sortDir]);

  const columns: { key: SortKey; label: string; sortable: boolean }[] = [
    { key: "triggeredAt", label: "Timestamp", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "latencyMs", label: "Latency", sortable: true },
    { key: "retryCount", label: "Retries", sortable: true },
    { key: "recordsProcessed", label: "Records", sortable: true },
  ];

  return (
    <div className="flex flex-col h-full">
      <FeatureSubnav />
      <StatBar />

      {/* Header + Filters */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border shrink-0 flex-wrap bg-background">
        <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
          <div className="relative min-w-[180px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 h-7 text-xs rounded-sm font-mono"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-7 w-36 text-xs rounded-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="timed_out">Timed Out</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="dead_lettered">Dead Lettered</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-7 w-36 text-xs rounded-sm">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="webhook_trigger">Webhook</SelectItem>
              <SelectItem value="scheduled_job">Scheduled Job</SelectItem>
              <SelectItem value="recompute">Recompute</SelectItem>
              <SelectItem value="manual_reconcile">Manual Reconcile</SelectItem>
              <SelectItem value="dead_letter_retry">DLQ Retry</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
            {displayed.length} / {syncEvents.length} events
          </span>
        </div>

        <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors h-7 px-2 border border-border rounded-sm">
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide w-28 whitespace-nowrap">
                Event ID
              </TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                Event Type
              </TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                Source System
              </TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                Destination
              </TableHead>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap",
                    col.sortable &&
                      "cursor-pointer select-none hover:text-foreground transition-colors"
                  )}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon
                      col={col.key}
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-32 text-center text-xs text-muted-foreground"
                >
                  No sync events match this filter.
                </TableCell>
              </TableRow>
            ) : (
              displayed.map((evt) => {
                const src =
                  getSurfaceById(evt.sourceSurfaceId)?.name ??
                  evt.sourceSurfaceId;
                const tgt =
                  getSurfaceById(evt.targetSurfaceId)?.name ??
                  evt.targetSurfaceId;
                const isExpanded = expandedId === evt.id;
                return (
                  <>
                    <TableRow
                      key={evt.id}
                      className={cn(
                        "cursor-pointer text-xs hover:bg-surface-hover transition-colors duration-100",
                        isExpanded && "bg-accent/20"
                      )}
                      onClick={() =>
                        setExpandedId(isExpanded ? null : evt.id)
                      }
                    >
                      <TableCell className="font-mono text-[10px] text-muted-foreground">
                        {evt.id}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatEventType(evt.eventType)}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] whitespace-nowrap">
                        {src}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] whitespace-nowrap">
                        {tgt}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(evt.triggeredAt)}
                      </TableCell>
                      <TableCell>
                        <SyncStatusBadge status={evt.status} />
                      </TableCell>
                      <TableCell className="font-mono text-right tabular-nums whitespace-nowrap">
                        {formatLatency(evt.latencyMs)}
                      </TableCell>
                      <TableCell className="font-mono text-right tabular-nums">
                        {evt.retryCount}
                      </TableCell>
                      <TableCell className="font-mono text-right tabular-nums">
                        {evt.recordsProcessed.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${evt.id}-detail`}>
                        <TableCell
                          colSpan={9}
                          className="bg-muted/30 px-4 py-3"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                                HTTP Status
                              </p>
                              <p className="font-mono">
                                {evt.httpStatusCode ?? "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                                Validation Errors
                              </p>
                              <p
                                className={cn(
                                  "font-mono",
                                  evt.validationErrors > 0
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                                )}
                              >
                                {evt.validationErrors}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                                Idempotent
                              </p>
                              <p
                                className={cn(
                                  "font-mono",
                                  evt.isIdempotent
                                    ? "text-success"
                                    : "text-warning"
                                )}
                              >
                                {evt.isIdempotent ? "Yes" : "No"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                                Affected Fields
                              </p>
                              <p className="font-mono text-[10px]">
                                {evt.affectedFieldIds.join(", ")}
                              </p>
                            </div>
                            {evt.errorCode && (
                              <div className="col-span-2 md:col-span-4">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                                  Error
                                </p>
                                <p className="font-mono text-[10px] text-destructive">
                                  [{evt.errorCode}] {evt.errorMessage}
                                </p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
