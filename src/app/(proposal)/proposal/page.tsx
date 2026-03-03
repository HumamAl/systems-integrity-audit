// Proposal Builder agent replaces this content.
// This placeholder demonstrates the correct structure and styling for Tab 3.
//
// Rules for the Proposal Builder:
//   - Dark panel hero (--section-dark bg) with name, value prop, pulsing badge
//   - Proof of Work: 3-4 portfolio projects using <ProjectCard> component
//     Link only if liveUrl exists in developer-profile.md — never link to "#"
//   - How I Work: 4-step process (steps can vary based on job)
//   - Skills Grid: relevant tech only — use <SkillsGrid> component
//   - Dark panel CTA at bottom: pulsing availability dot + "Reply on Upwork to start"
//   - Signed "— Humam"
//   - NO: hover:-translate-y-*, shadow-lg, rounded-xl, glassmorphism
//   - NO: dead CTA links, buzzwords ("passionate", "innovative", "leverage")

import { APP_CONFIG } from "@/lib/config";
import { profile, portfolioProjects } from "@/data/proposal";
import { ProjectCard } from "@/components/proposal/project-card";
import { SkillsGrid } from "@/components/proposal/skills-grid";

export default function ProposalPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* ── Hero — dark panel ── */}
        <div
          className="rounded-lg p-8 space-y-4"
          style={{ background: "var(--section-dark)" }}
        >
          {/* "Built this demo for your project" badge */}
          <div className="inline-flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-mono text-white/50 tracking-wider uppercase">
              Built this demo for your project
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-light text-white/60">
              Hi, I&apos;m{" "}
              <span className="font-black text-white">{profile.name}</span>
            </h1>
            <p className="text-base text-white/60 mt-2 leading-relaxed max-w-2xl">
              {profile.tagline}
            </p>
          </div>

          <p className="text-sm text-white/50 leading-relaxed max-w-2xl">
            {profile.bio}
          </p>

          {/* Availability + CTA — text, not a dead button */}
          <div className="pt-2 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)]/60 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
              </span>
              <span className="text-xs text-white/50">Currently available</span>
            </div>
            <span className="text-xs text-white/30">·</span>
            <span className="text-xs font-medium text-primary">
              Reply on Upwork to start
            </span>
          </div>
        </div>

        {/* ── Proof of Work — portfolio projects ── */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Relevant Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                tech={project.tech}
                relevance={project.relevance}
                outcome={project.outcome}
                liveUrl={project.liveUrl}
              />
            ))}
          </div>
        </div>

        {/* ── How I Work ── */}
        <div>
          <h2 className="text-lg font-semibold mb-4">How I Work</h2>
          <div className="space-y-4">
            {profile.approach.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold font-mono shrink-0">
                    {i + 1}
                  </div>
                  {i < profile.approach.length - 1 && (
                    <div className="w-px flex-1 bg-border/60 mt-2" />
                  )}
                </div>
                <div className="pb-5">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Skills Grid — relevant tech only ── */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Skills</h2>
          <SkillsGrid categories={profile.skillCategories} />
        </div>

        {/* ── CTA close — dark panel ── */}
        <div
          className="rounded-lg p-8 space-y-4"
          style={{ background: "var(--section-dark)" }}
        >
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)]/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span className="text-xs text-white/50">Currently available</span>
          </div>
          <h2 className="text-xl font-light text-white/60">
            Let&apos;s build{" "}
            <span className="font-bold text-white">
              {APP_CONFIG.projectName}
            </span>{" "}
            together
          </h2>
          <p className="text-sm text-white/50 leading-relaxed max-w-lg">
            This demo is a starting point. I can have the production version
            scoped and started within days of your reply.
          </p>
          {/* "Reply on Upwork to start" — text, not a dead link */}
          <p className="text-sm font-medium text-primary">
            Reply on Upwork to start
          </p>
          <p className="text-sm text-white/40 pt-2">— Humam</p>
        </div>

      </div>
    </div>
  );
}
