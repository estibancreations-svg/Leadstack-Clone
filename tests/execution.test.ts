import { describe, expect, it } from "vitest";
import { MemoryAuditSink } from "../src/core/audit.js";
import type { ActorContext, ToolDefinition } from "../src/core/types.js";
import { LeadstackExecutionService } from "../src/services/leadstack.js";

const tool: ToolDefinition = {
  name: "leadstack_search_contacts",
  description: "Search contacts",
  permission: "contacts.read",
  risk: "read",
  category: "contacts",
};

const context: ActorContext = {
  actorId: "actor-1",
  agencyId: "agency-1",
  workspaceId: "workspace-1",
  roles: ["viewer"],
  assuranceLevel: "aal1",
  source: "human",
  requestId: "request-1",
};

describe("Leadstack execution service", () => {
  it("writes authorization and success audit events", async () => {
    const audit = new MemoryAuditSink();
    const service = new LeadstackExecutionService(audit);

    const result = await service.execute(context, tool, async () => ["contact-1"]);

    expect(result).toEqual(["contact-1"]);
    expect(audit.events.map((event) => event.outcome)).toEqual(["allowed", "succeeded"]);
  });
});
