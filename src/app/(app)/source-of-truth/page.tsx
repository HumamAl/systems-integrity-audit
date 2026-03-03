"use client";

import { useState, useMemo } from "react";
import {
  canonicalFields,
  getSurfaceById,
} from "@/data/mock-data";
import type {
  CanonicalField,
  CanonicalFieldStatus,
  DriftRiskLevel,
  FieldSyncMechanism,
} from "@/lib/types";
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
import { Search, ChevronUp, ChevronDown, X } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSyncMechanism(m: FieldSyncMechanism): string {
  const map: Record<FieldSyncMechanism, string> = {
    webhook_push: "Webhook Push",
    scheduled_poll: "Scheduled Poll",
    event_driven: "Event-Driven",
    manual_reconcile: "Manual Reconcile",
    derived_state: "Derived State",
  };
  return map[m];
}

function formatSyncLag(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
}

function formatTimestampShort(iso: string): string {
  const d = new Date(iso);
  const now = new Date("2026-03-02T14:00:00Z");
  const diffH = (now.getTime() - d.getTime()) / 3_600_000;
  if (diffH < 1) return `${Math.round(diffH * 60)}m ago`;
  if (diffH < 24) return `${diffH.toFixed(1)}h ago`;
  return `${Math.round(diffH / 24)}d ago`;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function FieldStatusBadge({ status }: { status: CanonicalFieldStatus }) {
  const config: Record<CanonicalFieldStatus, { label: string; color: string }> = {
    in_sync: { label: "In Sync", color: "text-success bg-success/10" },
    drifted: { label: "Drifted", color: "text-destructive bg-destructive/10" },
    stale: { label: "Stale", color: "text-warning bg-warning/10" },
    pending_recompute: { label: "Pending Recompute", color: "text-primary bg-primary/10" },
    validation_error: { label: "Validation Error", color: "text-destructive bg-destructive/10" },
    no_consumer_ack: { label: "No Consumer Ack", color: "text-warning bg-warning/10" },
  };
  const c = config[status] ?? { label: status, color: "text-muted-foreground bg-muted" };
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium border-0 rounded-sm px-1.5 py-0.5", c.color)}>
      {c.label}
    </Badge>
  );
}

function DriftRiskBadge({ level }: { level: DriftRiskLevel }) {
  const config: Record<DriftRiskLevel, { label: string; color: string }> = {
    low: { label: "Low", color: "text-success bg-success/10" },
    medium: { label: "Medium", color: "text-warning bg-warning/10" },
    high: { label: "High", color: "text-destructive bg-destructive/10" },
    critical: { label: "Critical", color: "text-destructive bg-destructive/20 font-bold" },
  };
  const c = config[level];
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium border-0 rounded-sm px-1.5 py-0.5", c.color)}>
      {c.label}
    </Badge>
  );
}

// ─── Stat Bar ─────────────────────────────────────────────────────────────────

function StatBar() {
  const total = canonicalFields.length;
  const inSync = canonicalFields.filter((f) => f.status === "in_sync").length;
  const critical = canonicalFields.filter((f) => f.driftRisk === "critical").length;
  const drifted = canonicalFields.filter(
    (f) => f.status === "drifted" || f.status === "validation_error"
  ).length;

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-muted/40 border-b border-border text-xs font-mono">
      <span className="text-muted-foreground">
        Total Fields: <span className="text-foreground font-semibold">{total}</span>
      </span>
      <span className="text-muted-foreground">
        In Sync: <span className="text-success font-semibold">{inSync}</span>
      </span>
      <span className="text-muted-foreground">
        Drifted: <span className="text-destructive font-semibold">{drifted}</span>
      </span>
      <span className="text-muted-foreground">
        Critical Risk: <span className="text-destructive font-semibold">{critical}</span>
      </span>
    </div>
  );
}

// ─── Field Detail Panel ───────────────────────────────────────────────────────

