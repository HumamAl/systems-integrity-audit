"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";

// Tab labels and routes are fixed — do NOT change these.
// They are part of the conversion architecture and QA checklist.
const tabs = [
  { label: "Live Demo", href: "/" },
  { label: "My Approach", href: "/challenges" },
  { label: "Work With Me", href: "/proposal" },
];

export function TabNavigation() {
  const pathname = usePathname();

  return (
    // Tab bar: sticky, frosted glass, --tab-bar-bg tint support, 49px total height
    // (48px content + 1px border-b). Update --tab-bar-height in globals.css if changed.
    <nav
      className="border-b border-border/60 backdrop-blur-xl sticky top-0 z-50"
      style={{ background: "var(--tab-bar-bg, var(--background))" }}
    >
      <div className="flex items-center" style={{ height: "48px" }}>
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/" ||
                (!pathname.startsWith("/challenges") &&
                  !pathname.startsWith("/proposal"))
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-3 md:px-5 h-full flex items-center text-sm font-medium border-b-2 transition-colors duration-100 flex-1 md:flex-none justify-center",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground/80"
              )}
            >
              {tab.label}
            </Link>
          );
        })}

        {/* Desktop microtext — visible only on md+ */}
        <div className="ml-auto flex items-center pr-4">
          <span className="hidden md:block font-mono text-[10px] tracking-widest uppercase text-muted-foreground/50">
            Demo for {APP_CONFIG.projectName}
          </span>
        </div>
      </div>
    </nav>
  );
}
