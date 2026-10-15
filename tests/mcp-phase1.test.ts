import { describe, expect, it } from "vitest";
import { MemoryAuditSink } from "../src/core/audit.js";
import type { ActorContext } from "../src/core/types.js";
import { Phase1Operations } from "../src/mcp/phase1.js";
import type {
  Company,
  Contact,
  ContactSearch,
  CrmPort,
  Deal,
  Task,
} from "../src/ports/crm.js";

class FakeCrm implements CrmPort {
  lastWorkspaceId: string | null = null;

  async searchContacts(workspaceId: string, _input: ContactSearch): Promise<Contact[]> {
    this.lastWorkspaceId = workspaceId;
    return [{
      id: "contact-1",
      workspaceId,
      firstName: "Test",
      lastName: "Contact",
      status: "lead",
      tags: [],
    }];
  }

  async getContact(): Promise<Contact | null> { return null; }

  async createContact(
    workspaceId: string,
    input: Omit<Contact, "id" | "workspaceId">,
  ): Promise<Contact> {
    return { id: "contact-2", workspaceId, ...input };
  }

  async updateContact(
    workspaceId: string,
    contactId: string,
    patch: Partial<Omit<Contact, "id" | "workspaceId">>,
  ): Promise<Contact> {
    return {
      id: contactId,
      workspaceId,
      firstName: patch.firstName ?? "Test",
      lastName: patch.lastName ?? "Contact",
      status: patch.status ?? "lead",
      tags: patch.tags ?? [],
      ...(patch.email !== undefined ? { email: patch.email } : {}),
      ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
    };
  }

  async listCompanies(): Promise<Company[]> { return []; }
  async listDeals(): Promise<Deal[]> { return []; }

  async createTask(
    workspaceId: string,
    input: Omit<Task, "id" | "workspaceId">,
  ): Promise<Task> {
    return { id: "task-1", workspaceId, ...input };
  }
}

const human: ActorContext = {
  actorId: "actor-1",
  agencyId: "agency-1",
  workspaceId: "workspace-allowed",
  roles: ["admin"],
  assuranceLevel: "aal2",
  source: "human",
  requestId: "request-1",
};

describe("Phase 1 MCP operations", () => {
  it("passes only the authenticated workspace to the CRM adapter", async () => {
    const crm = new FakeCrm();
    const operations = new Phase1Operations({
      audit: new MemoryAuditSink(),
      resolveContext: async () => human,
      resolveCrm: async () => crm,
    });

    const contacts = await operations.searchContacts({ query: "Test" });

    expect(contacts).toHaveLength(1);
    expect(crm.lastWorkspaceId).toBe("workspace-allowed");
  });

  it("denies an undelegated agent before resolving the CRM adapter", async () => {
    let adapterResolved = false;

    const operations = new Phase1Operations({
      audit: new MemoryAuditSink(),
      resolveContext: async () => ({
        ...human,
        source: "agent",
        delegatedPermissions: [],
      }),
      resolveCrm: async () => {
        adapterResolved = true;
        return new FakeCrm();
      },
    });

    await expect(operations.searchContacts({})).rejects.toThrow(/not been delegated/i);
    expect(adapterResolved).toBe(false);
  });
});
