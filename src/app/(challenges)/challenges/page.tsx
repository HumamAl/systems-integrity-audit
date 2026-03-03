import type { Metadata } from "next";
import { ExecutiveSummary } from "@/components/challenges/executive-summary";
import { ChallengePageContent } from "@/components/challenges/challenge-page-content";
import { CtaCloser } from "@/components/challenges/cta-closer";
import { challenges, executiveSummary } from "@/data/challenges";

export const metadata: Metadata = {
  title: "My Approach | IntegriHub Demo",
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 space-y-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">My Approach</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            How I would tackle the three core integration challenges in this project
          </p>
        </div>
        <ExecutiveSummary
          commonApproach={executiveSummary.commonApproach}
          differentApproach={executiveSummary.differentApproach}
          accentWord={executiveSummary.accentWord}
        />
        <ChallengePageContent challenges={challenges} />
        <CtaCloser />
      </div>
    </div>
  );
}
