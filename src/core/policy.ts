import type {
  ActorContext,
  AuthorizationDecision,
  Permission,
  RiskLevel,
  ToolDefinition,
} from "./types.js";

const READ_ONLY_ROLES = new Set(["viewer"]);
const WRITE_ROLES = new Set(["owner", "backup", "admin", "assistant", "member"]);
const PRIVILEGED_ROLES = new Set(["owner", "backup", "admin"]);

function hasAnyRole(context: ActorContext, roles: Set<string>): boolean {
  return context.roles.some((role) => roles.has(role));
}

function isReadPermission(permission: Permission): boolean {
  return permission.endsWith(".read");
}

export function authorize(
  context: ActorContext,
  tool: ToolDefinition,
): AuthorizationDecision {
  if (!context.actorId || !context.agencyId || !context.workspaceId || !context.requestId) {
    return { allowed: false, reason: "Missing mandatory actor or workspace scope." };
  }

  if (context.source === "agent") {
    const delegated = context.delegatedPermissions ?? [];
    if (!delegated.includes(tool.permission)) {
      return {
        allowed: false,
        reason: `Agent has not been delegated ${tool.permission}.`,
      };
    }
  }

  if (isReadPermission(tool.permission)) {
    if (hasAnyRole(context, READ_ONLY_ROLES) || hasAnyRole(context, WRITE_ROLES)) {
      return { allowed: true, reason: "Read permission granted for scoped workspace." };
    }
    return { allowed: false, reason: "No readable workspace role." };
  }

  if (!hasAnyRole(context, WRITE_ROLES)) {
    return { allowed: false, reason: "Write-capable workspace role required." };
  }

  if (requiresAal2(tool.risk) && context.assuranceLevel !== "aal2") {
    return { allowed: false, reason: "AAL2 is required for external or destructive actions." };
  }

  if (tool.risk === "destructive" && !hasAnyRole(context, PRIVILEGED_ROLES)) {
    return { allowed: false, reason: "Privileged role required for destructive actions." };
  }

  return { allowed: true, reason: "Scoped action authorized." };
}

function requiresAal2(risk: RiskLevel): boolean {
  return risk === "external" || risk === "destructive";
}
