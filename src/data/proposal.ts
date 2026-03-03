import type { Profile, PortfolioProject } from "@/lib/types";

// ── Proposal data — Systems Integrity Audit ─────────────────────────────────
// Aesthetic: data-dense (sharp corners, monospace, compact, full borders)
// Domain: multi-platform systems integration / tech
// Job type: Audit engagement → Audit / Diagnose / Harden / Monitor step flow

export const proposalData = {
  hero: {
    name: "Humam",
    valueProp:
      "Full-stack systems engineer who hardens multi-platform integrations — source-of-truth mapping, sync reliability, and observability that actually prevents data drift.",
    badge: "Built this demo for your project",
    stats: [
      { value: "24+", label: "Projects Shipped" },
      { value: "< 48hr", label: "Demo Turnaround" },
      { value: "15+", label: "Industries Served" },
    ],
  },

  portfolioProjects: [
    {
      name: "eBay Pokemon Monitor",
      description:
        "Real-time eBay listing monitor with webhook-based Discord alerts, price trend tracking, and structured API polling. Handles bursts of webhook events with deduplication and delivery guarantees.",
      outcome: "Real-time listing monitor with webhook-based Discord alerts and price trend tracking",
      tech: ["Next.js", "TypeScript", "eBay Browse API", "Discord Webhooks"],
      url: "https://ebay-pokemon-monitor.vercel.app",
      relevance:
        "Closest structural match: webhook delivery, API polling, event-driven alerting — same integration patterns your audit will surface and harden.",
    },
    {
      name: "WMF Agent Dashboard",
      description:
        "AI-powered customer service agent for Windsor Metal Finishing. Event-driven pipeline with n8n webhooks, multi-system handoffs, and a human-in-the-loop approval workflow spanning email → extraction → ERP.",
      outcome: "Replaced a 4-hour manual quote review process with a 20-minute structured extraction and approval flow",
      tech: ["Next.js", "Claude API", "n8n", "Microsoft Graph", "TypeScript"],
      url: "https://wmf-agent-dashboard.vercel.app",
      relevance:
        "Multi-system integration with event-driven pipelines — similar to what happens between your 5 platforms.",
    },
    {
      name: "Data Intelligence Platform",
      description:
        "Multi-source data aggregation dashboard with interactive charts, filterable insights, and a unified analytics layer pulling from disparate data sources.",
      outcome: "Unified analytics dashboard pulling data from multiple sources with interactive charts and filterable insights",
      tech: ["Next.js", "TypeScript", "Recharts", "shadcn/ui"],
      url: "https://data-intelligence-platform-sandy.vercel.app",
      relevance:
        "Multi-source aggregation and unified visibility — the observability layer this job needs.",
    },
    {
      name: "Lead Intake CRM",
      description:
        "Custom lead intake system with automation rules engine, pipeline management, and configurable trigger/action workflows — same structural pattern as sync contracts and recompute triggers.",
      outcome: "End-to-end lead flow — public intake form to scored pipeline with configurable automation rules",
      tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
      url: null,
      relevance:
        "Automation rules and trigger logic map directly to idempotent recompute patterns in your integration layer.",
    },
  ],

  approach: [
    {
      step: "01",
      title: "Audit",
      description:
        "Map the current data flow across all 5 platforms — document field ownership, sync paths, and failure points before touching any code. Identify what's canonical vs. derived vs. stored-and-stale.",
      timeline: "Days 1–3",
    },
    {
      step: "02",
      title: "Diagnose",
      description:
        "Identify canonical conflicts, derived-vs-stored state problems, drift risk areas, and observability gaps. Produce a ranked issue register before any fixes are made.",
      timeline: "Days 4–6",
    },
    {
      step: "03",
      title: "Harden",
      description:
        "Implement source-of-truth contracts, idempotent recompute patterns, webhook reliability (retry + dead-letter), and structured logging. Fixes are traceable, testable, and reversible.",
      timeline: "Days 7–14",
    },
    {
      step: "04",
      title: "Monitor",
      description:
        "Deploy drift detection, sync health dashboards, and alerting. Failures are detectable — not silent. Hand off runbooks so the next engineer knows what to watch.",
      timeline: "Days 15–18",
    },
  ],

  skills: [
    {
      category: "Backend & Integration",
      items: ["Node.js", "Express", "TypeScript", "REST API Design", "Webhook Handling"],
    },
    {
      category: "Platforms",
      items: ["Firebase / Firestore", "WordPress REST API", "HubSpot API", "Microsoft Graph"],
    },
    {
      category: "Architecture",
      items: ["Event-Driven Design", "Idempotency Patterns", "Dead-Letter Queues", "Source-of-Truth Contracts"],
    },
    {
      category: "Observability",
      items: ["Structured Logging", "Drift Detection", "Sync Health Dashboards", "Alert Design"],
    },
    {
      category: "Frontend",
      items: ["Next.js", "React", "Tailwind CSS", "shadcn/ui", "Recharts"],
    },
  ],

  cta: {
    headline: "Ready to map your integration layer and stop the silent failures.",
    body: "The audit console above shows exactly what I'd build for you — drift detection, sync health, webhook reliability. The real engagement starts with a scope call.",
    action: "Reply on Upwork to start",
    availability: "Currently available for new projects",
  },
};

// ── Legacy shape re-exports (used by placeholder template — kept for compat) ──

export const profile: Profile = {
  name: "Humam",
  tagline: proposalData.hero.valueProp,
  bio: "I build systems that stay in sync — from the initial audit through hardening and monitoring. Approach is straightforward: map the problem first, then fix it methodically.",
  approach: proposalData.approach.map((s) => ({
    title: s.title,
    description: s.description,
  })),
  skillCategories: proposalData.skills.map((s) => ({
    name: s.category,
    skills: s.items,
  })),
};

export const portfolioProjects: PortfolioProject[] = proposalData.portfolioProjects.map(
  (p, idx) => ({
    id: `proj-${idx}`,
    title: p.name,
    description: p.description,
    tech: p.tech,
    relevance: p.relevance,
    outcome: p.outcome,
    liveUrl: p.url ?? undefined,
  })
);
