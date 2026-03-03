"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import { Lightbulb, User, ArrowRight, Github } from "lucide-react";
import type { ConversionVariant } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════════════════
// CONVERSION ELEMENTS
// Reusable cross-format conversion infrastructure.
// The "sidebar" variant is NOT here — it stays in app-sidebar.tsx where it
// handles collapsed state and sidebar-specific layout concerns.
// These variants are for non-sidebar layout shells (frames, full-canvas, etc.).
// ═══════════════════════════════════════════════════════════════════════════

// ── Cross-Tab Links ─────────────────────────────────────────────────────
// Links to /challenges and /proposal — present in every layout format.

export function CrossTabLinks({
  variant = "inline",
}: {
  variant?: Exclude<ConversionVariant, "sidebar">;
}) {
  if (variant === "floating") {
    return (
      <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2">
        <Link
          href="/challenges"
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-background/90 backdrop-blur border border-border/60 text-sm text-muted-foreground hover:text-primary hover:border-primary/30 shadow-lg transition-colors duration-150"
        >
          <Lightbulb className="w-4 h-4" />
          <span>My Approach</span>
        </Link>
        <Link
          href="/proposal"
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-background/90 backdrop-blur border border-border/60 text-sm text-muted-foreground hover:text-primary hover:border-primary/30 shadow-lg transition-colors duration-150"
        >
          <User className="w-4 h-4" />
          <span>Work With Me</span>
        </Link>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="flex items-center justify-center gap-6 py-3 border-t border-border/40">
        <Link
          href="/challenges"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
        >
          <Lightbulb className="w-4 h-4" />
          <span>My Approach</span>
        </Link>
        <span className="text-border/60">|</span>
        <Link
          href="/proposal"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
        >
          <User className="w-4 h-4" />
          <span>Work With Me</span>
        </Link>
      </div>
    );
  }

  // "inline" (default) — horizontal row for context panels, footers, etc.
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/challenges"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
      >
        <Lightbulb className="w-4 h-4" />
        <span>My Approach</span>
      </Link>
      <Link
        href="/proposal"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
      >
        <User className="w-4 h-4" />
        <span>Work With Me</span>
      </Link>
    </div>
  );
}

// ── Micro-CTA ───────────────────────────────────────────────────────────
// "Like what you see?" card — drives clicks to /proposal.

export function MicroCTA({
  variant = "inline",
}: {
  variant?: Exclude<ConversionVariant, "sidebar">;
}) {
  if (variant === "floating") {
    return (
      <div className="fixed bottom-4 right-4 z-40 max-w-[240px]">
        <div className="aesthetic-card p-3 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg backdrop-blur">
          <p className="text-xs font-medium text-foreground mb-1">
            Like what you see?
          </p>
          <p className="text-[11px] text-muted-foreground mb-2 leading-relaxed">
            Built this for your project. Let&apos;s talk.
          </p>
          <Link
            href="/proposal"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-100"
          >
            See proposal <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-primary/5 to-primary/10 border-t border-primary/20">
        <div>
          <span className="text-xs font-medium text-foreground">
            Like what you see?
          </span>
          <span className="text-[11px] text-muted-foreground ml-2">
            Built this for your project.
          </span>
        </div>
        <Link
          href="/proposal"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-100"
        >
          See proposal <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  // "inline" (default) — horizontal card for context panels
  return (
    <div className="aesthetic-card p-3 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <p className="text-xs font-medium text-foreground mb-1">
        Like what you see?
      </p>
      <p className="text-[11px] text-muted-foreground mb-2 leading-relaxed">
        Built this for your project. Let&apos;s talk.
      </p>
      <Link
        href="/proposal"
        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-100"
      >
        See proposal <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

// ── Attribution ─────────────────────────────────────────────────────────
// "Built for [project] by Humam" — appears in every layout format.

export function Attribution({
  variant = "inline",
}: {
  variant?: Exclude<ConversionVariant, "sidebar">;
}) {
  const text = (
    <>
      Built for{" "}
      <span className="text-foreground/70 font-medium">
        {APP_CONFIG.projectName}
      </span>{" "}
      by Humam
    </>
  );

  if (variant === "floating") {
    return (
      <div className="fixed bottom-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-border/40 shadow-sm">
        <p className="text-[11px] text-muted-foreground/80">{text}</p>
        <a
          href="https://github.com/HumamAl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/70 hover:text-primary transition-colors duration-100"
        >
          <Github className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="flex items-center justify-between py-2 px-4 border-t border-border/40">
        <p className="text-xs text-muted-foreground/80">{text}</p>
        <a
          href="https://github.com/HumamAl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] text-primary/70 hover:text-primary transition-colors duration-100"
        >
          <Github className="w-3.5 h-3.5" />
          <span>by Humam ↗</span>
        </a>
      </div>
    );
  }

  // "inline" (default) — single line for context panels, footers
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-muted-foreground/80">{text}</p>
      <a
        href="https://github.com/HumamAl"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors duration-100"
      >
        <Github className="w-3.5 h-3.5" />
        <span>↗</span>
      </a>
    </div>
  );
}

// ── Demo Banner ─────────────────────────────────────────────────────────
// "This is a live demo built for your project" — used at bottom of dashboard pages.
// This is format-agnostic (always full-width within its container).

export function DemoBanner() {
  return (
    <div className="mt-8 p-4 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">
            This is a live demo built for your project
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Every feature here was designed based on your job posting.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            My Approach
          </Link>
          <Link
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-100"
          >
            Work With Me <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
