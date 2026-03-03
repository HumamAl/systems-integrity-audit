import type { LucideIcon } from "lucide-react";

// ─── Sidebar / Navigation ────────────────────────────────────────────────────

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ─── Challenge & Proposal (template types preserved) ─────────────────────────

export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

export interface DemoScreen {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
}

export type ConversionVariant = "sidebar" | "inline" | "floating" | "banner";

// ─── Domain: Integration Surfaces (Platform Registry) ────────────────────────

export type PlatformType =
  | "frontend"
  | "backend"
  | "database"
  | "cms"
  | "crm"
  | "queue"
  | "analytics";

export type IntegrationSurfaceStatus =
  | "in_sync"
  | "drifted"
  | "degraded"
  | "failed"
  | "stale"
  | "pending_recompute";

export interface IntegrationSurface {
  id: string;                        // e.g. "surf_react_fe"
  name: string;                      // "React Frontend"
  platformType: PlatformType;
  technology: string;                // "React 18 / TypeScript", "Node.js 20 / Express"
  status: IntegrationSurfaceStatus;
  /** Uptime over rolling 30-day window, percentage 0-100 */
  uptimePct: number;
  lastSyncAt: string;                // ISO datetime
  lastHealthCheckAt: string;
  /** Average latency of outbound sync calls in ms */
  avgSyncLatencyMs: number;
  /** Count of active sync endpoints exposed or consumed */
  activeSyncEndpoints: number;
  /** Sync fragility score 0-100: higher = more fragile */
  syncFragilityScore: number;
  /** Whether this surface owns any canonical data fields */
  isCanonicalSource: boolean;
  statusNote?: string;               // present when status !== "in_sync"
  ownedFieldCount: number;
  consumedFieldCount: number;
}

// ─── Domain: Source-of-Truth Matrix (Canonical Field Ownership) ───────────────

export type DriftRiskLevel = "low" | "medium" | "high" | "critical";

export type FieldSyncMechanism =
  | "webhook_push"
  | "scheduled_poll"
  | "event_driven"
  | "manual_reconcile"
  | "derived_state";

export type CanonicalFieldStatus =
  | "in_sync"
  | "drifted"
  | "stale"
  | "pending_recompute"
  | "validation_error"
  | "no_consumer_ack";

export interface CanonicalField {
  id: string;                        // "field_contact_email"
  fieldName: string;                 // "contact.email"
  displayLabel: string;              // "Contact Email"
  canonicalSourceId: string;         // references IntegrationSurface.id
  /** System IDs that read / consume this field */
  consumerSurfaceIds: string[];
  syncMechanism: FieldSyncMechanism;
  status: CanonicalFieldStatus;
  driftRisk: DriftRiskLevel;
  /** Last time the canonical source wrote an authoritative value */
  lastCanonicalWriteAt: string;
  /** Last time consumers acknowledged receiving the current value */
  lastConsumerAckAt: string | null;
  /** Difference in seconds between canonical write and last consumer ack */
  syncLagSeconds: number | null;
  /** Present when status === "drifted" | "validation_error" */
  driftDetail?: string;
  /** How many drift incidents recorded for this field in last 30 days */
  driftIncidentCount: number;
}

// ─── Domain: Sync Event Log ───────────────────────────────────────────────────

export type SyncEventType =
  | "webhook_trigger"
  | "scheduled_job"
  | "recompute"
  | "manual_reconcile"
  | "dead_letter_retry";

export type SyncEventStatus =
  | "success"
  | "failed"
  | "partial"
  | "pending"
  | "timed_out"
  | "dead_lettered";

export interface SyncEvent {
  id: string;                        // "evt_8x9k2"
  eventType: SyncEventType;
  sourceSurfaceId: string;           // references IntegrationSurface.id
  targetSurfaceId: string;           // references IntegrationSurface.id
  status: SyncEventStatus;
  /** End-to-end latency in ms; null if not yet completed */
  latencyMs: number | null;
  /** Fields touched by this sync event */
  affectedFieldIds: string[];
  triggeredAt: string;               // ISO datetime
  completedAt: string | null;
  /** HTTP status code if webhook; null for scheduled jobs */
  httpStatusCode: number | null;
  /** Number of records processed */
  recordsProcessed: number;
  /** Number of records that failed validation */
  validationErrors: number;
  /** Present when status === "failed" | "dead_lettered" | "timed_out" */
  errorCode?: string;
  errorMessage?: string;
  /** Whether this event was idempotent (safe to retry) */
  isIdempotent: boolean;
  retryCount: number;
}

// ─── Domain: Drift Detection Incidents ───────────────────────────────────────

export type DriftSeverity = "low" | "medium" | "high" | "critical";

export type DriftResolutionStatus =
  | "detected"
  | "under_investigation"
  | "pending_recompute"
  | "escalated"
  | "resolved"
  | "accepted_divergence";

export interface DriftIncident {
  id: string;                        // "drift_m4n7q"
  fieldId: string;                   // references CanonicalField.id
  fieldName: string;                 // denormalized for display
  canonicalSourceId: string;
  divergentConsumerId: string;       // which consumer has stale / wrong value
  severity: DriftSeverity;
  resolutionStatus: DriftResolutionStatus;
  /** The authoritative value from canonical source */
  expectedValue: string;
  /** The value found in the divergent consumer */
  actualValue: string;
  /** Gap between expected and actual (display label) */
  driftDelta: string;
  detectedAt: string;
  resolvedAt: string | null;
  /** How long the drift went undetected in minutes */
  silentDriftMinutes: number;
  assignedTo: string | null;
  /** Root cause after investigation */
  rootCause?: string;
  /** Whether this drift triggered a downstream silent failure */
  causedSilentFailure: boolean;
}

