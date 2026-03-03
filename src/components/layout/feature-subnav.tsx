"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  Database,
  AlertTriangle,
  Webhook,
  BarChart2,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/sync-monitor", label: "Sync Event Log", icon: Activity },
  { href: "/source-of-truth", label: "Field Ownership", icon: Database },
  { href: "/drift-detection", label: "Drift Incidents", icon: AlertTriangle },
  { href: "/webhook-logs", label: "Webhook & Jobs", icon: Webhook },
  { href: "/observability", label: "Observability", icon: BarChart2 },
];

export function FeatureSubnav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-0 border-b border-border overflow-x-auto shrink-0 bg-background">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors",
              "hover:text-foreground hover:bg-surface-hover",
              isActive
                ? "border-primary text-primary bg-accent/30"
                : "border-transparent text-muted-foreground"
            )}
          >
            <Icon className="h-3 w-3 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
