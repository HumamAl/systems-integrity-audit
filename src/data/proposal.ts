import type { Profile, PortfolioProject } from "@/lib/types";

export const profile: Profile = {
  name: "Humam",
  tagline: "Full-stack developer specializing in Next.js applications",
  bio: "I build MVPs and production apps that solve real operational problems — CRM systems, fleet management platforms, AI-powered dashboards, and e-commerce tools. My approach is straightforward: understand the business need, build something that works, and ship it fast.",
  approach: [
    {
      title: "Understand the Problem",
      description: "Read the full requirements, identify the core pain point",
    },
    {
      title: "Build a Working Demo",
      description:
        "Show, don't tell — a live demo is worth 1000 words of proposal text",
    },
    {
      title: "Use Realistic Data",
      description:
        "Mock data that looks like real client data, not placeholder text",
    },
    {
      title: "Ship Fast",
      description: "MVP first, polish later. Get something deployed quickly",
    },
  ],
  skillCategories: [
    {
      name: "Frontend",
      skills: [
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "shadcn/ui",
        "Recharts",
      ],
    },
    {
      name: "Backend & APIs",
      skills: [
        "Node.js",
        "REST APIs",
        "Microsoft Graph",
        "Stripe",
        "Shopify API",
      ],
    },
    {
      name: "AI & Automation",
      skills: [
        "Claude API",
        "OpenAI API",
        "n8n",
        "Prompt Engineering",
      ],
    },
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "wmf-agent",
    title: "WMF Agent Dashboard",
    description:
      "AI-powered customer service agent for manufacturing — email classification, RFQ extraction, human-in-the-loop approval",
    tech: ["Next.js", "Claude API", "n8n", "Microsoft Graph"],
  },
  {
    id: "lead-crm",
    title: "Lead Intake CRM",
    description:
      "Lead intake form, CRM dashboard, lead scoring, pipeline management, and automation rules",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
  },
  {
    id: "fleet-saas",
    title: "Fleet Maintenance SaaS",
    description:
      "Asset tracking, work orders, preventive maintenance, inspections, parts inventory, analytics",
    tech: ["Next.js", "Recharts", "TypeScript", "shadcn/ui"],
  },
];
