"use client";

import { ArrowRight } from "lucide-react";

export function CtaCloser() {
  return (
    <div
      className="border border-primary/25 px-5 py-4"
      style={{
        backgroundColor: "color-mix(in oklch, var(--primary) 4%, transparent)",
        borderRadius: "var(--radius)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-0.5">
            Ready to discuss the integration approach?
          </h3>
          <p className="text-xs text-muted-foreground font-mono max-w-md">
            I&apos;ve mapped the ownership boundaries, idempotency strategy, and observability gaps.
            Happy to walk through any of this before we start.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/proposal"
            className="flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors duration-100"
          >
            See the full proposal
            <ArrowRight className="h-3 w-3" />
          </a>
          <span
            className="text-xs font-semibold font-mono text-primary px-3 py-1.5 border border-primary/30"
            style={{
              backgroundColor: "color-mix(in oklch, var(--primary) 8%, transparent)",
              borderRadius: "var(--radius)",
            }}
          >
            Reply on Upwork to start
          </span>
        </div>
      </div>
    </div>
  );
}
