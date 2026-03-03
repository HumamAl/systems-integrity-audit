import { ArrowRight, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

interface FlowStep {
  id: string;
  label: string;
  sublabel: string;
  type: "normal" | "critical" | "success" | "guard";
}

const steps: FlowStep[] = [
  { id: "trigger", label: "Webhook", sublabel: "HubSpot fires", type: "normal" },
  { id: "validate", label: "Validate", sublabel: "schema check", type: "guard" },
  { id: "dedupe", label: "Deduplicate", sublabel: "idempotency key", type: "critical" },
  { id: "write", label: "Write", sublabel: "Firestore txn", type: "normal" },
  { id: "ack", label: "ACK", sublabel: "200 within 10s", type: "success" },
];

const stepStyle: Record<FlowStep["type"], string> = {
  normal: "border-border bg-card text-foreground",
  critical: "border-primary/40 bg-primary/8 text-primary",
  success: "border-success/40 text-success",
  guard: "border-warning/40 text-warning",
};

export function VizFlow() {
  return (
    <div className="space-y-3">
      <span className="font-mono text-xs text-muted-foreground uppercase tracking-wide block">
        Idempotent Webhook Pipeline
      </span>

      <div className="flex items-center gap-1 flex-wrap">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-1">
            <div
              className={`border px-2.5 py-1.5 min-w-[68px] text-center ${stepStyle[step.type]}`}
              style={{
                borderRadius: "var(--radius)",
                backgroundColor:
                  step.type === "critical"
                    ? "color-mix(in oklch, var(--primary) 8%, transparent)"
                    : step.type === "guard"
                    ? "color-mix(in oklch, var(--warning) 8%, transparent)"
                    : step.type === "success"
                    ? "color-mix(in oklch, var(--success) 8%, transparent)"
                    : undefined,
                borderColor:
                  step.type === "critical"
                    ? "color-mix(in oklch, var(--primary) 35%, transparent)"
                    : step.type === "guard"
                    ? "color-mix(in oklch, var(--warning) 35%, transparent)"
                    : step.type === "success"
                    ? "color-mix(in oklch, var(--success) 35%, transparent)"
                    : undefined,
              }}
            >
              <div className="text-xs font-semibold font-mono leading-tight">{step.label}</div>
              <div className="text-xs opacity-60 leading-tight">{step.sublabel}</div>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <div
          className="border px-2.5 py-2"
          style={{
            backgroundColor: "color-mix(in oklch, var(--destructive) 6%, transparent)",
            borderColor: "color-mix(in oklch, var(--destructive) 20%, transparent)",
            borderRadius: "var(--radius)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <AlertCircle className="h-3 w-3 text-destructive shrink-0" />
            <span className="text-xs font-semibold text-destructive font-mono">Without idempotency</span>
          </div>
          <ul className="text-xs text-muted-foreground font-mono space-y-0.5">
            <li>Retry fires → duplicate write</li>
            <li>Dead letter queue fills up</li>
            <li>visibility_state corrupted</li>
          </ul>
        </div>
        <div
          className="border px-2.5 py-2"
          style={{
            backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
            borderColor: "color-mix(in oklch, var(--success) 20%, transparent)",
            borderRadius: "var(--radius)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle className="h-3 w-3 text-[color:var(--success)] shrink-0" />
            <span className="text-xs font-semibold text-[color:var(--success)] font-mono">With idempotency key</span>
          </div>
          <ul className="text-xs text-muted-foreground font-mono space-y-0.5">
            <li>Retry detected → skip write</li>
            <li>DLQ depth stays near-zero</li>
            <li>certified_status preserved</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <RefreshCw className="h-3 w-3 shrink-0" />
        <span>
          HubSpot retries on no-ACK within{" "}
          <span className="font-semibold text-foreground">10s</span>
          {" "}— idempotency key prevents duplicate recompute
        </span>
      </div>
    </div>
  );
}
