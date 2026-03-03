import { cn } from "@/lib/utils";

export interface TabletFrameProps {
  children: React.ReactNode;
  /** Portrait (default) or landscape orientation */
  orientation?: "portrait" | "landscape";
  className?: string;
}

export function TabletFrame({
  children,
  orientation = "portrait",
  className,
}: TabletFrameProps) {
  const isLandscape = orientation === "landscape";

  return (
    <div
      className={cn(
        "relative mx-auto bg-neutral-800 dark:bg-neutral-900",
        isLandscape
          ? "border-[12px] rounded-[1.75rem] max-w-[680px] aspect-[820/580]"
          : "border-[14px] rounded-[2rem] max-w-[480px] aspect-[580/820]",
        className
      )}
    >
      {/* Camera dot */}
      <div
        className={cn(
          "absolute bg-neutral-700 rounded-full z-10",
          isLandscape
            ? "w-2 h-2 left-1/2 -translate-x-1/2 -top-[9px]"
            : "w-2 h-2 top-[-9px] left-1/2 -translate-x-1/2"
        )}
      />

      {/* Home indicator */}
      <div
        className={cn(
          "absolute bg-neutral-600 rounded-full z-10",
          isLandscape
            ? "w-1 h-8 -right-[9px] top-1/2 -translate-y-1/2"
            : "h-1 w-16 -bottom-[9px] left-1/2 -translate-x-1/2"
        )}
      />

      {/* Side buttons (volume + power) */}
      {isLandscape ? (
        <>
          <div className="absolute w-5 h-[3px] bg-neutral-800 dark:bg-neutral-900 rounded-t-sm -top-[15px] left-[80px]" />
          <div className="absolute w-7 h-[3px] bg-neutral-800 dark:bg-neutral-900 rounded-t-sm -top-[15px] left-[115px]" />
          <div className="absolute w-7 h-[3px] bg-neutral-800 dark:bg-neutral-900 rounded-t-sm -top-[15px] left-[155px]" />
        </>
      ) : (
        <>
          <div className="absolute h-5 w-[3px] bg-neutral-800 dark:bg-neutral-900 rounded-l-sm -left-[17px] top-[60px]" />
          <div className="absolute h-7 w-[3px] bg-neutral-800 dark:bg-neutral-900 rounded-l-sm -left-[17px] top-[95px]" />
          <div className="absolute h-7 w-[3px] bg-neutral-800 dark:bg-neutral-900 rounded-l-sm -left-[17px] top-[135px]" />
          <div className="absolute h-9 w-[3px] bg-neutral-800 dark:bg-neutral-900 rounded-r-sm -right-[17px] top-[110px]" />
        </>
      )}

      {/* Screen */}
      <div className="w-full h-full rounded-[0.75rem] overflow-hidden bg-[var(--screen-bg,var(--background))]">
        <div className="w-full h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
