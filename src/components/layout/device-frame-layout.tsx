"use client";

import { APP_CONFIG } from "@/lib/config";
import { isFramedFormat } from "@/lib/utils";
import { PhoneFrame } from "@/components/frames/phone-frame";
import { BrowserFrame } from "@/components/frames/browser-frame";
import { ResponsiveFrame } from "@/components/frames/frame-utils";
import {
  CrossTabLinks,
  MicroCTA,
  Attribution,
} from "@/components/layout/conversion-elements";

// ═══════════════════════════════════════════════════════════════════════════
// DEVICE FRAME LAYOUT
// Used by: mobile-app-preview, multi-screen-walkthrough
//
// Structure:
//   +-----------------------------------------------+
//   | (TabNavigation is rendered by root layout)     |
//   +-----------------------------------------------+
//   |          [Device Frame]    Context Panel       |
//   |          (scrollable)      - Description       |
//   |                            - Features          |
//   |                            - CrossTabLinks     |
//   |                            - MicroCTA          |
//   |                            - Attribution       |
//   +-----------------------------------------------+
//
// On mobile, the context panel collapses below the frame.
// ═══════════════════════════════════════════════════════════════════════════

export function DeviceFrameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const format = APP_CONFIG.demoFormat;
  const isMobile = format === "mobile-app-preview";
  const deviceModel = APP_CONFIG.deviceModel;

  return (
    <div
      className="flex flex-col lg:flex-row"
      style={{ height: "calc(100vh - var(--tab-bar-height))" }}
      data-format={format}
    >
      {/* ── Frame Area ───────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center overflow-auto bg-muted/20 p-4 lg:p-8">
        {isMobile ? (
          <ResponsiveFrame maxWidth={320} maxHeight={660}>
            <PhoneFrame
              model={
                deviceModel === "iphone-15-pro" || deviceModel === "generic-phone"
                  ? deviceModel
                  : "iphone-15-pro"
              }
            >
              <div className="device-frame-content">{children}</div>
            </PhoneFrame>
          </ResponsiveFrame>
        ) : (
          <div className="w-full max-w-[960px]">
            <BrowserFrame
              url={`${APP_CONFIG.appName.toLowerCase().replace(/\s+/g, "-")}.app`}
              variant={
                deviceModel === "safari-browser" ? "safari" : "chrome"
              }
            >
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "min(640px, 65vh)" }}
              >
                {children}
              </div>
            </BrowserFrame>
          </div>
        )}
      </div>

      {/* ── Context Panel ────────────────────────────────────────── */}
      <aside className="w-full lg:w-[320px] lg:min-w-[280px] border-t lg:border-t-0 lg:border-l border-border/60 bg-background flex flex-col overflow-y-auto">
        <div className="flex-1 p-5 space-y-6">
          {/* App identity */}
          <div>
            <h2 className="text-lg font-semibold">{APP_CONFIG.appName}</h2>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              Proposal Demo
              <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary/60" />
              </span>
            </p>
          </div>

          {/* Agent fills this with feature descriptions via page content */}
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p>
              Tap through the{" "}
              {isMobile ? "mobile app" : "web app"} to explore
              key features.
            </p>
          </div>

          {/* Cross-tab links */}
          <div className="space-y-2">
            <CrossTabLinks variant="inline" />
          </div>

          {/* Micro-CTA */}
          <MicroCTA variant="inline" />
        </div>

        {/* Attribution at bottom */}
        <div className="p-4 border-t border-border/40">
          <Attribution variant="inline" />
        </div>
      </aside>
    </div>
  );
}
