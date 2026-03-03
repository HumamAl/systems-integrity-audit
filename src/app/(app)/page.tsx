"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Activity,
  Database,
  LayoutDashboard,
  Radio,
  BarChart2,
  ShieldAlert,
  Webhook,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import {
  integrationSurfaces,
  syncEvents,
  dashboardStats,
  syncHealthByMonth,
  driftBySurface,
  getSurfaceById,
} from "@/data/mock-data";
import type {
  IntegrationSurface,
  IntegrationSurfaceStatus,
  SyncEventStatus,
} from "@/lib/types";

// ─── SSR-safe dynamic chart imports ───────────────────────────────────────────

const SyncHealthChart = dynamic(
  () =>
    import("@/components/dashboard/sync-health-chart").then(
      (m) => m.SyncHealthChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] bg-muted/30 border border-border/40 rounded-sm animate-pulse" />
    ),
  }
);

const DriftBySurfaceChart = dynamic(
  () =>
    import("@/components/dashboard/drift-by-surface-chart").then(
      (m) => m.DriftBySurfaceChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] bg-muted/30 border border-border/40 rounded-sm animate-pulse" />
    ),
  }
);

// ─── useCountUp hook ──────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ─── Sub-nav items ────────────────────────────────────────────────────────────

const subNavItems = [
  { label: "System Overview", href: "/", icon: LayoutDashboard },
  { label: "Sync Monitor", href: "/sync-monitor", icon: Activity },
  { label: "Source of Truth", href: "/source-of-truth", icon: Database },
  { label: "Drift Detection", href: "/drift-detection", icon: ShieldAlert },
  { label: "Webhook Logs", href: "/webhook-logs", icon: Webhook },
  { label: "Observability", href: "/observability", icon: Eye },
];

// ─── Status helpers ───────────────────────────────────────────────────────────

function getStatusColor(status: IntegrationSurfaceStatus): string {
  switch (status) {
    case "in_sync":
      return "bg-success";
    case "degraded":
    case "stale":
    case "pending_recompute":
      return "bg-warning";
    case "drifted":
    case "failed":
      return "bg-destructive";
    default:
      return "bg-muted-foreground";
  }
}

function getStatusLabel(status: IntegrationSurfaceStatus): string {
  switch (status) {
    case "in_sync":
      return "In Sync";
    case "drifted":
      return "Drifted";
    case "degraded":
      return "Degraded";
    case "failed":
      return "Failed";
    case "stale":
      return "Stale";
    case "pending_recompute":
      return "Pending Recompute";
    default:
      return status;
  }
}

function getSyncEventStatusColor(status: SyncEventStatus): string {
  switch (status) {
    case "success":
      return "text-success bg-success/10 border-success/20";
    case "partial":
      return "text-warning bg-warning/10 border-warning/20";
    case "pending":
      return "text-primary bg-primary/10 border-primary/20";
    case "failed":
    case "timed_out":
    case "dead_lettered":
      return "text-destructive bg-destructive/10 border-destructive/20";
    default:
      return "text-muted-foreground bg-muted border-border";
  }
}

function getSyncEventStatusLabel(status: SyncEventStatus): string {
  switch (status) {
    case "success":
      return "Processed";
    case "failed":
      return "Failed";
    case "timed_out":
      return "Timed Out";
    case "dead_lettered":
      return "DLQ'd";
    case "partial":
      return "Partial";
    case "pending":
      return "Pending";
    default:
      return status;
  }
}

