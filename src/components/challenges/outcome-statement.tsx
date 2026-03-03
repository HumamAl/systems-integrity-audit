import { TrendingUp } from "lucide-react";

interface OutcomeStatementProps {
  outcome: string;
  index?: number;
}

export function OutcomeStatement({ outcome }: OutcomeStatementProps) {
  return (
    <div
      className="flex items-start gap-2 px-3 py-2"
      style={{
        backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
        borderColor: "color-mix(in oklch, var(--success) 18%, transparent)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "var(--radius)",
      }}
    >
      <TrendingUp className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[color:var(--success)]" />
      <p className="text-xs font-medium text-[color:var(--success)] font-mono leading-relaxed">
        {outcome}
      </p>
    </div>
  );
}