function FieldDetailPanel({ field, onClose }: { field: CanonicalField; onClose: () => void }) {
  const source = getSurfaceById(field.canonicalSourceId);
  const consumers = field.consumerSurfaceIds.map((id) => getSurfaceById(id)?.name ?? id);

  return (
    <div className="w-72 shrink-0 border-l border-border bg-muted/20 overflow-y-auto">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <p className="text-xs font-semibold">Field Detail</p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-3 text-xs">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Field Path</p>
          <p className="font-mono text-[11px]">{field.fieldName}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Display Label</p>
          <p className="font-semibold">{field.displayLabel}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Contract Status</p>
          <FieldStatusBadge status={field.status} />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Drift Risk</p>
          <DriftRiskBadge level={field.driftRisk} />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Canonical Owner</p>
          <p className="font-mono text-[11px]">{source?.name ?? field.canonicalSourceId}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Sync Mechanism</p>
          <p>{formatSyncMechanism(field.syncMechanism)}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Consumers</p>
          <div className="flex flex-wrap gap-1">
            {consumers.map((c) => (
              <span key={c} className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded-sm border border-border">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Sync Lag</p>
          <p className="font-mono tabular-nums">{formatSyncLag(field.syncLagSeconds)}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Last Canonical Write</p>
          <p className="font-mono text-[11px]">{formatTimestampShort(field.lastCanonicalWriteAt)}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Last Consumer Ack</p>
          <p className="font-mono text-[11px]">
            {field.lastConsumerAckAt ? formatTimestampShort(field.lastConsumerAckAt) : "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">30-Day Incidents</p>
          <p className={cn("font-mono tabular-nums font-semibold", field.driftIncidentCount > 0 ? "text-destructive" : "text-success")}>
            {field.driftIncidentCount}
          </p>
        </div>
        {field.driftDetail && (
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Drift Detail</p>
            <p className="text-[11px] text-destructive leading-relaxed">{field.driftDetail}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sort Helper ──────────────────────────────────────────────────────────────

type SortKey = "fieldName" | "driftRisk" | "status" | "syncLagSeconds" | "driftIncidentCount";

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: "asc" | "desc" }) {
  if (col !== sortKey) return null;
  return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
}

const RISK_ORDER: Record<DriftRiskLevel, number> = { critical: 0, high: 1, medium: 2, low: 3 };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SourceOfTruthPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("driftRisk");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedField, setSelectedField] = useState<CanonicalField | null>(null);

  function handleSort(col: SortKey) {
    if (col === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir("asc");
    }
  }

  const displayed = useMemo(() => {
    return canonicalFields
      .filter((f) => {
        const q = search.toLowerCase();
        const matchSearch =
          q === "" ||
          f.fieldName.toLowerCase().includes(q) ||
          f.displayLabel.toLowerCase().includes(q);
        const matchRisk = riskFilter === "all" || f.driftRisk === riskFilter;
        const matchStatus = statusFilter === "all" || f.status === statusFilter;
        return matchSearch && matchRisk && matchStatus;
      })
      .sort((a, b) => {
        if (sortKey === "driftRisk") {
          const av = RISK_ORDER[a.driftRisk];
          const bv = RISK_ORDER[b.driftRisk];
          return sortDir === "asc" ? av - bv : bv - av;
        }
        const av = (a[sortKey] as string | number | null) ?? "";
        const bv = (b[sortKey] as string | number | null) ?? "";
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, riskFilter, statusFilter, sortKey, sortDir]);

  const sortableCols: { key: SortKey; label: string }[] = [
    { key: "fieldName", label: "Field Name" },
    { key: "status", label: "Contract Status" },
    { key: "driftRisk", label: "Drift Risk" },
    { key: "syncLagSeconds", label: "Sync Lag" },
    { key: "driftIncidentCount", label: "Incidents (30d)" },
  ];

  return (
    <div className="flex flex-col h-full">
      <FeatureSubnav />
      <StatBar />

      {/* Filter Bar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border shrink-0 flex-wrap bg-background">
        <div className="relative min-w-[180px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search canonical fields..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-7 text-xs rounded-sm font-mono"
          />
        </div>

        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="h-7 w-36 text-xs rounded-sm">
            <SelectValue placeholder="All risk levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-7 w-44 text-xs rounded-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contract Statuses</SelectItem>
            <SelectItem value="in_sync">In Sync</SelectItem>
            <SelectItem value="drifted">Drifted</SelectItem>
            <SelectItem value="stale">Stale</SelectItem>
            <SelectItem value="pending_recompute">Pending Recompute</SelectItem>
            <SelectItem value="validation_error">Validation Error</SelectItem>
            <SelectItem value="no_consumer_ack">No Consumer Ack</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-[10px] text-muted-foreground font-mono shrink-0">
          {displayed.length} / {canonicalFields.length} fields — click a row to inspect
        </span>
      </div>

      {/* Content: table + optional detail panel */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                {sortableCols.map((col) => (
                  <TableHead
                    key={col.key}
                    className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Canonical Owner</TableHead>
                <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Consumers</TableHead>
                <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Sync Mechanism</TableHead>
                <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Last Audited</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-xs text-muted-foreground">
                    No canonical fields match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((field) => {
                  const source = getSurfaceById(field.canonicalSourceId);
                  const consumers = field.consumerSurfaceIds.map((id) => getSurfaceById(id)?.name ?? id);
                  const isSelected = selectedField?.id === field.id;
                  return (
                    <TableRow
                      key={field.id}
                      className={cn(
                        "cursor-pointer text-xs hover:bg-surface-hover transition-colors duration-100",
                        isSelected && "bg-primary/5"
                      )}
                      onClick={() => setSelectedField(isSelected ? null : field)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-mono text-[11px]">{field.fieldName}</p>
                          <p className="text-[10px] text-muted-foreground">{field.displayLabel}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <FieldStatusBadge status={field.status} />
                      </TableCell>
                      <TableCell>
                        <DriftRiskBadge level={field.driftRisk} />
                      </TableCell>
                      <TableCell className="font-mono tabular-nums text-right text-[11px]">
                        {formatSyncLag(field.syncLagSeconds)}
                      </TableCell>
                      <TableCell className={cn("font-mono tabular-nums text-right text-[11px]", field.driftIncidentCount > 0 ? "text-destructive" : "text-muted-foreground")}>
                        {field.driftIncidentCount}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {source?.name ?? field.canonicalSourceId}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {consumers.slice(0, 2).map((c) => (
                            <span key={c} className="font-mono text-[9px] bg-muted px-1 py-0 rounded-sm border border-border whitespace-nowrap">
                              {c}
                            </span>
                          ))}
                          {consumers.length > 2 && (
                            <span className="text-[9px] text-muted-foreground">+{consumers.length - 2}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatSyncMechanism(field.syncMechanism)}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatTimestampShort(field.lastCanonicalWriteAt)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {selectedField && (
          <FieldDetailPanel field={selectedField} onClose={() => setSelectedField(null)} />
        )}
      </div>
    </div>
  );
}
