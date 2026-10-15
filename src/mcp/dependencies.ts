import type { AuditSink } from "../core/audit.js";
import type { ActorContext } from "../core/types.js";
import type { CrmPort } from "../ports/crm.js";

export interface LeadstackMcpDependencies {
  /**
   * Resolve the authenticated actor for the current MCP call/connection.
   * Implementations must not use one shared identity for all users.
   */
  resolveContext(): Promise<ActorContext>;

  /**
   * Resolve the owned CRM adapter only after Leadstack authorization succeeds.
   */
  resolveCrm(context: ActorContext): Promise<CrmPort>;

  audit: AuditSink;
}
