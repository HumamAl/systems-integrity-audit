"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Clock, Bell, Eye, EyeOff } from "lucide-react";

type Mode = "before" | "after";

const beforeTimeline = [
  { time: "00:00", event: "Webhook fires from HubSpot", status: "normal" },
  { time: "00:10", event: "Node.js fails to ACK — no alert", status: "fail" },
  { time: "00:10", event: "HubSpot retry #1 fires", status: "normal" },
  { time: "00:20", event: "Retry #2 — silent failure again", status: "fail" },
  { time: "03:00", event: "Scheduled job overlaps — corrupts visibility_state", status: "fail" },
  { time: "2d later", event: "Engineer notices stale data in client demo", status: "discover" },
];

const afterTimeline = [
  { time: "00:00", event: "Webhook fires from HubSpot", status: "normal" },
  { time: "00:01", event: "Idempotency key validated", status: "success" },
  { time: "00:02", event: "Sync event written to structured log", status: "success" },
  { time: "00:03", event: "ACK sent — DLQ depth: 0", status: "success" },
  { time: "00:12", event: "Drift detector: lag threshold crossed", status: "warning" },
  { time: "00:18", event: "PagerDuty alert fired — engineer notified", status: "alert" },
];

const statusIcon = {
  normal: <Clock className="h-3 w-3 text-muted-foreground" />,
  fail: <AlertCircle className="h-3 w-3 text-destructive" />,
  discover: <EyeOff className="h-3 w-3 text-destructive" />,
  success: <CheckCircle className="h-3 w-3 text-[color:var(--success)]" />,
  warning: <Bell className="h-3 w-3 text-[color:var(--warning)]" />,
  alert: <Eye className="h-3 w-3 text-primary" />,
};

const statusColor = {
  normal: "text-muted-foreground",
  fail: "text-destructive",
  discover: "text-destructive font-semibold",
  success: "text-[color:var(--success)]",
  warning: "text-[color:var(--warning)]",
  alert: "text-primary font-semibold",
};

export function VizBeforeAfter() {
  const [mode, setMode] = useState<Mode>("before");

  const timeline = mode === "before" ? beforeTimeline : afterTimeline;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wide">
          Sync Failure Timeline
        </span>
        <div className="flex items-center gap-1 border border-border rounded-sm overflow-hidden">
          <button
            onClick={() => setMode("before")}
            className={`px-2.5 py-1 text-xs font-mono transition-colors duration-100 ${
              mode === "before"
                ? "bg-destructive/10 text-destructive border-r border-border"
                : "text-muted-foreground hover:bg-muted border-r border-border"
            }`}
          >
            No observability
          </button>
          <button
            onClick={() => setMode("after")}
            className={`px-2.5 py-1 text-xs font-mono transition-colors duration-100 ${
              mode === "after"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Instrumented
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {timeline.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 py-1 px-2.5 border border-border"
            style={{ borderRadius: "var(--radius)" }}
          >
            <span className="font-mono text-xs text-muted-foreground w-14 shrink-0 tabular-nums">
              {item.time}
            </span>
            <span className="shrink-0">{statusIcon[item.status as keyof typeof statusIcon]}</span>
            <span className={`text-xs font-mono ${statusColor[item.status as keyof typeof statusColor]}`}>
              {item.event}
            </span>
          </div>
        ))}
      </div>

      <div
        className="px-3 py-2 border font-mono text-xs"
        style={{
          borderRadius: "var(--radius)",
          backgroundColor:
            mode === "before"
              ? "color-mix(in oklch, var(--destructive) 6%, transparent)"
              : "color-mix(in oklch, var(--success) 6%, transparent)",
          borderColor:
            mode === "before"
              ? "color-mix(in oklch, var(--destructive) 20%, transparent)"
              : "color-mix(in oklch, var(--success) 20%, transparent)",
          color: mode === "before" ? "var(--destructive)" : "var(--success)",
        }}
      >
        {mode === "before"
          ? "Time to detect: ~2 days (manual audit)"
          : "Time to detect: <60 seconds (automated alert)"}
      </div>
    </div>
  );
}
