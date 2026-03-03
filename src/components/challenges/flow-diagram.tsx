import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FlowStep {
  label: string;
  description?: string;
  icon: LucideIcon;
  highlight?: boolean;
}

interface FlowDiagramProps {
  steps: FlowStep[];
}

export function FlowDiagram({ steps }: FlowDiagramProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2",
              step.highlight
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            )}
          >
            <step.icon className="w-4 h-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium">{step.label}</p>
              {step.description && (
                <p className="text-[10px] text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
          )}
        </div>
      ))}
    </div>
  );
}
