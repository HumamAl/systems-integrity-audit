import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { APP_CONFIG, type AestheticProfile, type DemoFormat } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Returns the current aesthetic profile from APP_CONFIG.
// Use this in components that need to branch on aesthetic for structural HTML changes
// (e.g., glassmorphism needs an extra backdrop element, neobrutalism uses border-2).
//
// For pure visual differences (shadow, radius, color), prefer CSS variables in globals.css
// over calling this hook — CSS variables are always the right first approach.
//
// Usage:
//   const aesthetic = useAesthetic()
//   const cardClass = aesthetic === "neobrutalism"
//     ? "border-2 border-foreground shadow-[4px_4px_0px_var(--foreground)]"
//     : "aesthetic-card"
export function useAesthetic(): AestheticProfile {
  return APP_CONFIG.aesthetic;
}

// Returns true if the current aesthetic uses a dark background.
// Useful for conditional text color or icon color adjustments.
export function isDarkAesthetic(): boolean {
  const dark: AestheticProfile[] = ["dark-premium", "retrofuturism"];
  return dark.includes(APP_CONFIG.aesthetic);
}

// Returns true if the current aesthetic uses offset hard shadows (neobrutalist family).
// Useful for adjusting interactive states that rely on shadow translation.
export function isHardShadowAesthetic(): boolean {
  const hardShadow: AestheticProfile[] = ["neobrutalism", "brand-forward"];
  return hardShadow.includes(APP_CONFIG.aesthetic);
}

// Returns the density class for the current aesthetic.
// "compact" — data-dense, corporate-enterprise
// "spacious" — nature-wellness, bold-editorial
// "standard" — everything else
export type DensityClass = "compact" | "standard" | "spacious";

export function getAestheticDensity(): DensityClass {
  const compact: AestheticProfile[] = ["data-dense", "corporate-enterprise"];
  const spacious: AestheticProfile[] = ["nature-wellness", "bold-editorial"];
  if (compact.includes(APP_CONFIG.aesthetic)) return "compact";
  if (spacious.includes(APP_CONFIG.aesthetic)) return "spacious";
  return "standard";
}

// ── Demo Format Utilities ──────────────────────────────────────────

// Returns the current demo format from APP_CONFIG.
export function getDemoFormat(): DemoFormat {
  return APP_CONFIG.demoFormat;
}

// Returns true if the current format uses a device frame (phone, browser, tablet).
export function isFramedFormat(): boolean {
  const framed: DemoFormat[] = ["mobile-app-preview", "multi-screen-walkthrough"];
  return framed.includes(APP_CONFIG.demoFormat);
}

// Returns true if the current format uses the sidebar layout.
export function isSidebarFormat(): boolean {
  return APP_CONFIG.demoFormat === "dashboard-app";
}

// Returns true if the current format is full-width (no sidebar, no frame).
export function isFullWidthFormat(): boolean {
  const fullWidth: DemoFormat[] = ["landing-page", "admin-console"];
  return fullWidth.includes(APP_CONFIG.demoFormat);
}
