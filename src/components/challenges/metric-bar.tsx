import { cn } from "@/lib/utils";

interface MetricBarProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  color?: "green" | "yellow" | "red" | "blue";
}

export function MetricBar({
  label,
  value,
  max,
  unit = "",
  color = "blue",
}: MetricBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses = {
    green: "bg-[color:var(--success)]",
    yellow: "bg-[color:var(--warning)]",
    red: "bg-destructive",
    blue: "bg-primary",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}
          {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all", colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
