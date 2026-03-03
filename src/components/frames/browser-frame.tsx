import { cn } from "@/lib/utils";
import { TrafficLights } from "./frame-utils";

export interface BrowserFrameProps {
  children: React.ReactNode;
  /** URL displayed in the address bar */
  url?: string;
  /** Chrome shows tab strip + rounded address bar; Safari is simpler */
  variant?: "chrome" | "safari";
  /** Show a tab strip above the address bar (Chrome variant only) */
  showTabs?: boolean;
  className?: string;
}

export function BrowserFrame({
  children,
  url = "app.example.com",
  variant = "chrome",
  showTabs = false,
  className,
}: BrowserFrameProps) {
  if (variant === "safari") {
    return (
      <div
        className={cn(
          "rounded-lg border border-border/60 overflow-hidden shadow-lg",
          className
        )}
      >
        {/* Safari title bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/50 border-b border-border/60">
          <TrafficLights />
          <div className="flex-1 mx-2">
            <div className="bg-background rounded-md px-3 py-1 text-sm text-muted-foreground text-center truncate">
              {url}
            </div>
          </div>
          {/* Spacer to balance traffic lights */}
          <div className="w-[52px]" />
        </div>

        {/* Content */}
        <div className="bg-[var(--screen-bg,var(--background))] overflow-y-auto">
          {children}
        </div>
      </div>
    );
  }

  // Chrome variant
  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 overflow-hidden shadow-lg",
        className
      )}
    >
      {/* Tab strip (optional) */}
      {showTabs && (
        <div className="flex items-end gap-0 px-2 pt-2 bg-muted/40">
          <div className="flex items-center gap-1.5 px-3 py-1">
            <TrafficLights />
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-background rounded-t-lg text-sm text-foreground">
            <span className="truncate max-w-[160px]">{url}</span>
            <span className="text-muted-foreground/60 text-xs cursor-default">
              &times;
            </span>
          </div>
          <div className="flex-1" />
        </div>
      )}

      {/* Chrome address bar */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border/60",
          showTabs ? "" : "gap-3"
        )}
      >
        {!showTabs && <TrafficLights />}

        {/* Navigation arrows + refresh */}
        <div className="flex items-center gap-1 text-muted-foreground/50 text-sm select-none">
          <span className="px-0.5">&lsaquo;</span>
          <span className="px-0.5">&rsaquo;</span>
          <span className="px-0.5">&#8635;</span>
        </div>

        {/* Address bar */}
        <div className="flex-1">
          <div className="bg-background rounded-full px-3 py-1 text-sm text-muted-foreground truncate">
            {url}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[var(--screen-bg,var(--background))] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
