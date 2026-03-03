import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  title: string;
  description: string;
  outcome?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChallengeCard({
  title,
  description,
  outcome,
  children,
  className,
}: ChallengeCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border/60 shadow-[0_1px_2px_0_rgb(0_0_0/0.03)] rounded-lg p-6 space-y-4 hover:border-primary/30 hover:shadow-[0_2px_8px_0_rgb(0_0_0/0.05)] transition-all duration-150",
        className
      )}
    >
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      {children}
      {outcome && (
        <div className="pt-2 border-t border-border/60">
          <p className="text-sm font-medium text-[color:var(--success)]">{outcome}</p>
        </div>
      )}
    </div>
  );
}
