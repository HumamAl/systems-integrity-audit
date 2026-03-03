"use client";

import type { ReactNode } from "react";
import type { Challenge } from "@/lib/types";
import { ChallengeList } from "./challenge-list";
import { VizArchitecture } from "./viz-architecture";
import { VizFlow } from "./viz-flow";
import { VizBeforeAfter } from "./viz-before-after";

interface ChallengePageContentProps {
  challenges: Challenge[];
}

export function ChallengePageContent({ challenges }: ChallengePageContentProps) {
  const visualizations: Record<string, ReactNode> = {
    "challenge-1": <VizArchitecture />,
    "challenge-2": <VizFlow />,
    "challenge-3": <VizBeforeAfter />,
  };

  return <ChallengeList challenges={challenges} visualizations={visualizations} />;
}
