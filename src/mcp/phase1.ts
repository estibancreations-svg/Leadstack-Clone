import type { ActorContext } from "../core/types.js";
import { LeadstackExecutionService } from "../services/leadstack.js";
import { getTool } from "../tools/catalog.js";
import type { Contact, ContactSearch, CrmPort, Task } from "../ports/crm.js";
import type { LeadstackMcpDependencies } from "./dependencies.js";

export interface CreateContactInput {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: Contact["status"];
  tags?: string[];
}

export interface UpdateContactInput {
  contactId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: Contact["status"];
  tags?: string[];
}

export interface CreateTaskInput {
  title: string;
  status?: Task["status"];
  dueAt?: string;
}

export class Phase1Operations {
  private readonly execution: LeadstackExecutionService;

  constructor(private readonly deps: LeadstackMcpDependencies) {
    this.execution = new LeadstackExecutionService(deps.audit);
  }

  async searchContacts(input: ContactSearch): Promise<Contact[]> {
    return this.run("leadstack_search_contacts", (crm, context) =>
      crm.searchContacts(context.workspaceId, input),
    );
  }

  async getContact(contactId: string): Promise<Contact | null> {
    return this.run("leadstack_get_contact", (crm, context) =>
      crm.getContact(context.workspaceId, contactId),
    );
  }

  async createContact(input: CreateContactInput): Promise<Contact> {
    return this.run("leadstack_create_contact", (crm, context) =>
      crm.createContact(context.workspaceId, {
        firstName: input.firstName,
        lastName: input.lastName ?? "",
        status: input.status ?? "lead",
        tags: input.tags ?? [],
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.phone !== undefined ? { phone: input.phone } : {}),
      }),
    );
  }

  async updateContact(input: UpdateContactInput): Promise<Contact> {
    return this.run("leadstack_update_contact", (crm, context) =>
      crm.updateContact(context.workspaceId, input.contactId, {
        ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
        ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
        ...(input.email !== undefined ? { email: input.email } : {}),
        ...(input.phone !== undefined ? { phone: input.phone } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.tags !== undefined ? { tags: input.tags } : {}),
      }),
    );
  }

  async listCompanies() {
    return this.run("leadstack_list_companies", (crm, context) =>
      crm.listCompanies(context.workspaceId),
    );
  }

  async listDeals() {
    return this.run("leadstack_list_deals", (crm, context) =>
      crm.listDeals(context.workspaceId),
    );
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    return this.run("leadstack_create_task", (crm, context) =>
      crm.createTask(context.workspaceId, {
        title: input.title,
        status: input.status ?? "open",
        ...(input.dueAt !== undefined ? { dueAt: input.dueAt } : {}),
      }),
    );
  }

  private async run<T>(
    toolName: string,
    operation: (crm: CrmPort, context: ActorContext) => Promise<T>,
  ): Promise<T> {
    const context = await this.deps.resolveContext();
    const tool = getTool(toolName);

    if (!tool) {
      throw new Error(`Leadstack tool definition is missing: ${toolName}`);
    }

    return this.execution.execute(context, tool, async () => {
      const crm = await this.deps.resolveCrm(context);
      return operation(crm, context);
    });
  }
}
