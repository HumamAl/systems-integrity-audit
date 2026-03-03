// App configuration — single source of truth for all identity/attribution text.
// Layout Builder populates these values from the Job Analyst brief.

// Aesthetic profiles correspond to [data-theme] blocks in globals.css.
// The Job Analyst selects the aesthetic based on industry + client tone.
// See references/design-diversity.md for the full industry-to-aesthetic routing map.
export type AestheticProfile =
  | "linear"               // Snappy, border-first, dev-tool feel (DEFAULT)
  | "bold-editorial"       // Type-as-design, dramatic whitespace, sharp edges
  | "warm-organic"         // Rounded, earth tones, soft shadows, breathing room
  | "corporate-enterprise" // Dense, structured, authoritative, max information
  | "dark-premium"         // Dark canvas, controlled accent glow, exclusive
  | "swiss-typographic"    // Grid-precise, zero ornament, type-driven
  | "glassmorphism"        // Frosted panels floating over colorful backgrounds
  | "neobrutalism"         // Thick borders, offset hard shadows, raw energy
  | "nature-wellness"      // Green, calm, generous space, anti-anxiety pacing
  | "data-dense"           // Compact, monospace metrics, max info per pixel
  | "saas-modern"          // Friendly gradients, approachable, conversion-focused
  | "e-commerce"           // Product-first, clean, conversion-optimized
  | "brand-forward"        // Personality-driven, expressive, soft neo-brutalism
  | "retrofuturism";       // Chrome, neon, dark canvas, high-energy iridescent

// Demo format determines the Tab 1 layout architecture.
// The Job Analyst selects the format based on job type signals.
// See references/demo-format-patterns.md for the full routing table.
export type DemoFormat =
  | "dashboard-app"              // Sidebar + dashboard + feature pages (DEFAULT)
  | "mobile-app-preview"         // Phone frame with screen navigation
  | "landing-page"               // Full-width scrollable sections
  | "multi-screen-walkthrough"   // Browser frame with screen tabs
  | "split-panel-demo"           // Side-by-side panels
  | "admin-console"              // Dense full-width, minimal chrome
  ;

// Device model for frame rendering (only used with mobile-app-preview, multi-screen-walkthrough)
export type DeviceModel =
  | "iphone-15-pro"
  | "pixel-8"
  | "ipad-pro"
  | "generic-phone"
  | "chrome-browser"
  | "safari-browser"
  ;

// Quick routing reference (full table in references/design-diversity.md):
//
//   finance / fintech    → linear | dark-premium | corporate-enterprise
//   health B2B           → corporate-enterprise | linear
//   health consumer      → nature-wellness | warm-organic
//   SaaS / dev tools     → linear | dark-premium
//   AI / ML              → dark-premium | linear
//   e-commerce / retail  → e-commerce | saas-modern
//   logistics            → corporate-enterprise | data-dense
//   education K-12       → warm-organic | saas-modern
//   education B2B        → saas-modern | linear
//   real estate          → linear | corporate-enterprise
//   marketplace          → saas-modern | e-commerce
//   food / restaurant    → warm-organic | nature-wellness
//   creative agency      → bold-editorial | swiss-typographic
//   gaming               → dark-premium | retrofuturism
//   legal / compliance   → corporate-enterprise | linear
//   cybersecurity        → dark-premium | corporate-enterprise
//   DevOps / monitoring  → data-dense | dark-premium
//   HR tech              → saas-modern | warm-organic
//   sustainability       → nature-wellness | warm-organic
//   web3 / crypto        → dark-premium | retrofuturism

export const APP_CONFIG = {
  appName: "App Name",                       // Display name (sidebar header, page title)
  projectName: "Project Name",               // Client's product name (tab bar microtext, footer)
  clientName: null as string | null,         // Client first name, or null — never render "null"
  domain: "tech",                            // Domain (finance, health, marketplace, tech, etc.)
  aesthetic: "linear" as AestheticProfile,   // Drives data-theme="..." on <html>
  demoFormat: "dashboard-app" as DemoFormat,          // Layout architecture for Tab 1
  deviceModel: undefined as DeviceModel | undefined,  // Device frame model (frame formats only)
  screenCount: undefined as number | undefined,       // Number of screens in frame demos
} as const;
