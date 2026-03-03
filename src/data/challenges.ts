import type { Challenge } from "@/lib/types";

export const executiveSummary = "Replace this with a 2-sentence summary of the project's core technical difficulty and your approach to solving it.";

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Challenge 1",
    description: "Description of the first technical challenge",
    visualizationType: "before-after",
    outcome: "What gets better when this is solved — e.g., 'Reduces processing time from 45 min to 3 min'",
  },
  {
    id: "challenge-2",
    title: "Challenge 2",
    description: "Description of the second technical challenge",
    visualizationType: "flow",
    outcome: "Outcome statement for challenge 2",
  },
  {
    id: "challenge-3",
    title: "Challenge 3",
    description: "Description of the third technical challenge",
    visualizationType: "metrics",
    outcome: "Outcome statement for challenge 3",
  },
];
