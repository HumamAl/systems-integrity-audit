import type { ReactNode } from "react";
import { OutcomeStatement } from "./outcome-statement";
import type { Challenge } from "@/lib/types";

interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
  visualization?: ReactNode;
}

export function ChallengeCard({ challenge, index, visualization }: ChallengeCardProps) {
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      className="border border-border bg-card"
      style={{ borderRadius: "var(--radius)" }}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-baseline gap-2.5 mb-1.5">
          <span className="font-mono text-xs font-semibold text-primary/60 w-5 shrink-0 tabular-nums select-none">
            {stepNumber}
          </span>
          <h3 className="text-sm font-semibold text-foreground leading-tight">
            {challenge.title}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed pl-[1.875rem]">
          {challenge.description}
        </p>
      </div>
      {visualization && (
        <div className="border-t border-border px-4 py-3" style={{ backgroundColor: "oklch(0.97 0 0)" }}>
          {visualization}
        </div>
      )}
      <div className="px-4 pb-4 pt-3">
        <OutcomeStatement outcome={challenge.outcome ?? ""} index={index} />
      </div>
    </div>
  );
}
