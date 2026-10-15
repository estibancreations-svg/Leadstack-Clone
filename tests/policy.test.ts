import { describe, expect, it } from "vitest";
import { authorize } from "../src/core/policy.js";
import type { ActorContext, ToolDefinition } from "../src/core/types.js";

const baseContext: ActorContext = {
  actorId: "actor-1",
  agencyId: "agency-1",
  workspaceId: "workspace-1",
  roles: ["admin"],
  assuranceLevel: "aal2",
  source: "human",
  requestId: "request-1",
};

const sendMessage: ToolDefinition = {
  name: "leadstack_send_message",
  description: "Send a message",
  permission: "conversations.write",
  risk: "external",
  category: "conversations",
};

describe("Leadstack authorization policy", () => {
  it("allows scoped admins with AAL2 to perform external writes", () => {
    expect(authorize(baseContext, sendMessage).allowed).toBe(true);
  });

  it("blocks external writes without AAL2", () => {
    expect(authorize({ ...baseContext, assuranceLevel: "aal1" }, sendMessage).allowed).toBe(false);
  });

  it("blocks agents without explicit delegated permission", () => {
    expect(authorize({ ...baseContext, source: "agent", delegatedPermissions: [] }, sendMessage).allowed).toBe(false);
  });

  it("allows an agent only when permission is explicitly delegated", () => {
    expect(
      authorize(
        {
          ...baseContext,
          source: "agent",
          delegatedPermissions: ["conversations.write"],
        },
        sendMessage,
      ).allowed,
    ).toBe(true);
  });
});