function formatRelativeTime(isoString: string): string {
  const now = new Date("2026-03-02T14:00:00Z");
  const then = new Date(isoString);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

function formatEventType(t: string): string {
  switch (t) {
    case "webhook_trigger":
      return "Webhook";
    case "scheduled_job":
      return "Scheduled Job";
    case "recompute":
      return "Recompute";
    case "manual_reconcile":
      return "Manual Reconcile";
    case "dead_letter_retry":
      return "DLQ Retry";
    default:
      return t;
  }
}

// ─── Inline stat counter component ───────────────────────────────────────────

function StatCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const intPart = Math.floor(value);
  const { count, ref } = useCountUp(intPart, 900);
  const displayVal =
    decimals > 0
      ? (count + (value - intPart)).toFixed(decimals)
      : count.toString();
  return (
    <span ref={ref} className="font-mono tabular-nums">
      {prefix}
      {displayVal}
      {suffix}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SystemOverviewPage() {
  const [activeNav, setActiveNav] = useState("/");
  const [eventFilter, setEventFilter] = useState<"all" | "failed" | "success">(
    "all"
  );

  // Count integrations online
  const onlineCount = integrationSurfaces.filter(
    (s) => s.status === "in_sync"
  ).length;
  const totalCount = integrationSurfaces.length;

  const filteredEvents = useMemo(() => {
    const base = syncEvents.slice(0, 15);
    if (eventFilter === "all") return base;
    if (eventFilter === "failed")
      return base.filter((e) =>
        ["failed", "timed_out", "dead_lettered"].includes(e.status)
      );
    if (eventFilter === "success")
      return base.filter((e) => e.status === "success");
    return base;
  }, [eventFilter]);

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Sub-nav ──────────────────────────────────────────────── */}
      <nav className="flex items-center gap-0 border-b border-border overflow-x-auto shrink-0 bg-background">
        {subNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setActiveNav(item.href)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium whitespace-nowrap border-b-2 transition-colors",
                "hover:text-foreground hover:bg-muted/50",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              )}
              style={{ transition: "color var(--t-interactive), background-color var(--t-interactive)" }}
            >
              <Icon className="h-3 w-3 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="flex-1 p-4 space-y-4">

        {/* ── 1. Top Stat Bar ────────────────────────────────────── */}
        <div className="linear-card flex flex-wrap items-center gap-0 divide-x divide-border overflow-hidden">
          {/* Integrations Online */}
          <div className="flex flex-col px-4 py-2.5 min-w-[130px]">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-0.5">
              Integrations Online
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-xl font-bold font-mono tabular-nums",
                  onlineCount < totalCount
                    ? "text-warning"
                    : "text-success"
                )}
              >
                {onlineCount}/{totalCount}
              </span>
              {onlineCount < totalCount && (
                <span className="text-[10px] text-destructive font-mono">
                  {totalCount - onlineCount} degraded
                </span>
              )}
            </div>
          </div>

          {/* Active Alerts */}
          <div className="flex flex-col px-4 py-2.5 min-w-[120px]">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-0.5">
              Active Alerts
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono tabular-nums text-destructive">
                <StatCounter value={dashboardStats.driftEventsDetected} />
              </span>
              <span className="text-[10px] text-destructive font-mono">
                +{dashboardStats.driftEventsChange}%
              </span>
            </div>
          </div>

          {/* Avg Uptime */}
          <div className="flex flex-col px-4 py-2.5 min-w-[120px]">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-0.5">
              Avg Uptime
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono tabular-nums text-success">
                {(
                  integrationSurfaces.reduce(
                    (acc, s) => acc + s.uptimePct,
                    0
                  ) / integrationSurfaces.length
                ).toFixed(1)}
                %
              </span>
              <TrendingUp className="h-3 w-3 text-success" />
            </div>
          </div>

          {/* Drift Rate */}
          <div className="flex flex-col px-4 py-2.5 min-w-[110px]">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-0.5">
              Drift Rate
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono tabular-nums text-warning">
                <StatCounter value={2.3} decimals={1} suffix="%" />
              </span>
              <TrendingDown className="h-3 w-3 text-destructive" />
            </div>
          </div>

          {/* P95 Latency */}
          <div className="flex flex-col px-4 py-2.5 min-w-[110px]">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-0.5">
              P95 Latency
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono tabular-nums text-warning">
                <StatCounter value={340} suffix="ms" />
              </span>
              <TrendingDown className="h-3 w-3 text-destructive" />
            </div>
          </div>

          {/* Failed Webhooks 24h */}
          <div className="flex flex-col px-4 py-2.5 min-w-[140px]">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-0.5">
              Failed Webhooks 24h
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono tabular-nums text-destructive">
                <StatCounter value={dashboardStats.failedWebhooks24h} />
              </span>
              <span className="text-[10px] text-destructive font-mono">
                +{dashboardStats.failedWebhooksChange}%
              </span>
            </div>
          </div>

          {/* Sync Events 24h */}
          <div className="flex flex-col px-4 py-2.5 min-w-[130px]">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-0.5">
              Sync Events 24h
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono tabular-nums text-foreground">
                <StatCounter value={dashboardStats.totalSyncEvents24h} />
              </span>
              <span className="text-[10px] text-success font-mono">
                {dashboardStats.syncEventsChange}%
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. Integration Status Matrix ─────────────────────── */}
        <div className="linear-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold tracking-tight">
                Integration Status Matrix
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              {integrationSurfaces.filter((s) => s.status === "in_sync").length}/{integrationSurfaces.length} surfaces nominal
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    Platform
                  </th>
                  <th className="px-3 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-3 py-2 text-right font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    Uptime %
                  </th>
                  <th className="px-3 py-2 text-right font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    P95 Latency
                  </th>
                  <th className="px-3 py-2 text-right font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    DLQ Depth
                  </th>
                  <th className="px-3 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    Last Sync
                  </th>
                  <th className="px-3 py-2 text-right font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    Fragility
                  </th>
                </tr>
              </thead>
              <tbody>
                {integrationSurfaces.map((surface, index) => (
                  <IntegrationRow
                    key={surface.id}
                    surface={surface}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 3. Charts ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sync Health Trend */}
          <div className="linear-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold tracking-tight">
                  Sync Health Trend
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                12-month rolling
              </span>
            </div>
            <div className="p-3">
              <SyncHealthChart data={syncHealthByMonth} />
            </div>
          </div>

          {/* Drift by Surface */}
          <div className="linear-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold tracking-tight">
                  Drift Incidents by Surface
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                last 30 days
              </span>
            </div>
            <div className="p-3">
              <DriftBySurfaceChart data={driftBySurface} />
            </div>
          </div>
        </div>

        {/* ── 4. Recent Sync Events Feed ─────────────────────────── */}
        <div className="linear-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold tracking-tight">
                Recent Sync Events
              </span>
            </div>
            <div className="flex items-center gap-1">
              {(["all", "failed", "success"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setEventFilter(f)}
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-mono border rounded-sm transition-colors",
                    eventFilter === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  )}
                  style={{ transition: "background-color var(--t-interactive), color var(--t-interactive)" }}
                >
                  {f === "all" ? "All" : f === "failed" ? "Failed" : "Processed"}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    Timestamp
                  </th>
                  <th className="px-3 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    Event Type
                  </th>
                  <th className="px-3 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    Source → Target
                  </th>
                  <th className="px-3 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-3 py-2 text-right font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    Latency
                  </th>
                  <th className="px-3 py-2 text-left font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => {
                  const src = getSurfaceById(event.sourceSurfaceId);
                  const tgt = getSurfaceById(event.targetSurfaceId);
                  return (
                    <tr
                      key={event.id}
                      className="border-b border-border/60 hover:bg-surface-hover transition-colors last:border-0"
                      style={{ transition: "background-color var(--t-interactive)" }}
                    >
                      <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(event.triggeredAt)}
                      </td>
                      <td className="px-3 py-2 font-mono text-[10px] text-foreground whitespace-nowrap">
                        {formatEventType(event.eventType)}
                      </td>
                      <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        <span className="text-foreground">{src?.name ?? event.sourceSurfaceId}</span>
                        <span className="mx-1">→</span>
                        <span className="text-foreground">{tgt?.name ?? event.targetSurfaceId}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono border rounded-sm",
                            getSyncEventStatusColor(event.status)
                          )}
                        >
                          {getSyncEventStatusLabel(event.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {event.latencyMs != null
                          ? `${event.latencyMs.toLocaleString()}ms`
                          : "—"}
                      </td>
                      <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground max-w-[260px] truncate">
                        {event.errorMessage ??
                          `${event.recordsProcessed} records · ${event.validationErrors} validation errors`}
                      </td>
                    </tr>
                  );
                })}
                {filteredEvents.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center font-mono text-[11px] text-muted-foreground"
                    >
                      No events match the current filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 5. Proposal Banner ─────────────────────────────────── */}
        <div
          className="linear-card p-4 border-primary/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            background:
              "linear-gradient(to right, oklch(0.52 0.17 260 / 0.06), transparent)",
          }}
        >
          <div>
            <p className="text-xs font-medium font-mono">
              Live demo built for{" "}
              <span className="text-primary">
                {APP_CONFIG.projectName}
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
              Humam · Full-Stack Developer · Available now
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/challenges"
              className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
              style={{ transition: "color var(--t-interactive)" }}
            >
              My Approach →
            </Link>
            <Link
              href="/proposal"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium font-mono bg-primary text-primary-foreground px-3 py-1.5 rounded-sm hover:bg-primary/90 transition-colors"
              style={{ transition: "background-color var(--t-interactive)" }}
            >
              Work with me
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Integration Row Component (staggered reveal) ─────────────────────────────

