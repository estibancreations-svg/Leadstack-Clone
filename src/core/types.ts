export type AssuranceLevel = "aal1" | "aal2";
export type ActorSource = "human" | "agent" | "system";
export type Role = "owner" | "backup" | "admin" | "assistant" | "member" | "viewer";

export type Permission =
  | "contacts.read" | "contacts.write"
  | "companies.read" | "companies.write"
  | "deals.read" | "deals.write"
  | "tasks.read" | "tasks.write"
  | "notes.read" | "notes.write"
  | "calendar.read" | "calendar.write"
  | "conversations.read" | "conversations.write"
  | "workflows.read" | "workflows.write"
  | "social.read" | "social.write"
  | "media.read" | "media.write"
  | "products.read" | "products.write"
  | "billing.read" | "billing.write"
  | "forms.read" | "forms.write"
  | "audit.read";

export type RiskLevel = "read" | "write" | "external" | "destructive";

export interface ActorContext {
  actorId: string;
  agencyId: string;
  workspaceId: string;
  roles: Role[];
  assuranceLevel: AssuranceLevel;
  source: ActorSource;
  delegatedPermissions?: Permission[];
  requestId: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  permission: Permission;
  risk: RiskLevel;
  category: string;
}

export interface AuthorizationDecision {
  allowed: boolean;
  reason: string;
}

export interface AuditEvent {
  requestId: string;
  actorId: string;
  agencyId: string;
  workspaceId: string;
  source: ActorSource;
  tool: string;
  permission: Permission;
  risk: RiskLevel;
  outcome: "allowed" | "denied" | "succeeded" | "failed";
  detail?: string;
  occurredAt: string;
}
