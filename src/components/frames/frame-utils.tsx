import { cn } from "@/lib/utils";

/**
 * Responsive container that scales a fixed-size frame to fit its parent.
 * Uses CSS transform so the frame keeps its pixel-perfect rendering.
 */
export function ResponsiveFrame({
  children,
  maxWidth,
  maxHeight,
  className,
}: {
  children: React.ReactNode;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full flex justify-center",
        className
      )}
    >
      <div
        className="transform origin-top scale-[0.55] sm:scale-[0.7] md:scale-[0.85] lg:scale-100"
        style={{
          maxWidth: maxWidth ? `${maxWidth}px` : undefined,
          maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Wraps children in a container that enforces a specific aspect ratio.
 * The children fill the container via absolute positioning.
 */
export function AspectFrame({
  children,
  width,
  height,
  className,
}: {
  children: React.ReactNode;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

/**
 * macOS-style traffic light dots reused across browser and desktop frames.
 */
export function TrafficLights({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-1.5", className)}>
      <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
      <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
    </div>
  );
}