function IntegrationRow({
  surface,
  index,
}: {
  surface: IntegrationSurface;
  index: number;
}) {
  const statusColor = getStatusColor(surface.status);
  const isPulsing = surface.status === "in_sync";

  const fragility = surface.syncFragilityScore;
  const fragilityColor =
    fragility >= 70
      ? "text-destructive"
      : fragility >= 40
      ? "text-warning"
      : "text-success";

  // Fake DLQ depth derived from fragility score + index
  const dlqDepth = surface.status === "drifted"
    ? 3 + index
    : surface.status === "stale"
    ? 7
    : surface.status === "pending_recompute"
    ? 2
    : 0;

  return (
    <tr
      className="border-b border-border/60 hover:bg-surface-hover last:border-0 animate-fade-up-in"
      style={{
        animationDelay: `${index * 60}ms`,
        animationDuration: "150ms",
        animationFillMode: "both",
        transition: "background-color var(--t-interactive)",
      }}
    >
      {/* Platform */}
      <td className="px-4 py-2.5 whitespace-nowrap">
        <div>
          <p className="font-medium text-xs text-foreground">{surface.name}</p>
          <p className="text-[10px] text-muted-foreground font-mono">
            {surface.technology}
          </p>
        </div>
      </td>

      {/* Status */}
      <td className="px-3 py-2.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className="relative inline-flex h-2 w-2 shrink-0">
            {isPulsing && (
              <span
                className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-60",
                  statusColor
                )}
              />
            )}
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                statusColor
              )}
            />
          </span>
          <span
            className={cn(
              "text-[10px] font-mono",
              surface.status === "in_sync"
                ? "text-success"
                : surface.status === "drifted" || surface.status === "failed"
                ? "text-destructive"
                : "text-warning"
            )}
          >
            {getStatusLabel(surface.status)}
          </span>
        </div>
        {surface.statusNote && (
          <p className="text-[9px] text-muted-foreground font-mono mt-0.5 max-w-[200px] truncate">
            {surface.statusNote}
          </p>
        )}
      </td>

      {/* Uptime */}
      <td className="px-3 py-2.5 text-right whitespace-nowrap">
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            surface.uptimePct >= 99.5
              ? "text-success"
              : surface.uptimePct >= 99.0
              ? "text-warning"
              : "text-destructive"
          )}
        >
          {surface.uptimePct.toFixed(2)}%
        </span>
      </td>

      {/* P95 Latency — using avgSyncLatencyMs as proxy */}
      <td className="px-3 py-2.5 text-right whitespace-nowrap">
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            surface.avgSyncLatencyMs > 1000
              ? "text-destructive"
              : surface.avgSyncLatencyMs > 400
              ? "text-warning"
              : "text-foreground"
          )}
        >
          {surface.avgSyncLatencyMs >= 1000
            ? `${(surface.avgSyncLatencyMs / 1000).toFixed(1)}s`
            : `${surface.avgSyncLatencyMs}ms`}
        </span>
      </td>

      {/* DLQ Depth */}
      <td className="px-3 py-2.5 text-right whitespace-nowrap">
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            dlqDepth > 5
              ? "text-destructive font-semibold"
              : dlqDepth > 0
              ? "text-warning"
              : "text-muted-foreground"
          )}
        >
          {dlqDepth}
        </span>
      </td>

      {/* Last Sync */}
      <td className="px-3 py-2.5 whitespace-nowrap">
        <span className="font-mono text-[10px] text-muted-foreground">
          {formatRelativeTime(surface.lastSyncAt)}
        </span>
      </td>

      {/* Fragility Score */}
      <td className="px-3 py-2.5 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full", {
                "bg-destructive": fragility >= 70,
                "bg-warning": fragility >= 40 && fragility < 70,
                "bg-success": fragility < 40,
              })}
              style={{ width: `${fragility}%` }}
            />
          </div>
          <span className={cn("font-mono text-xs tabular-nums", fragilityColor)}>
            {fragility}
          </span>
        </div>
      </td>
    </tr>
  );
}
