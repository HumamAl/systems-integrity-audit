// Dashboard Builder agent replaces this content.
// This placeholder demonstrates correct card and layout patterns.
// DO NOT use rounded-xl, shadow-lg, shadow-sm, or hover:-translate-y-* here.
// All cards use .linear-card. Padding uses --card-padding token.

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview and key metrics
        </p>
      </div>

      {/* Stat cards — Dashboard Builder replaces with 4 real KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="linear-card"
            style={{ padding: "var(--card-padding)" }}
          >
            <p className="text-sm font-medium text-muted-foreground">Stat {n}</p>
            <p className="text-2xl font-bold mt-1 font-mono">--</p>
          </div>
        ))}
      </div>

      {/* Chart area — Dashboard Builder replaces with an interactive chart */}
      <div
        className="linear-card"
        style={{ padding: "var(--card-padding)" }}
      >
        <p className="text-sm font-medium mb-4">Chart</p>
        <div className="h-48 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border/60 rounded-md">
          Dashboard Builder: add chart here
        </div>
      </div>

      {/* Secondary panel — Dashboard Builder replaces with table or secondary chart */}
      <div
        className="linear-card"
        style={{ padding: "var(--card-padding)" }}
      >
        <p className="text-sm font-medium mb-4">Secondary Panel</p>
        <div className="h-32 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border/60 rounded-md">
          Dashboard Builder: add secondary panel here
        </div>
      </div>

      {/* Bottom banner — identity & cross-tab CTA (required per spec) */}
      <div
        className="rounded-lg border border-primary/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{ background: "var(--section-dark)" }}
      >
        <p className="text-xs text-white/70">
          This is a live demo built for{" "}
          <span className="text-white font-medium">{/* APP_CONFIG.projectName — Dashboard Builder adds import */}your project</span>
        </p>
        <div className="flex items-center gap-3 text-xs">
          <a href="/challenges" className="text-primary hover:text-primary/80 transition-colors duration-100">
            My Approach →
          </a>
          <a href="/proposal" className="text-primary hover:text-primary/80 transition-colors duration-100">
            Work With Me →
          </a>
        </div>
      </div>
    </div>
  );
}
