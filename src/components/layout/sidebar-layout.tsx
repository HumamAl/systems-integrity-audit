import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex"
      style={{ height: "calc(100vh - var(--tab-bar-height))" }}
    >
      {/* Desktop sidebar — hidden on mobile, shown at md+ */}
      <AppSidebar />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AppHeader />
        {/* Content padding driven by --content-padding token
            Compact: 1rem | Standard: 1.5rem | Spacious: 2rem */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: "var(--content-padding)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
