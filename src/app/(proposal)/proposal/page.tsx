import { ExternalLink, TrendingUp } from "lucide-react";
import { APP_CONFIG } from "@/lib/config";
import { proposalData } from "@/data/proposal";

// Tab 3 — "Work With Me"
// Aesthetic: data-dense — sharp corners (radius 0.25rem), full borders, monospace labels,
// compact but not cramped, instant motion (60-100ms), no shadows.
// Visual bookending: dark hero panel + dark CTA panel, structured content in between.

export default function ProposalPage() {
  const { hero, portfolioProjects, approach, skills, cta } = proposalData;
  const displayName = APP_CONFIG.clientName ?? APP_CONFIG.projectName;

  return (
    <div className="max-w-4xl mx-auto px-5 py-7 space-y-10">

      {/* ── Section 1: Hero (Project Brief) ────────────────────────────────── */}
      <section
        className="overflow-hidden"
        style={{
          borderRadius: "var(--radius)",
          background: `oklch(0.10 0.02 var(--primary-h, 260))`,
        }}
      >
        <div className="p-7 space-y-4">
          {/* Effort badge — mandatory, pulsing dot */}
          <div className="inline-flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-white/50">
              Built this demo for your project
            </span>
          </div>

          {/* Role prefix — domain-specific */}
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 mt-1">
            Full-Stack Engineer · Systems Integration · TypeScript / Node.js
          </p>

          {/* Name headline */}
          <h1 className="text-4xl md:text-5xl tracking-tight leading-none mt-1">
            <span className="font-light text-white/70">Hi, I&apos;m</span>{" "}
            <span className="font-black text-white">{hero.name}</span>
          </h1>

          {/* Tailored value prop — one sentence, specific to this job */}
          <p className="text-base text-white/65 max-w-2xl leading-relaxed">
            {hero.valueProp}
          </p>
        </div>

        {/* Stats shelf — data-dense: monospace values, compact row */}
        <div
          className="grid grid-cols-3 border-t px-7 py-3"
          style={{
            borderColor: "oklch(1 0 0 / 0.08)",
            background: "oklch(1 0 0 / 0.04)",
          }}
        >
          {hero.stats.map((stat) => (
            <div key={stat.label} className="space-y-0.5">
              <div className="font-mono text-xl font-bold text-white">
                {stat.value}
              </div>
              <div className="font-mono text-[10px] tracking-wide uppercase text-white/45">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: Proof of Work ────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-baseline gap-3">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Proof of Work
          </p>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Relevant Projects</h2>

        <div className="grid gap-3 md:grid-cols-2">
          {portfolioProjects.map((project) => (
            <div
              key={project.name}
              className="aesthetic-card p-4 space-y-2.5"
            >
              {/* Project header */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-snug">{project.name}</h3>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary shrink-0"
                    style={{ transition: "color var(--t-interactive)" }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Outcome badge */}
              <div
                className="flex items-start gap-1.5 text-xs"
                style={{ color: "var(--success)" }}
              >
                <TrendingUp className="w-3 h-3 mt-0.5 shrink-0" />
                <span className="leading-snug">{project.outcome}</span>
              </div>

              {/* Tech tags — monospace, compact */}
              <div className="flex flex-wrap gap-1">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground bg-muted border border-border/50"
                    style={{ borderRadius: "var(--radius-sm)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Relevance note */}
              {project.relevance && (
                <p className="text-[11px] text-primary/70 italic leading-snug border-t border-border/40 pt-2">
                  {project.relevance}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: How I Work (Audit engagement steps) ─────────────────── */}
      <section className="space-y-3">
        <div className="flex items-baseline gap-3">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Process
          </p>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">How I Work</h2>

        {/* data-dense: 2-column grid of bordered step cards, monospace step labels */}
        <div className="grid gap-3 sm:grid-cols-2">
          {approach.map((step) => (
            <div
              key={step.step}
              className="aesthetic-card p-4 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  Step {step.step}
                </span>
                <span
                  className="font-mono text-[10px] text-muted-foreground/60 border px-1.5 py-0.5"
                  style={{
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {step.timeline}
                </span>
              </div>
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--primary)" }}
              >
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Skills Grid ──────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-baseline gap-3">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Tech Stack
          </p>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">What I Build With</h2>

        {/* data-dense: compact bordered category rows */}
        <div className="space-y-2">
          {skills.map((category) => (
            <div
              key={category.category}
              className="aesthetic-card px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-1.5"
            >
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground w-36 shrink-0">
                {category.category}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 font-mono text-xs text-foreground/80 bg-muted border border-border/60"
                    style={{ borderRadius: "var(--radius-sm)" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: CTA (Dark Panel) ────────────────────────────────────── */}
      <section
        className="overflow-hidden text-center space-y-4 p-8"
        style={{
          borderRadius: "var(--radius)",
          background: `oklch(0.10 0.02 var(--primary-h, 260))`,
        }}
      >
        {/* Pulsing availability indicator — mandatory */}
        <div className="flex items-center justify-center gap-2">
          <span className="relative inline-flex h-2 w-2 shrink-0">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "var(--success)" }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: "var(--success)" }}
            />
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: "color-mix(in oklch, var(--success) 80%, white)" }}
          >
            {cta.availability}
          </span>
        </div>

        {/* Tailored headline */}
        <h2 className="text-xl font-bold text-white">{cta.headline}</h2>

        {/* Specific body copy — references the demo */}
        <p className="text-sm text-white/65 max-w-lg mx-auto leading-relaxed">
          {cta.body}
        </p>

        {/* Binary CTA — not a dead link */}
        <p className="text-sm text-white/80 font-mono pt-1">
          10-minute call or I can send a 2-slide audit scope — your pick.
        </p>

        {/* Primary action — text, not a button */}
        <p className="text-base font-semibold text-white pt-1">
          {cta.action}
        </p>

        {/* Back to demo link */}
        <a
          href="/"
          className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/60"
          style={{ transition: "color var(--t-interactive)" }}
        >
          ← Back to the demo
        </a>

        {/* Signature */}
        <p
          className="text-xs text-white/35 pt-3 mt-3 border-t font-mono"
          style={{ borderColor: "oklch(1 0 0 / 0.08)" }}
        >
          — Humam
        </p>
      </section>

    </div>
  );
}
