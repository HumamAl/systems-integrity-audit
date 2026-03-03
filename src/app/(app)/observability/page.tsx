"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  webhookLatencyByHour,
  webhookEndpoints,
  integrationSurfaces,
  driftIncidents,
  syncEvents,
  scheduledJobs,
} from "@/data/mock-data";
import { FeatureSubnav } from "@/components/layout/feature-subnav";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Zap,
  Activity,
  ShieldAlert,
} from "lucide-react";
import type { IntegrationSurface } from "@/lib/types";

// ─── Dynamic chart import (SSR-safe) ─────────────────────────────────────────

const WebhookLatencyChart = dynamic(
  () =>
    import("@/components/dashboard/webhook-latency-chart").then(
      (m) => m.WebhookLatencyChart
    ),
  { ssr: false }
);

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

function SurfaceHealthBadge({ status }: { status: IntegrationSurface["status"] }) {
  const config = {
    in_sync: { label: "In Sync", color: "text-success bg-success/10" },
    drifted: { label: "Drifted", color: "text-destructive bg-destructive/10" },
    degraded: { label: "Degraded", color: "text-warning bg-warning/10" },
    failed: { label: "Failed", color: "text-destructive bg-destructive/20" },
    stale: { label: "Stale", color: "text-warning bg-warning/10" },
    pending_recompute: { label: "Pending", color: "text-primary bg-primary/10" },
  } as const;
  const c = config[status] ?? { label: status, color: "text-muted-foreground bg-muted" };
  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium border-0 rounded-sm px-1.5 py-0.5", c.color)}>
      {c.label}
    </Badge>
  );
}

// ─── Recent Alerts derived from incidents + failed events ────────────────────

type Alert = {
  id: string;
  type: "drift" | "webhook_failure" | "job_overdue" | "timeout";
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  timestamp: string;
};

function buildAlerts(): Alert[] {
  const alerts: Alert[] = [];

  // Critical + high drift incidents
  driftIncidents
    .filter((d) => (d.severity === "critical" || d.severity === "high") && d.resolutionStatus !== "resolved")
    .slice(0, 4)
    .forEach((d) => {
      alerts.push({
        id: d.id,
        type: "drift",
        severity: d.severity,
        message: `Field drift: ${d.fieldName} — ${d.driftDelta} (${d.resolutionStatus.replace("_", " ")})`,
        timestamp: d.detectedAt,
      });
    });

  // Failed webhooks
  const failedEvts = syncEvents.filter((e) => e.status === "failed" || e.status === "timed_out").slice(0, 3);
  failedEvts.forEach((e) => {
    alerts.push({
      id: e.id,
      type: e.status === "timed_out" ? "timeout" : "webhook_failure",
      severity: e.retryCount === 0 ? "high" : "medium",
      message: `${e.eventType === "webhook_trigger" ? "Webhook" : "Sync"} ${e.status.replace("_", " ")}: ${e.errorCode ?? "no error code"} — ${e.errorMessage?.slice(0, 60) ?? ""}...`,
      timestamp: e.triggeredAt,
    });
  });

  // Overdue / failed jobs
  scheduledJobs
    .filter((j) => j.status === "overdue" || (j.status === "failed" && j.consecutiveFailures >= 2))
    .forEach((j) => {
      alerts.push({
        id: j.id,
        type: "job_overdue",
        severity: j.consecutiveFailures >= 3 ? "critical" : "high",
        message: `Job ${j.status}: ${j.name} — ${j.statusNote ?? "no details"}`,
        timestamp: j.lastRunAt ?? j.nextRunAt,
      });
    });

  return alerts
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);
}

const ALERT_ICON = {
  drift: <AlertTriangle className="h-3 w-3" />,
  webhook_failure: <XCircle className="h-3 w-3" />,
  job_overdue: <Clock className="h-3 w-3" />,
  timeout: <Zap className="h-3 w-3" />,
};

const ALERT_COLOR: Record<Alert["severity"], string> = {
  critical: "text-destructive border-destructive/30 bg-destructive/5",
  high: "text-destructive border-destructive/20 bg-destructive/5",
  medium: "text-warning border-warning/20 bg-warning/5",
  low: "text-muted-foreground border-border bg-muted/30",
};

// ─── Integration Health Summary ───────────────────────────────────────────────

function HealthGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-0 border border-border divide-x divide-border">
      {integrationSurfaces.map((surface) => (
        <div key={surface.id} className="p-3 space-y-1.5">
          <div className="flex items-start justify-between gap-1">
            <p className="text-[11px] font-medium leading-tight">{surface.name}</p>
            <SurfaceHealthBadge status={surface.status} />
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Uptime</span>
              <span className={cn("font-mono tabular-nums", surface.uptimePct >= 99 ? "text-success" : surface.uptimePct >= 95 ? "text-warning" : "text-destructive")}>
                {surface.uptimePct.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Avg Latency</span>
              <span className="font-mono tabular-nums">{surface.avgSyncLatencyMs} ms</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Fragility</span>
              <span className={cn("font-mono tabular-nums", surface.syncFragilityScore >= 60 ? "text-destructive" : surface.syncFragilityScore >= 35 ? "text-warning" : "text-success")}>
                {surface.syncFragilityScore}/100
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Last Check</span>
              <span className="font-mono tabular-nums text-muted-foreground">{formatTimestampShort(surface.lastHealthCheckAt)}</span>
            </div>
          </div>
          {surface.statusNote && (
            <p className="text-[10px] text-warning leading-tight border-t border-border/60 pt-1">
              {surface.statusNote}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── KPI Stats ────────────────────────────────────────────────────────────────

function StatBar() {
  const successfulEvents = syncEvents.filter((e) => e.status === "success").length;
  const totalEvents = syncEvents.length;
  const eventSuccessRate = Math.round((successfulEvents / totalEvents) * 100);

  const openAlerts = driftIncidents.filter(
    (d) => d.resolutionStatus !== "resolved" && d.resolutionStatus !== "accepted_divergence"
  ).length;

  const avgWhLatency = Math.round(
    webhookLatencyByHour.reduce((s, p) => s + p.avgMs, 0) / webhookLatencyByHour.length
  );

  const silentFailures = driftIncidents.filter((d) => d.causedSilentFailure).length;

  const stats = [
    {
      label: "Event Success Rate",
      value: `${eventSuccessRate}%`,
      icon: <Activity className="h-3.5 w-3.5" />,
      color: eventSuccessRate >= 90 ? "text-success" : "text-warning",
    },
    {
      label: "Open Drift Incidents",
      value: String(openAlerts),
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      color: openAlerts > 5 ? "text-destructive" : "text-warning",
    },
    {
      label: "Avg Webhook Latency",
      value: `${avgWhLatency} ms`,
      icon: <Zap className="h-3.5 w-3.5" />,
      color: avgWhLatency > 800 ? "text-warning" : "text-success",
    },
    {
      label: "Silent Failures",
      value: String(silentFailures),
      icon: <ShieldAlert className="h-3.5 w-3.5" />,
      color: silentFailures > 0 ? "text-destructive" : "text-success",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b border-border divide-x divide-border">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2 px-4 py-2.5">
          <span className={cn("shrink-0", stat.color)}>{stat.icon}</span>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</p>
            <p className={cn("font-mono tabular-nums font-semibold text-sm leading-tight", stat.color)}>
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Alert Feed ───────────────────────────────────────────────────────────────

const alerts = buildAlerts();

type AlertFilterType = "all" | "drift" | "webhook_failure" | "job_overdue" | "timeout";

function AlertFeed() {
  const [filter, setFilter] = useState<AlertFilterType>("all");

  const displayed = filter === "all" ? alerts : alerts.filter((a) => a.type === filter);

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-3.5 w-3.5 text-primary" />
          <p className="text-xs font-semibold">Recent Alerts &amp; Incidents</p>
        </div>
        <div className="flex items-center gap-1">
          {(["all", "drift", "webhook_failure", "job_overdue", "timeout"] as AlertFilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2 py-0.5 text-[10px] rounded-sm border transition-colors duration-100",
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" ? "All" : f === "drift" ? "Drift" : f === "webhook_failure" ? "Webhook" : f === "job_overdue" ? "Jobs" : "Timeout"}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {displayed.length === 0 ? (
          <div className="flex items-center gap-2 px-4 py-6 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" />
            No alerts match this filter.
          </div>
        ) : (
          displayed.map((alert) => (
            <div
              key={alert.id}
              className={cn("flex items-start gap-3 px-3 py-2.5 border-l-2 text-xs", ALERT_COLOR[alert.severity])}
            >
              <span className="shrink-0 mt-0.5">{ALERT_ICON[alert.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] leading-relaxed line-clamp-2">{alert.message}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] opacity-70 whitespace-nowrap">
                {formatTimestampShort(alert.timestamp)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ObservabilityPage() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <FeatureSubnav />
      <StatBar />

      <div className="p-4 space-y-4">
        {/* Integration Health Summary */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-xs font-semibold tracking-tight">Integration Health Summary</h2>
          </div>
          <HealthGrid />
        </div>

        {/* Webhook Latency Chart */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-xs font-semibold tracking-tight">Webhook Latency — Last 12 Hours</h2>
            <span className="text-[10px] text-muted-foreground font-mono">Avg ms / p95 ms / Failure count</span>
          </div>
          <div className="border border-border p-3 bg-card">
            <WebhookLatencyChart data={webhookLatencyByHour} />
          </div>
        </div>

        {/* Recent Alerts */}
        <AlertFeed />
      </div>
    </div>
  );
}
