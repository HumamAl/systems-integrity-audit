"use client";

import type { ReactNode } from "react";
import type { Challenge } from "@/lib/types";
import { ChallengeCard } from "./challenge-card";

interface ChallengeListProps {
  challenges: Challenge[];
  visualizations?: Record<string, ReactNode>;
}

export function ChallengeList({ challenges, visualizations = {} }: ChallengeListProps) {
  return (
    <div className="flex flex-col gap-3">
      {challenges.map((challenge, index) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          index={index}
          visualization={visualizations[challenge.id]}
        />
      ))}
    </div>
  );
}
