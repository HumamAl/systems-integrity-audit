"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeftRight, CheckCircle } from "lucide-react";

type Mode = "before" | "after";

interface SystemNode {
  id: string;
  label: string;
  tech: string;
  type: "frontend" | "backend" | "database" | "cms" | "crm";
  ownerOf?: string;
  readsFrom?: string;
}

const systems: SystemNode[] = [
  { id: "react", label: "React Frontend", tech: "React 18", type: "frontend" },
  { id: "node", label: "Node.js API", tech: "Node.js 20", type: "backend" },
  { id: "firebase", label: "Firebase", tech: "Firestore", type: "database", ownerOf: "Application Data" },
  { id: "wordpress", label: "WordPress", tech: "WP + REST", type: "cms", readsFrom: "Firebase" },
  { id: "hubspot", label: "HubSpot", tech: "CRM API", type: "crm", ownerOf: "Deal / Visibility State" },
];

const typeColors: Record<SystemNode["type"], string> = {
  frontend: "bg-primary/10 border-primary/30 text-primary",
  backend: "bg-muted border-border text-foreground",
  database: "bg-primary/10 border-primary/30 text-primary",
  cms: "bg-muted border-border text-foreground",
  crm: "bg-primary/20 border-primary/40 text-primary",
};

export function VizArchitecture() {
  const [mode, setMode] = useState<Mode>("before");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wide">
          Field-Level Ownership Model
        </span>
        <div className="flex items-center gap-1 border border-border rounded-sm overflow-hidden">
          <button
            onClick={() => setMode("before")}
            className={`px-2.5 py-1 text-xs font-mono transition-colors duration-100 ${
              mode === "before"
                ? "bg-destructive/10 text-destructive border-r border-border"
                : "text-muted-foreground hover:bg-muted border-r border-border"
            }`}
          >
            Before
          </button>
          <button
            onClick={() => setMode("after")}
            className={`px-2.5 py-1 text-xs font-mono transition-colors duration-100 ${
              mode === "after"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            After
          </button>
        </div>
      </div>

      {mode === "before" ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-mono">
            No ownership boundaries — any system can write any field
          </p>
          <div className="grid grid-cols-5 gap-1.5 items-center">
            {systems.map((sys) => (
              <div
                key={sys.id}
                className={`border px-2 py-1.5 text-center ${typeColors[sys.type]}`}
                style={{ borderRadius: "var(--radius)" }}
              >
                <div className="text-xs font-semibold leading-tight">{sys.label.split(" ")[0]}</div>
                <div className="text-xs opacity-60 font-mono leading-tight">{sys.tech}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 py-1">
            <ArrowLeftRight className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-mono text-destructive">
              Bidirectional writes — data drift inevitable
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs font-mono">
            {[
              { from: "Node", to: "Firebase", label: "write deal_stage" },
              { from: "HubSpot", to: "Firebase", label: "write visibility" },
              { from: "WordPress", to: "Firebase", label: "write app_data" },
            ].map((arrow, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-2 py-1 border text-xs"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--destructive) 6%, transparent)",
                  borderColor: "color-mix(in oklch, var(--destructive) 20%, transparent)",
                  borderRadius: "var(--radius)",
                }}
              >
                <span className="text-muted-foreground truncate">{arrow.from} ⇄ {arrow.to}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-mono">
            Strict ownership: each field has exactly one canonical writer
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {[
              {
                owner: "HubSpot",
                tech: "CRM API",
                owns: "deal_stage · visibility_state · certified_status",
                consumers: ["Node.js API", "React"],
              },
              {
                owner: "Firebase",
                tech: "Firestore",
                owns: "application_data · derived_state · user_profile",
                consumers: ["Node.js API", "WordPress (read-only)"],
              },
            ].map((row, i) => (
              <div
                key={i}
                className="border border-primary/20 px-3 py-2"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--primary) 4%, transparent)",
                  borderRadius: "var(--radius)",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-primary font-mono">{row.owner}</span>
                  <span className="text-xs text-muted-foreground font-mono">{row.tech}</span>
                </div>
                <div className="text-xs font-mono text-foreground/70 mb-1 truncate">{row.owns}</div>
                <div className="flex items-center gap-1">
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-xs font-mono text-muted-foreground">
                    reads: {row.consumers.join(", ")}
                  </span>
                </div>
              </div>
            ))}
            <div
              className="border border-border px-3 py-1.5"
              style={{ borderRadius: "var(--radius)" }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-[color:var(--success)]" />
                <span className="text-xs font-mono text-muted-foreground">
                  WordPress: read-only rendering surface — zero write access
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
