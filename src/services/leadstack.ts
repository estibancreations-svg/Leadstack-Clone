import type { AuditSink } from "../core/audit.js";
import { authorize } from "../core/policy.js";
import type { ActorContext, ToolDefinition } from "../core/types.js";

export class AuthorizationError extends Error {}

export class LeadstackExecutionService {
  constructor(private readonly audit: AuditSink) {}

  async execute<T>(
    context: ActorContext,
    tool: ToolDefinition,
    operation: () => Promise<T>,
  ): Promise<T> {
    const decision = authorize(context, tool);

    await this.audit.append({
      requestId: context.requestId,
      actorId: context.actorId,
      agencyId: context.agencyId,
      workspaceId: context.workspaceId,
      source: context.source,
      tool: tool.name,
      permission: tool.permission,
      risk: tool.risk,
      outcome: decision.allowed ? "allowed" : "denied",
      detail: decision.reason,
      occurredAt: new Date().toISOString(),
    });

    if (!decision.allowed) {
      throw new AuthorizationError(decision.reason);
    }

    try {
      const result = await operation();
      await this.audit.append({
        requestId: context.requestId,
        actorId: context.actorId,
        agencyId: context.agencyId,
        workspaceId: context.workspaceId,
        source: context.source,
        tool: tool.name,
        permission: tool.permission,
        risk: tool.risk,
        outcome: "succeeded",
        occurredAt: new Date().toISOString(),
      });
      return result;
    } catch (error) {
      await this.audit.append({
        requestId: context.requestId,
        actorId: context.actorId,
        agencyId: context.agencyId,
        workspaceId: context.workspaceId,
        source: context.source,
        tool: tool.name,
        permission: tool.permission,
        risk: tool.risk,
        outcome: "failed",
        detail: error instanceof Error ? error.message : "Unknown execution failure",
        occurredAt: new Date().toISOString(),
      });
      throw error;
    }
  }
}
