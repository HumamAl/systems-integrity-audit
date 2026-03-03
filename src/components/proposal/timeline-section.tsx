import { cn } from "@/lib/utils";
import { Check, Clock, Circle } from "lucide-react";

interface TimelinePhase {
  title: string;
  description: string;
  duration: string;
  status: "completed" | "active" | "upcoming";
}

interface TimelineSectionProps {
  phases: TimelinePhase[];
}

export function TimelineSection({ phases }: TimelineSectionProps) {
  return (
    <div className="space-y-4">
      {phases.map((phase, i) => {
        const Icon =
          phase.status === "completed"
            ? Check
            : phase.status === "active"
              ? Clock
              : Circle;

        return (
          <div key={phase.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  phase.status === "completed" && "bg-[color:var(--success)]/10 text-[color:var(--success)]",
                  phase.status === "active" && "bg-primary text-primary-foreground",
                  phase.status === "upcoming" && "bg-secondary text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              {i < phases.length - 1 && (
                <div className="w-px flex-1 bg-border/60 mt-2" />
              )}
            </div>
            <div className="pb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">{phase.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {phase.duration}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {phase.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
