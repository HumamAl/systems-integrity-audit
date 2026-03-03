# Screening Answers

---

**1. A real example of multi-system architecture you designed or hardened**

Built a 3-system event pipeline (email → n8n → Claude API → approval dashboard) for a manufacturing client — hardened against silent failures with structured extraction and human-in-the-loop checkpoints. Demo built for your 5-platform setup: {VERCEL_URL}

---

**2. How you define and enforce source-of-truth in distributed systems**

Each entity gets one authoritative owner — all other systems treat it as read-only derived state. Sync events are logged and verified; any divergence surfaces as a drift alert. The source-of-truth matrix in the demo shows this pattern applied to your React/Firebase/HubSpot/WordPress stack: {VERCEL_URL}

---

**3. An example of preventing or resolving data drift**

Built a transaction monitoring system (PayGuard) that cross-references state across linked accounts and flags divergence before it compounds. For your setup, paid visibility drifting from CRM state is the same class of problem — the demo's drift detection view addresses it: {VERCEL_URL}

---

**4. Your hourly rate**

$75/hr. For a defined Phase 1 audit engagement like this, I'd suggest a fixed-scope deliverable — cleaner than open hours for a 10-15 hour audit. The demo shows the audit output format: {VERCEL_URL}

---

**5. Availability for initial audit engagement**

Available to start within 48 hours. Already built the architecture audit dashboard to show my approach before reaching out: {VERCEL_URL}
