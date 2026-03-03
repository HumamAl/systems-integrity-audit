import { cn } from "@/lib/utils";
import { TrafficLights } from "./frame-utils";

export interface DesktopFrameProps {
  children: React.ReactNode;
  /** Window title displayed in the title bar */
  title?: string;
  className?: string;
}

export function DesktopFrame({
  children,
  title = "",
  className,
}: DesktopFrameProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 overflow-hidden shadow-xl",
        className
      )}
    >
      {/* macOS title bar */}
      <div className="flex items-center px-4 py-3 bg-muted/30 border-b border-border/60">
        <TrafficLights />
        <span className="flex-1 text-center text-sm text-muted-foreground font-medium truncate">
          {title}
        </span>
        {/* Spacer to balance traffic lights for centering */}
        <div className="w-[52px]" />
      </div>

      {/* Content */}
      <div className="bg-[var(--screen-bg,var(--background))] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
