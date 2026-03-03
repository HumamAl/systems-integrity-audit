"use client";

import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";
import { ArrowRight } from "lucide-react";
import {
  CrossTabLinks,
  Attribution,
} from "@/components/layout/conversion-elements";

// ═══════════════════════════════════════════════════════════════════════════
// FULL-CANVAS LAYOUT
// Used by: landing-page, admin-console
//
// Structure:
//   +-----------------------------------------------+
//   | (TabNavigation is rendered by root layout)     |
//   +-----------------------------------------------+
//   | Minimal Header: App Name | Feature Nav | CTA   |
//   +-----------------------------------------------+
//   |                                                 |
//   |  Full-width content area (scrollable)           |
//   |  Maps, editors, Kanban boards, landing pages    |
//   |                                                 |
//   +-----------------------------------------------+
//   | Bottom Bar: Attribution | CrossTabLinks         |
//   +-----------------------------------------------+
//
// Minimal chrome — the content IS the demo.
// ═══════════════════════════════════════════════════════════════════════════

export function FullCanvasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100vh - var(--tab-bar-height))" }}
      data-format={APP_CONFIG.demoFormat}
    >
      {/* ── Minimal Header ──────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-background shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold">{APP_CONFIG.appName}</h1>
          <span className="text-[10px] text-muted-foreground/60 font-mono tracking-widest uppercase flex items-center gap-1.5">
            Demo
            <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary/60" />
            </span>
          </span>
        </div>
        <Link
          href="/proposal"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-100"
        >
          Work With Me <ArrowRight className="h-3 w-3" />
        </Link>
      </header>

      {/* ── Canvas Area ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* ── Bottom Bar ──────────────────────────────────────────── */}
      <footer className="flex items-center justify-between px-4 py-2 border-t border-border/60 bg-background shrink-0">
        <Attribution variant="inline" />
        <CrossTabLinks variant="inline" />
      </footer>
    </div>
  );
}