// ─── Domain: Integration Health / Risk Assessment ────────────────────────────

export type IntegrationRiskLevel = "low" | "medium" | "high" | "critical";

export type FailureVisibilityGap =
  | "fully_observable"
  | "partial_observability"
  | "blind_spot"
  | "no_alerting";

export interface IntegrationPath {
  id: string;                        // "path_node_fb"
  label: string;                     // "Node → Firebase"
  sourceSurfaceId: string;
  targetSurfaceId: string;
  riskLevel: IntegrationRiskLevel;
  /** 0-100; higher = more likely to break silently */
  syncFragilityScore: number;
  failureVisibilityGap: FailureVisibilityGap;
  /** Percentage of failed syncs that produced no alert in last 30 days */
  silentFailureRatePct: number;
  /** Average lag between source write and target acknowledgment (seconds) */
  avgSyncLagSeconds: number;
  /** Peak lag observed in last 30 days (seconds) */
  peakSyncLagSeconds: number;
  /** Number of failed webhooks in last 24 hours */
  failedWebhooks24h: number;
  /** Number of sync events in last 24 hours */
  totalSyncEvents24h: number;
  /** Whether retry / dead-letter queue is configured */
  hasDeadLetterQueue: boolean;
  /** Whether idempotency is enforced on both sides */
  idempotencyEnforced: boolean;
  hardeningRecommendation: string;
}

// ─── Domain: Webhook & Job Monitor ───────────────────────────────────────────

export type WebhookStatus =
  | "active"
  | "degraded"
  | "failing"
  | "disabled"
  | "rate_limited";

export interface WebhookEndpoint {
  id: string;                        // "wh_hubspot_deal"
  name: string;                      // "HubSpot Deal Stage Change"
  sourceSurfaceId: string;
  targetSurfaceId: string;
  status: WebhookStatus;
  url: string;                       // partial path only, no real domain
  /** Events per hour (rolling 1hr window) */
  eventsPerHour: number;
  /** Success rate over last 24h, percentage */
  successRate24h: number;
  /** Number of events in dead letter queue */
  deadLetterQueueDepth: number;
  lastTriggeredAt: string;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  avgLatencyMs: number;
  /** p95 latency in ms */
  p95LatencyMs: number;
  retryPolicy: "none" | "linear" | "exponential";
  maxRetries: number;
}

export type ScheduledJobStatus =
  | "running"
  | "succeeded"
  | "failed"
  | "missed"
  | "disabled"
  | "overdue";

export interface ScheduledJob {
  id: string;                        // "job_fs_recompute"
  name: string;                      // "Firestore Visibility Recompute"
  targetSurfaceId: string;
  status: ScheduledJobStatus;
  cronExpression: string;            // "0 */6 * * *"
  /** Human-readable schedule */
  scheduleLabel: string;             // "Every 6 hours"
  lastRunAt: string | null;
  nextRunAt: string;
  lastRunDurationMs: number | null;
  avgRunDurationMs: number;
  lastRunRecordsProcessed: number | null;
  /** How many consecutive failures before alerting */
  failureThreshold: number;
  consecutiveFailures: number;
  statusNote?: string;
}

// ─── Domain: Dashboard KPI Stats ─────────────────────────────────────────────

export interface DashboardStats {
  /** Total sync events in last 24 hours */
  totalSyncEvents24h: number;
  syncEventsChange: number;          // % change vs prior 24h
  /** Average sync lag across all active integration paths (seconds) */
  avgSyncLagSeconds: number;
  syncLagChange: number;             // % change (negative = improvement)
  /** Drift events detected in last 24 hours */
  driftEventsDetected: number;
  driftEventsChange: number;
  /** Failed webhooks in last 24 hours */
  failedWebhooks24h: number;
  failedWebhooksChange: number;
  /** Number of stale fields (no canonical write in >15 min) */
  staleFields: number;
  staleFieldsChange: number;
  /** Silent failure rate across all integration paths (%) */
  silentFailureRatePct: number;
  silentFailureRateChange: number;
  /** Visibility recompute time - how long the Firestore recompute job takes (ms) */
  visibilityRecomputeMs: number;
  visibilityRecomputeChange: number;
}

// ─── Chart Data Shapes ────────────────────────────────────────────────────────

export interface SyncHealthDataPoint {
  /** "Mar", "Apr", etc. */
  month: string;
  totalSyncs: number;
  failedSyncs: number;
  driftEvents: number;
  avgLagSeconds: number;
}

export interface SyncEventsByPathDataPoint {
  path: string;                      // "Node → Firebase"
  successCount: number;
  failedCount: number;
  avgLagSeconds: number;
}

export interface DriftBySurfaceDataPoint {
  surface: string;
  driftCount: number;
  resolvedCount: number;
  openCount: number;
}

export interface WebhookLatencyDataPoint {
  hour: string;                      // "06:00", "07:00"
  avgMs: number;
  p95Ms: number;
  failureCount: number;
}
