"use client";

import { useState, useMemo } from "react";
import { webhookEndpoints, scheduledJobs, getSurfaceById } from "@/data/mock-data";
import type { WebhookEndpoint, ScheduledJob, WebhookStatus, ScheduledJobStatus } from "@/lib/types";
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
import { Search, ChevronUp, ChevronDown, Webhook, Timer } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestampShort(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date("2026-03-02T14:00:00Z");
  const diffH = (now.getTime() - d.getTime()) / 3_600_000;
  if (diffH < 1) return `${Math.round(diffH * 60)}m ago`;
  if (diffH < 24) return `${diffH.toFixed(1)}h ago`;
  return `${Math.round(diffH / 24)}d ago`;
}

function formatDurationMs(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function pctColor(pct: number): string {
  if (pct >= 95) return "text-success";
  if (pct >= 80) return "text-warning";
  return "text-destructive";
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function WebhookStatusBadge({ status }: { status: WebhookStatus }) {
  const config: Record<WebhookStatus, { label: string; color: string }> = {
    active: { label: "Active", color: "text-success bg-success/10" },
    degraded: { label: "Degraded", color: "text-warning bg-warning/10" },
    failing: { label: "Failing", color: "text-destructive bg-destructive/10" },
    disabled: { label: "Disabled", color: "text-muted-foreground bg-muted" },
    rate_limited: { label: "Rate Limited", color: "text-warning bg-warning/10" },
  };
  const c = config[status] ?? { label: status, color: "text-muted-foreground bg-muted" };
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium border-0 rounded-sm px-1.5 py-0.5", c.color)}>
      {c.label}
    </Badge>
  );
}

function JobStatusBadge({ status }: { status: ScheduledJobStatus }) {
  const config: Record<ScheduledJobStatus, { label: string; color: string }> = {
    running: { label: "Running", color: "text-primary bg-primary/10" },
    succeeded: { label: "Succeeded", color: "text-success bg-success/10" },
    failed: { label: "Failed", color: "text-destructive bg-destructive/10" },
    missed: { label: "Missed", color: "text-warning bg-warning/10" },
    disabled: { label: "Disabled", color: "text-muted-foreground bg-muted" },
    overdue: { label: "Overdue", color: "text-destructive bg-destructive/20 font-bold" },
  };
  const c = config[status] ?? { label: status, color: "text-muted-foreground bg-muted" };
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium border-0 rounded-sm px-1.5 py-0.5", c.color)}>
      {c.label}
    </Badge>
  );
}

// ─── Stat Bars ─────────────────────────────────────────────────────────────────

function WebhookStatBar({ data }: { data: WebhookEndpoint[] }) {
  const active = data.filter((w) => w.status === "active").length;
  const failing = data.filter((w) => w.status === "failing" || w.status === "rate_limited").length;
  const dlqTotal = data.reduce((s, w) => s + w.deadLetterQueueDepth, 0);
  const avgSuccess = Math.round(
    data.reduce((s, w) => s + w.successRate24h, 0) / data.length
  );
  return (
    <div className="flex items-center gap-6 px-4 py-1.5 bg-muted/40 border-b border-border text-xs font-mono">
      <span className="text-muted-foreground">
        Active: <span className="text-success font-semibold">{active}</span>
      </span>
      <span className="text-muted-foreground">
        Failing / Rate-Limited: <span className="text-destructive font-semibold">{failing}</span>
      </span>
      <span className="text-muted-foreground">
        DLQ Depth: <span className={cn("font-semibold", dlqTotal > 0 ? "text-warning" : "text-muted-foreground")}>{dlqTotal}</span>
      </span>
      <span className="text-muted-foreground">
        Avg Success 24h: <span className={cn("font-semibold", pctColor(avgSuccess))}>{avgSuccess}%</span>
      </span>
    </div>
  );
}

