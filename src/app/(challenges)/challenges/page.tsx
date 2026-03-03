// Challenges Builder agent replaces this content.
// This placeholder demonstrates correct card and layout patterns for Tab 2.
//
// Rules for the Challenges Builder:
//   - Page heading must be "My Approach" (never "Technical Challenges")
//   - Exactly 3 challenge cards (2-4 is acceptable if job demands it)
//   - Each card uses <ChallengeCard> from @/components/challenges/challenge-card
//   - Executive summary banner links back to /  ("← Back to the live demo")
//   - Each card has an outcome statement (qualifiers required: "Could reduce...")
//   - At least one interactive element (toggle, step-through, metric bar)
//   - CTA closer at the bottom: link to /proposal + "Reply on Upwork" badge
//   - NO: bg-gradient-to-br on page, hover:-translate-y-*, shadow-lg, rounded-xl

import Link from "next/link";
import { challenges, executiveSummary } from "@/data/challenges";
import { ChallengeCard } from "@/components/challenges/challenge-card";

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold">My Approach</h1>
          <p className="text-sm text-muted-foreground mt-1">
            How I would tackle the key technical challenges in this project
          </p>
        </div>

        {/* Executive summary — dark banner with back-link */}
        <div
          className="rounded-lg p-5 space-y-3"
          style={{ background: "var(--section-dark)" }}
        >
          <Link
            href="/"
            className="text-xs text-white/50 hover:text-white/80 transition-colors duration-100"
          >
            ← Back to the live demo
          </Link>
          <p className="text-sm leading-relaxed text-white/80">
            {executiveSummary}
          </p>
        </div>

        {/* Challenge cards — Challenges Builder renders real visualizations */}
        <div className="space-y-6">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              title={challenge.title}
              description={challenge.description}
              outcome={challenge.outcome}
            >
              {/* Challenges Builder: replace this placeholder with a real
                  visualization component from src/components/challenges/
                  Options: <FlowDiagram>, <BeforeAfter>, <MetricBar>, etc.
                  QA will reject placeholder gray boxes. */}
              <div className="h-32 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-sm text-muted-foreground">
                {challenge.visualizationType} visualization — replace with component
              </div>
            </ChallengeCard>
          ))}
        </div>

        {/* CTA closer */}
        <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold">Ready to discuss the approach?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Let&apos;s walk through how these solutions apply to your specific setup.
            </p>
          </div>
          <Link
            href="/proposal"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors duration-100 shrink-0"
          >
            Work With Me →
          </Link>
        </div>

      </div>
    </div>
  );
}
