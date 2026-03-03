"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "./app-sidebar";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "Dashboard" }: AppHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    // Height driven by --header-height token (override in globals.css per app)
    <header
      className="border-b border-border/60 bg-background flex items-center px-6 shrink-0"
      style={{ height: "var(--header-height)" }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger — opens sidebar as a Sheet drawer */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 rounded-md hover:bg-[color:var(--surface-hover)] transition-colors duration-100"
                aria-label="Open navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 flex flex-col"
              style={{ width: "var(--sidebar-width)" }}
            >
              <SidebarContent collapsed={false} />
            </SheetContent>
          </Sheet>
          <h2 className="text-sm font-medium">{title}</h2>
          <span className="md:hidden text-[10px] text-muted-foreground/50 font-mono">
            by Humam
          </span>
        </div>
        <Link
          href="/proposal"
          className="hidden md:inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors duration-100"
        >
          View Proposal →
        </Link>
      </div>
    </header>
  );
}
