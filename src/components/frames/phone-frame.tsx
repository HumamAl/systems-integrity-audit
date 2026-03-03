import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: React.ReactNode;
  model?: "iphone-15-pro" | "generic-phone";
  showStatusBar?: boolean;
  showHomeIndicator?: boolean;
  className?: string;
}

// ── Status Bar ───────────────────────────────────────────────────────
// Static simulation — not live data. Renders time, signal, wifi, battery.

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 py-1.5 text-[11px] font-semibold text-white select-none">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        {/* Signal bars */}
        <svg
          width="17"
          height="12"
          viewBox="0 0 17 12"
          fill="none"
          className="text-white"
          aria-hidden="true"
        >
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill="currentColor" />
          <rect
            x="13.5"
            y="0"
            width="3"
            height="12"
            rx="0.5"
            fill="currentColor"
          />
        </svg>
        {/* WiFi */}
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          className="text-white"
          aria-hidden="true"
        >
          <path
            d="M8 3.6C10.1 3.6 12 4.5 13.3 5.9L14.7 4.5C13 2.7 10.6 1.6 8 1.6C5.4 1.6 3 2.7 1.3 4.5L2.7 5.9C4 4.5 5.9 3.6 8 3.6Z"
            fill="currentColor"
          />
          <path
            d="M8 7.2C9.2 7.2 10.3 7.7 11.1 8.5L12.5 7.1C11.3 5.9 9.7 5.2 8 5.2C6.3 5.2 4.7 5.9 3.5 7.1L4.9 8.5C5.7 7.7 6.8 7.2 8 7.2Z"
            fill="currentColor"
          />
          <circle cx="8" cy="10.5" r="1.5" fill="currentColor" />
        </svg>
        {/* Battery */}
        <svg
          width="27"
          height="12"
          viewBox="0 0 27 12"
          fill="none"
          className="text-white"
          aria-hidden="true"
        >
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="11"
            rx="2"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect x="2" y="2" width="19" height="8" rx="1" fill="currentColor" />
          <path
            d="M24 4C25.1 4 25.5 4.8 25.5 6C25.5 7.2 25.1 8 24 8V4Z"
            fill="currentColor"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}

// ── Home Indicator ───────────────────────────────────────────────────

function HomeIndicator() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="w-[134px] h-[5px] rounded-full bg-white/30" />
    </div>
  );
}

// ── Dynamic Island (iPhone 15 Pro) ──────────────────────────────────

function DynamicIsland() {
  return (
    <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20">
      <div className="w-[120px] h-[34px] rounded-full bg-black" />
    </div>
  );
}

// ── Phone Frame ─────────────────────────────────────────────────────
// Pure Tailwind CSS phone mockup. Two models: iPhone 15 Pro (Dynamic Island)
// and generic phone (simpler, works for Android).
//
// The frame itself is SSR-safe — no client JS needed.
// Content area scrolls internally via overflow-y-auto.

export function PhoneFrame({
  children,
  model = "iphone-15-pro",
  showStatusBar = true,
  showHomeIndicator = true,
  className,
}: PhoneFrameProps) {
  const isIphone = model === "iphone-15-pro";

  return (
    <div
      className={cn(
        // Outer bezel — near-black hardware chrome
        "relative mx-auto",
        "bg-[oklch(0.08_0_0)]",
        "border-[8px] border-[oklch(0.12_0_0)]",
        // Sizing — 9:19.5 aspect ratio (standard modern phone)
        "w-[300px] h-[620px]",
        // Rounded corners — iPhone is more rounded
        isIphone ? "rounded-[3rem]" : "rounded-[2rem]",
        // Responsive scaling
        "frame-responsive",
        className
      )}
    >
      {/* Side buttons — iPhone */}
      {isIphone && (
        <>
          {/* Silent switch */}
          <div className="absolute -left-[11px] top-[72px] w-[3px] h-[28px] rounded-l-sm bg-[oklch(0.15_0_0)]" />
          {/* Volume up */}
          <div className="absolute -left-[11px] top-[116px] w-[3px] h-[44px] rounded-l-sm bg-[oklch(0.15_0_0)]" />
          {/* Volume down */}
          <div className="absolute -left-[11px] top-[168px] w-[3px] h-[44px] rounded-l-sm bg-[oklch(0.15_0_0)]" />
          {/* Power */}
          <div className="absolute -right-[11px] top-[140px] w-[3px] h-[64px] rounded-r-sm bg-[oklch(0.15_0_0)]" />
        </>
      )}

      {/* Side buttons — generic phone */}
      {!isIphone && (
        <>
          {/* Volume */}
          <div className="absolute -right-[11px] top-[100px] w-[3px] h-[50px] rounded-r-sm bg-[oklch(0.15_0_0)]" />
          {/* Power */}
          <div className="absolute -right-[11px] top-[170px] w-[3px] h-[40px] rounded-r-sm bg-[oklch(0.15_0_0)]" />
        </>
      )}

      {/* Screen container */}
      <div
        className={cn(
          "relative w-full h-full overflow-hidden",
          "bg-[var(--screen-bg,_oklch(1_0_0))]",
          isIphone
            ? "rounded-[calc(3rem-8px)]"
            : "rounded-[calc(2rem-8px)]"
        )}
      >
        {/* Dynamic Island — iPhone only */}
        {isIphone && <DynamicIsland />}

        {/* Status bar */}
        {showStatusBar && (
          <div
            className={cn(
              "relative z-10",
              // Push status bar below the Dynamic Island on iPhone
              isIphone ? "pt-[48px]" : "pt-[4px]",
              "bg-[var(--screen-bg,_oklch(0.08_0_0))]"
            )}
          >
            <StatusBar />
          </div>
        )}

        {/* Content area — scrollable */}
        <div
          className={cn(
            "overflow-y-auto",
            showStatusBar && showHomeIndicator && "h-[calc(100%-var(--phone-chrome-height,88px))]",
            showStatusBar && !showHomeIndicator && "h-[calc(100%-var(--phone-status-height,60px))]",
            !showStatusBar && showHomeIndicator && "h-[calc(100%-var(--phone-home-height,28px))]",
            !showStatusBar && !showHomeIndicator && "h-full"
          )}
        >
          {children}
        </div>

        {/* Home indicator */}
        {showHomeIndicator && (
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <HomeIndicator />
          </div>
        )}
      </div>
    </div>
  );
}
