interface ExecutiveSummaryProps {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export function ExecutiveSummary({
  commonApproach,
  differentApproach,
  accentWord,
}: ExecutiveSummaryProps) {
  const renderDifferentApproach = () => {
    if (!accentWord) return <span>{differentApproach}</span>;
    const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = differentApproach.split(new RegExp(`(${escaped})`, "i"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === accentWord.toLowerCase() ? (
            <span key={i} className="text-primary font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div
      className="relative overflow-hidden border border-border"
      style={{
        background: "oklch(0.10 0.02 var(--primary-h, 260))",
        backgroundImage:
          "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.03), transparent 70%)",
        borderRadius: "var(--radius)",
        padding: "1rem 1.25rem",
      }}
    >
      <p className="text-xs md:text-sm leading-relaxed text-white/50 font-mono">
        {commonApproach}
      </p>
      <hr className="my-3 border-white/10" />
      <p className="text-sm md:text-base leading-relaxed font-medium text-white/90">
        {renderDifferentApproach()}
      </p>
      <p className="text-xs text-white/35 mt-3 font-mono">
        &larr;{" "}
        <a
          href="/"
          className="hover:text-white/60 transition-colors duration-100 underline underline-offset-2"
        >
          See the live audit dashboard
        </a>
      </p>
    </div>
  );
}
