"use client";

import { APP_CONFIG } from "@/lib/config";
import {
  CrossTabLinks,
  MicroCTA,
  Attribution,
} from "@/components/layout/conversion-elements";

// ═══════════════════════════════════════════════════════════════════════════
// SPLIT-SHOWCASE LAYOUT
// Used by: split-panel-demo
//
// Structure:
//   +-----------------------------------------------+
//   | (TabNavigation is rendered by root layout)     |
//   +-----------------------+-----------------------+
//   | Context Panel (dark)  | Interactive Panel     |
//   |                       |                       |
//   | App name + badge      | Live interactive demo |
//   | Feature highlights    | (toggles, filters)    |
//   | How it works          |                       |
//   |                       |                       |
//   | [CrossTabLinks]       |                       |
//   | [MicroCTA]            |                       |
//   | [Attribution]         |                       |
//   +-----------------------+-----------------------+
//
// Left panel: dark context/sales surface.
// Right panel: interactive demo area.
// On mobile, stacks vertically (context above interactive).
// ═══════════════════════════════════════════════════════════════════════════

export function SplitShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col md:flex-row"
      style={{ height: "calc(100vh - var(--tab-bar-height))" }}
      data-format={APP_CONFIG.demoFormat}
    >
      {/* ── Context Panel (Left) ─────────────────────────────────── */}
      <aside
        className="md:h-full overflow-y-auto flex flex-col border-b md:border-b-0 md:border-r border-border/60"
        style={{
          width: "var(--showcase-split, 40%)",
          minWidth: "280px",
          background: "var(--showcase-context-bg, var(--section-dark))",
          padding: "var(--showcase-context-padding, 2.5rem)",
        }}
      >
        <div className="flex-1 space-y-6">
          {/* App identity */}
          <div>
            <h1 className="text-xl font-semibold text-white">
              {APP_CONFIG.appName}
            </h1>
            <p className="text-xs text-white/50 mt-1 flex items-center gap-1.5">
              Proposal Demo
              <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary/60" />
              </span>
            </p>
          </div>

          {/* Agent fills this section with feature highlights, how-it-works, etc.
              For now, a placeholder description. */}
          <div className="text-sm text-white/70 leading-relaxed space-y-4">
            <p>
              Explore the interactive demo on the right to see key features in
              action.
            </p>
          </div>

          {/* Cross-tab links */}
          <div className="pt-4 border-t border-white/10">
            <CrossTabLinks variant="inline" />
          </div>

          {/* Micro-CTA */}
          <MicroCTA variant="inline" />
        </div>

        {/* Attribution pinned to bottom of context panel */}
        <div className="pt-6 mt-auto">
          <Attribution variant="inline" />
        </div>
      </aside>

      {/* ── Interactive Panel (Right) ────────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto bg-background"
        style={{ padding: "var(--content-padding)" }}
      >
        {children}
      </main>
    </div>
  );
}
