import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most engineers on a 5-system integration job bolt on sync jobs and hope for the best — no field-level ownership, no idempotency guarantees, no observability until a client notices stale data in a demo.",
  differentApproach:
    "I start by establishing canonical source-of-truth boundaries before writing a single sync: HubSpot owns deal state, Firebase owns application data, WordPress is a read-only rendering surface. Every webhook gets an idempotency key. Every sync operation is observable from the first deploy.",
  accentWord: "canonical source-of-truth boundaries",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Canonical Source-of-Truth Enforcement Across 5 Integrated Systems",
    description:
      "React, Node.js, Firebase, WordPress, and HubSpot all touching the same fields creates invisible data drift. Without formalized field-level ownership, multiple systems write to the same records and diverge silently — visibility state gets stale, derived state becomes unreliable.",
    visualizationType: "architecture",
    outcome:
      "Could eliminate data drift entirely by assigning strict canonical ownership per field — HubSpot owns deal/visibility state, Firebase owns application data, WordPress acts as a pure rendering surface. Bidirectional write conflicts become structurally impossible.",
  },
  {
    id: "challenge-2",
    title: "Idempotent Recompute Patterns for Webhook and Scheduled Job Reliability",
    description:
      "HubSpot retries webhook delivery if no ACK arrives within 10 seconds. Scheduled jobs can overlap when prior runs stall. Without idempotency keys, duplicate writes silently corrupt visibility recompute results and dead letter queues grow unchecked.",
    visualizationType: "flow",
    outcome:
      "Could prevent duplicate writes and silent failures by making every recompute operation safe to retry — certified status updates stop being lost when webhooks fire twice or jobs overlap. Dead letter queue depth would drop from unbounded growth to near-zero.",
  },
  {
    id: "challenge-3",
    title: "Observability Gap: Silent Sync Failures Are Currently Undetectable",
    description:
      "Sync failures happen silently today. Data goes stale without any alerting. Without structured logging, drift detection, or webhook event tracing, engineers discover problems days later during a manual audit — after the damage is already client-visible.",
    visualizationType: "before-after",
    outcome:
      "Could surface every sync failure, drift event, and missed webhook trigger within under 60 seconds rather than discovering stale data days later during a manual check. Structured logging turns invisible silent failures into actionable alerts.",
  },
];
