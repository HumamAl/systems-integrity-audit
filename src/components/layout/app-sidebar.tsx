"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  User,
  ArrowRight,
  Github,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// AGENT CUSTOMIZATION ZONE
// Feature Builder and Layout Builder agents edit this section only.
// Replace the navItems array with 3-5 items for the app's feature pages.
// Replace the icon in SidebarLogo if needed (import from lucide-react).
// ═══════════════════════════════════════════════════════════════════════════

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  // Dashboard Builder agent: add 3-5 feature page nav items here.
  // Example: { href: "/orders", label: "Orders", icon: ShoppingCart },
];

function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="p-4 border-b border-border/60 flex items-center gap-3">
      {/* Agent: replace the letter icon with a relevant Lucide icon if appropriate */}
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-primary font-bold text-sm font-mono">
          {APP_CONFIG.appName.charAt(0)}
        </span>
      </div>
      {!collapsed && (
        <div className="overflow-hidden">
          <h1 className="font-semibold text-sm leading-tight truncate">
            {APP_CONFIG.appName}
          </h1>
          {/* "Proposal Demo" subtitle with pulsing indicator — always visible */}
          <p className="text-[10px] text-muted-foreground/60 font-mono tracking-widest uppercase flex items-center gap-1.5">
            Proposal Demo
            <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary/60" />
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{ paddingTop: "var(--nav-item-py)", paddingBottom: "var(--nav-item-py)" }}
            className={cn(
              "flex items-center gap-3 px-3 rounded-md text-sm transition-colors duration-100",
              isActive
                ? "bg-primary/8 text-primary font-medium"
                : "text-muted-foreground hover:bg-[color:var(--surface-hover)]"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FIXED ZONE — DO NOT MODIFY
// These sub-components are structural conversion elements.
// They import text from APP_CONFIG but their structure must not change.
// ═══════════════════════════════════════════════════════════════════════════

function SidebarCrossTabLinks({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="px-2 pt-2 border-t border-border/60 space-y-1">
      <Link
        href="/challenges"
        style={{ paddingTop: "var(--nav-item-py)", paddingBottom: "var(--nav-item-py)" }}
        className="flex items-center gap-3 px-3 rounded-md text-sm text-muted-foreground hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
      >
        <Lightbulb className="w-4 h-4 shrink-0" />
        {!collapsed && <span>My Approach</span>}
      </Link>
      <Link
        href="/proposal"
        style={{ paddingTop: "var(--nav-item-py)", paddingBottom: "var(--nav-item-py)" }}
        className="flex items-center gap-3 px-3 rounded-md text-sm text-muted-foreground hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
      >
        <User className="w-4 h-4 shrink-0" />
        {!collapsed && <span>Work With Me</span>}
      </Link>
    </div>
  );
}

function SidebarMicroCTA({ collapsed }: { collapsed: boolean }) {
  if (collapsed) return null;
  return (
    <div className="px-3 py-2">
      <div className="linear-card p-3 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <p className="text-xs font-medium text-foreground mb-1">
          Like what you see?
        </p>
        <p className="text-[11px] text-muted-foreground mb-2 leading-relaxed">
          Built this for your project. Let&apos;s talk.
        </p>
        <Link
          href="/proposal"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-100"
        >
          See proposal <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="border-t border-border/40 p-2 space-y-1">
      {!collapsed && (
        <p className="px-3 text-xs text-muted-foreground/80">
          Built for{" "}
          <span className="text-foreground/70 font-medium">
            {APP_CONFIG.projectName}
          </span>{" "}
          by Humam
        </p>
      )}
      <a
        href="https://github.com/HumamAl"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] text-primary/70 hover:text-primary hover:bg-primary/8 transition-colors duration-100"
      >
        <Github className="w-3.5 h-3.5 shrink-0" />
        {!collapsed && <span>by Humam ↗</span>}
      </a>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTED SIDEBAR CONTENT
// Used both in the desktop aside and in the mobile Sheet drawer.
// ═══════════════════════════════════════════════════════════════════════════

export function SidebarContent({ collapsed }: { collapsed: boolean }) {
  return (
    <>
      {/* ── AGENT CUSTOMIZES: Logo and app identity ── */}
      <SidebarLogo collapsed={collapsed} />

      {/* ── AGENT CUSTOMIZES: Feature page navigation ── */}
      <SidebarNav collapsed={collapsed} />

      {/* ── FIXED: Cross-tab links to /challenges and /proposal ── */}
      <SidebarCrossTabLinks collapsed={collapsed} />

      {/* ── FIXED: "Like what you see?" micro-CTA card ── */}
      <SidebarMicroCTA collapsed={collapsed} />

      {/* ── FIXED: "Built for [project] by Humam" attribution ── */}
      <SidebarFooter collapsed={collapsed} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DESKTOP SIDEBAR SHELL
// Width driven by --sidebar-width and --sidebar-collapsed-width CSS tokens.
// Background driven by --sidebar-bg token (override to tint per domain).
// ═══════════════════════════════════════════════════════════════════════════

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="h-full border-r border-border/60 hidden md:flex flex-col transition-all duration-150"
      style={{
        width: collapsed
          ? "var(--sidebar-collapsed-width)"
          : "var(--sidebar-width)",
        background: "var(--sidebar-bg)",
        minWidth: collapsed
          ? "var(--sidebar-collapsed-width)"
          : "var(--sidebar-width)",
      }}
    >
      <SidebarContent collapsed={collapsed} />

      {/* Collapse toggle */}
      <div className="p-2 border-t border-border/60">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-[color:var(--surface-hover)] w-full transition-colors duration-100"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