function JobStatBar({ data }: { data: ScheduledJob[] }) {
  const healthy = data.filter((j) => j.status === "succeeded").length;
  const failing = data.filter((j) => j.status === "failed" || j.status === "overdue" || j.status === "missed").length;
  return (
    <div className="flex items-center gap-6 px-4 py-1.5 bg-muted/40 border-b border-border text-xs font-mono">
      <span className="text-muted-foreground">
        Succeeded: <span className="text-success font-semibold">{healthy}</span>
      </span>
      <span className="text-muted-foreground">
        Failing / Overdue / Missed: <span className="text-destructive font-semibold">{failing}</span>
      </span>
      <span className="text-muted-foreground">
        Total: <span className="text-foreground font-semibold">{data.length}</span>
      </span>
    </div>
  );
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

type WHSortKey = "successRate24h" | "avgLatencyMs" | "deadLetterQueueDepth" | "eventsPerHour";
type JobSortKey = "status" | "consecutiveFailures" | "avgRunDurationMs";

function SortIconWH({ col, sortKey, sortDir }: { col: WHSortKey; sortKey: WHSortKey; sortDir: "asc" | "desc" }) {
  if (col !== sortKey) return null;
  return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
}

function SortIconJob({ col, sortKey, sortDir }: { col: JobSortKey; sortKey: JobSortKey; sortDir: "asc" | "desc" }) {
  if (col !== sortKey) return null;
  return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WebhookLogsPage() {
  const [webhookSearch, setWebhookSearch] = useState("");
  const [webhookStatus, setWebhookStatus] = useState<string>("all");
  const [whSortKey, setWhSortKey] = useState<WHSortKey>("successRate24h");
  const [whSortDir, setWhSortDir] = useState<"asc" | "desc">("asc");

  const [jobSearch, setJobSearch] = useState("");
  const [jobStatus, setJobStatus] = useState<string>("all");
  const [jobSortKey, setJobSortKey] = useState<JobSortKey>("consecutiveFailures");
  const [jobSortDir, setJobSortDir] = useState<"asc" | "desc">("desc");

  function handleWhSort(col: WHSortKey) {
    if (col === whSortKey) setWhSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setWhSortKey(col); setWhSortDir("desc"); }
  }

  function handleJobSort(col: JobSortKey) {
    if (col === jobSortKey) setJobSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setJobSortKey(col); setJobSortDir("desc"); }
  }

  const displayedWebhooks = useMemo(() => {
    return webhookEndpoints
      .filter((w) => {
        const src = getSurfaceById(w.sourceSurfaceId)?.name ?? w.sourceSurfaceId;
        const tgt = getSurfaceById(w.targetSurfaceId)?.name ?? w.targetSurfaceId;
        const q = webhookSearch.toLowerCase();
        const matchSearch =
          q === "" ||
          w.name.toLowerCase().includes(q) ||
          w.url.toLowerCase().includes(q) ||
          src.toLowerCase().includes(q) ||
          tgt.toLowerCase().includes(q);
        const matchStatus = webhookStatus === "all" || w.status === webhookStatus;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        const av = a[whSortKey] as number;
        const bv = b[whSortKey] as number;
        return whSortDir === "asc" ? av - bv : bv - av;
      });
  }, [webhookSearch, webhookStatus, whSortKey, whSortDir]);

  const displayedJobs = useMemo(() => {
    return scheduledJobs
      .filter((j) => {
        const q = jobSearch.toLowerCase();
        const matchSearch =
          q === "" ||
          j.name.toLowerCase().includes(q) ||
          j.cronExpression.includes(q) ||
          j.scheduleLabel.toLowerCase().includes(q);
        const matchStatus = jobStatus === "all" || j.status === jobStatus;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        if (jobSortKey === "status") {
          return jobSortDir === "asc"
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        }
        const av = (a[jobSortKey] ?? 0) as number;
        const bv = (b[jobSortKey] ?? 0) as number;
        return jobSortDir === "asc" ? av - bv : bv - av;
      });
  }, [jobSearch, jobStatus, jobSortKey, jobSortDir]);

  const whSortableCols: { key: WHSortKey; label: string }[] = [
    { key: "successRate24h", label: "Success Rate 24h" },
    { key: "avgLatencyMs", label: "Avg Latency" },
    { key: "eventsPerHour", label: "Events/hr" },
    { key: "deadLetterQueueDepth", label: "DLQ Depth" },
  ];

  const jobSortableCols: { key: JobSortKey; label: string }[] = [
    { key: "status", label: "Status" },
    { key: "consecutiveFailures", label: "Consec. Failures" },
    { key: "avgRunDurationMs", label: "Avg Duration" },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto">
      <FeatureSubnav />

      {/* ── Webhook Endpoints Section ──────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background shrink-0">
        <Webhook className="h-3.5 w-3.5 text-primary" />
        <h2 className="text-xs font-semibold tracking-tight">Webhook Endpoints</h2>
        <span className="text-[10px] text-muted-foreground font-mono ml-1">
          {displayedWebhooks.length} / {webhookEndpoints.length}
        </span>
      </div>
      <WebhookStatBar data={displayedWebhooks} />

      {/* Webhook filters */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border shrink-0 flex-wrap bg-background">
        <div className="relative min-w-[160px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search webhooks..."
            value={webhookSearch}
            onChange={(e) => setWebhookSearch(e.target.value)}
            className="pl-7 h-7 text-xs rounded-sm font-mono"
          />
        </div>
        <Select value={webhookStatus} onValueChange={setWebhookStatus}>
          <SelectTrigger className="h-7 w-36 text-xs rounded-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="failing">Failing</SelectItem>
            <SelectItem value="rate_limited">Rate Limited</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Webhook table */}
      <div className="overflow-x-auto shrink-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Webhook Name</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">URL</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Status</TableHead>
              {whSortableCols.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                  onClick={() => handleWhSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIconWH col={col.key} sortKey={whSortKey} sortDir={whSortDir} />
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">p95 Latency</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Retry Policy</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Last Triggered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedWebhooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-20 text-center text-xs text-muted-foreground">
                  No webhook endpoints match this filter.
                </TableCell>
              </TableRow>
            ) : (
              displayedWebhooks.map((wh) => (
                <TableRow key={wh.id} className="text-xs hover:bg-surface-hover transition-colors duration-100">
                  <TableCell>
                    <div>
                      <p className="font-medium text-[11px]">{wh.name}</p>
                      <p className="text-[9px] text-muted-foreground font-mono">{wh.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{wh.url}</TableCell>
                  <TableCell>
                    <WebhookStatusBadge status={wh.status} />
                  </TableCell>
                  <TableCell className={cn("font-mono tabular-nums text-right text-[11px]", pctColor(wh.successRate24h))}>
                    {wh.successRate24h.toFixed(1)}%
                  </TableCell>
                  <TableCell className="font-mono tabular-nums text-right text-[11px]">
                    {wh.avgLatencyMs} ms
                  </TableCell>
                  <TableCell className="font-mono tabular-nums text-right text-[11px]">
                    {wh.eventsPerHour.toFixed(1)}/hr
                  </TableCell>
                  <TableCell className={cn("font-mono tabular-nums text-right text-[11px]", wh.deadLetterQueueDepth > 0 ? "text-warning" : "text-muted-foreground")}>
                    {wh.deadLetterQueueDepth}
                  </TableCell>
                  <TableCell className="font-mono tabular-nums text-right text-[11px]">
                    {wh.p95LatencyMs > 0 ? `${wh.p95LatencyMs} ms` : "—"}
                  </TableCell>
                  <TableCell className="text-[10px] text-muted-foreground capitalize">
                    {wh.retryPolicy} ({wh.maxRetries} max)
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatTimestampShort(wh.lastTriggeredAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Scheduled Jobs Section ─────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-t border-border bg-background mt-0 shrink-0">
        <Timer className="h-3.5 w-3.5 text-primary" />
        <h2 className="text-xs font-semibold tracking-tight">Scheduled Jobs</h2>
        <span className="text-[10px] text-muted-foreground font-mono ml-1">
          {displayedJobs.length} / {scheduledJobs.length}
        </span>
      </div>
      <JobStatBar data={displayedJobs} />

      {/* Job filters */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border shrink-0 flex-wrap bg-background">
        <div className="relative min-w-[160px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search scheduled jobs..."
            value={jobSearch}
            onChange={(e) => setJobSearch(e.target.value)}
            className="pl-7 h-7 text-xs rounded-sm font-mono"
          />
        </div>
        <Select value={jobStatus} onValueChange={setJobStatus}>
          <SelectTrigger className="h-7 w-36 text-xs rounded-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="succeeded">Succeeded</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jobs table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Job Name</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Schedule</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Target System</TableHead>
              {jobSortableCols.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap"
                  onClick={() => handleJobSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIconJob col={col.key} sortKey={jobSortKey} sortDir={jobSortDir} />
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Last Run</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Next Run</TableHead>
              <TableHead className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-20 text-center text-xs text-muted-foreground">
                  No scheduled jobs match this filter.
                </TableCell>
              </TableRow>
            ) : (
              displayedJobs.map((job) => {
                const target = getSurfaceById(job.targetSurfaceId);
                return (
                  <TableRow key={job.id} className={cn("text-xs hover:bg-surface-hover transition-colors duration-100", (job.status === "overdue" || job.status === "failed") && "border-l-2 border-l-destructive")}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[11px]">{job.name}</p>
                        <p className="text-[9px] text-muted-foreground font-mono">{job.cronExpression}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">{job.scheduleLabel}</TableCell>
                    <TableCell className="text-[10px] text-muted-foreground">{target?.name ?? job.targetSurfaceId}</TableCell>
                    <TableCell>
                      <JobStatusBadge status={job.status} />
                    </TableCell>
                    <TableCell className={cn("font-mono tabular-nums text-right text-[11px]", job.consecutiveFailures > 0 ? "text-destructive" : "text-muted-foreground")}>
                      {job.consecutiveFailures}
                    </TableCell>
                    <TableCell className="font-mono tabular-nums text-right text-[11px]">
                      {formatDurationMs(job.avgRunDurationMs)}
                    </TableCell>
                    <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatTimestampShort(job.lastRunAt)}
                    </TableCell>
                    <TableCell className={cn("font-mono text-[10px] whitespace-nowrap", new Date(job.nextRunAt) < new Date("2026-03-02T14:00:00Z") ? "text-destructive" : "text-muted-foreground")}>
                      {formatTimestampShort(job.nextRunAt)}
                    </TableCell>
                    <TableCell className="text-[10px] text-muted-foreground max-w-[200px] truncate">
                      {job.statusNote ?? "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
