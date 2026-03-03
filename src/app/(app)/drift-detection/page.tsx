"use client";

import { useState, useMemo } from "react";
import { driftIncidents, getSurfaceById } from "@/data/mock-data";
import type { DriftIncident, DriftSeverity, DriftResolutionStatus } from "@/lib/types";
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
import { Search, ChevronUp, ChevronDown, AlertTriangle, ShieldAlert } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestampShort(iso: string): string {
  const d = new Date(iso);
  const now = new Date("2026-03-02T14:00:00Z");
  const diffH = (now.getTime() - d.getTime()) / 3_600_000;
  if (diffH < 1) return `${Math.round(diffH * 60)}m ago`;
  if (diffH < 24) return `${diffH.toFixed(1)}h ago`;
  return `${Math.round(diffH / 24)}d ago`;
}

function formatSilentDrift(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${(minutes / 60).toFixed(1)}h`;
  return `${(minutes / 1440).toFixed(1)}d`;
}

function formatResolutionStatus(s: DriftResolutionStatus): string {
  const map: Record<DriftResolutionStatus, string> = {
    detected: "Detected",
    under_investigation: "Investigating",
    pending_recompute: "Pending Recompute",
    escalated: "Escalated",
    resolved: "Resolved",
    accepted_divergence: "Accepted",
  };
  return map[s] ?? s;
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: DriftSeverity }) {
  const config: Record<DriftSeverity, { label: string; color: string }> = {
    low: { label: "Low", color: "text-success bg-success/10" },
    medium: { label: "Medium", color: "text-warning bg-warning/10" },
    high: { label: "High", color: "text-destructive bg-destructive/10" },
    critical: { label: "Critical", color: "text-destructive bg-destructive/20 font-bold" },
  };
  const c = config[severity];
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium border-0 rounded-sm px-1.5 py-0.5", c.color)}>
      {c.label}
    </Badge>
  );
}

function ResolutionBadge({ status }: { status: DriftResolutionStatus }) {
  const config: Record<DriftResolutionStatus, { color: string }> = {
    detected: { color: "text-warning bg-warning/10" },
    under_investigation: { color: "text-primary bg-primary/10" },
    pending_recompute: { color: "text-primary bg-primary/10" },
    escalated: { color: "text-destructive bg-destructive/10" },
    resolved: { color: "text-success bg-success/10" },
    accepted_divergence: { color: "text-muted-foreground bg-muted" },
  };
  const c = config[status] ?? { color: "text-muted-foreground bg-muted" };
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium border-0 rounded-sm px-1.5 py-0.5", c.color)}>
      {formatResolutionStatus(status)}
    </Badge>
  );
}

// ─── Stat Bar ─────────────────────────────────────────────────────────────────

function StatBar() {
  const total = driftIncidents.length;
  const open = driftIncidents.filter((d) => d.resolutionStatus !== "resolved" && d.resolutionStatus !== "accepted_divergence").length;
  const critical = driftIncidents.filter((d) => d.severity === "critical").length;
  const silentFailures = driftIncidents.filter((d) => d.causedSilentFailure).length;
  const avgSilent = Math.round(
    driftIncidents.reduce((s, d) => s + d.silentDriftMinutes, 0) / total
  );

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-muted/40 border-b border-border text-xs font-mono">
      <span className="text-muted-foreground">
        Total Incidents: <span className="text-foreground font-semibold">{total}</span>
      </span>
      <span className="text-muted-foreground">
        Open: <span className="text-destructive font-semibold">{open}</span>
      </span>
      <span className="text-muted-foreground">
        Critical: <span className="text-destructive font-semibold">{critical}</span>
      </span>
      <span className="text-muted-foreground">
        Caused Silent Failure: <span className="text-warning font-semibold">{silentFailures}</span>
      </span>
      <span className="text-muted-foreground">
        Avg Undetected: <span className="text-foreground font-semibold">{formatSilentDrift(avgSilent)}</span>
      </span>
    </div>
  );
}

// ─── Sort Helper ─────────────────────────────────────────────────────────────

type SortKey = "detectedAt" | "severity" | "silentDriftMinutes" | "resolutionStatus";

const SEVERITY_ORDER: Record<DriftSeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: "asc" | "desc" }) {
  if (col !== sortKey) return null;
  return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DriftDetectionPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("severity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleSort(col: SortKey) {
    if (col === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir(col === "severity" ? "asc" : "desc");
    }
  }

  const displayed = useMemo(() => {
    return driftIncidents
      .filter((d) => {
        const src = getSurfaceById(d.canonicalSourceId)?.name ?? d.canonicalSourceId;
        const consumer = getSurfaceById(d.divergentConsumerId)?.name ?? d.divergentConsumerId;
        const q = search.toLowerCase();
        const matchSearch =
          q === "" ||
          d.fieldName.toLowerCase().includes(q) ||
          src.toLowerCase().includes(q) ||
          consumer.toLowerCase().includes(q) ||
          (d.assignedTo ?? "").toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q);
        const matchSeverity = severityFilter === "all" || d.severity === severityFilter;
        const matchStatus = statusFilter === "all" || d.resolutionStatus === statusFilter;
        return matchSearch && matchSeverity && matchStatus;
      })
      .sort((a, b) => {
        if (sortKey === "severity") {
          const av = SEVERITY_ORDER[a.severity];
          const bv = SEVERITY_ORDER[b.severity];
          return sortDir === "asc" ? av - bv : bv - av;
        }
        const av = a[sortKey] as string | number;
        const bv = b[sortKey] as string | number;
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, severityFilter, statusFilter, sortKey, sortDir]);

  const sortableCols: { key: SortKey; label: string }[] = [
    { key: "severity", label: "Severity" },
    { key: "detectedAt", label: "Detected At" },
    { key: "silentDriftMinutes", label: "Undetected For" },
    { key: "resolutionStatus", label: "Status" },
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
            placeholder="Search drift incidents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-7 text-xs rounded-sm font-mono"
          />
        </div>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="h-7 w-32 text-xs rounded-sm">
            <SelectValue placeholder="All severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
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
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="detected">Detected</SelectItem>
            <SelectItem value="under_investigation">Investigating</SelectItem>
            <SelectItem value="pending_recompute">Pending Recompute</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="accepted_divergence">Accepted Divergence</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-[10px] text-muted-foreground font-mono shrink-0">
          {displayed.length} / {driftIncidents.length} incidents — click row to expand
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Field</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Expected Value</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Actual Value</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Source System</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Drifted System</TableHead>
              {sortableCols.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Assigned</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Silent Failure</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center text-xs text-muted-foreground">
                  No drift incidents match this filter.
                </TableCell>
              </TableRow>
            ) : (
              displayed.map((incident) => {
                const src = getSurfaceById(incident.canonicalSourceId)?.name ?? incident.canonicalSourceId;
                const consumer = getSurfaceById(incident.divergentConsumerId)?.name ?? incident.divergentConsumerId;
                const isExpanded = expandedId === incident.id;
                return (
                  <>
                    <TableRow
                      key={incident.id}
                      className={cn(
                        "cursor-pointer text-xs hover:bg-surface-hover transition-colors duration-100",
                        isExpanded && "bg-accent/20",
                        incident.severity === "critical" && "border-l-2 border-l-destructive"
                      )}
                      onClick={() => setExpandedId(isExpanded ? null : incident.id)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-mono text-[11px]">{incident.fieldName}</p>
                          <p className="text-[9px] text-muted-foreground font-mono">{incident.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-[10px] max-w-[120px] truncate text-success">
                        {incident.expectedValue}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] max-w-[120px] truncate text-destructive">
                        {incident.actualValue}
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground whitespace-nowrap">{src}</TableCell>
                      <TableCell className="text-[10px] text-muted-foreground whitespace-nowrap">{consumer}</TableCell>
                      <TableCell>
                        <SeverityBadge severity={incident.severity} />
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatTimestampShort(incident.detectedAt)}
                      </TableCell>
                      <TableCell className={cn("font-mono tabular-nums text-[11px] whitespace-nowrap", incident.silentDriftMinutes > 60 ? "text-warning" : "text-muted-foreground")}>
                        {formatSilentDrift(incident.silentDriftMinutes)}
                      </TableCell>
                      <TableCell>
                        <ResolutionBadge status={incident.resolutionStatus} />
                      </TableCell>
                      <TableCell className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {incident.assignedTo ?? "Unassigned"}
                      </TableCell>
                      <TableCell>
                        {incident.causedSilentFailure ? (
                          <ShieldAlert className="h-3.5 w-3.5 text-destructive" />
                        ) : (
                          <span className="text-[10px] text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${incident.id}-detail`}>
                        <TableCell colSpan={11} className="bg-muted/30 px-4 py-3">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Drift Delta</p>
                              <p className="font-mono text-warning">{incident.driftDelta}</p>
                            </div>
                            {incident.rootCause && (
                              <div className="col-span-2">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Root Cause</p>
                                <p className="text-[11px] leading-relaxed">{incident.rootCause}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Resolved At</p>
                              <p className="font-mono text-[11px]">{incident.resolvedAt ? formatTimestampShort(incident.resolvedAt) : "Open"}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Caused Silent Failure</p>
                              <p className={cn("font-mono font-semibold", incident.causedSilentFailure ? "text-destructive" : "text-muted-foreground")}>
                                {incident.causedSilentFailure ? "Yes" : "No"}
                              </p>
                            </div>
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
