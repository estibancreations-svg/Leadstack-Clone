import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import type { LeadstackMcpDependencies } from "./dependencies.js";
import { Phase1Operations } from "./phase1.js";

const contactStatus = z.enum(["lead", "qualified", "customer", "inactive"]);
const taskStatus = z.enum(["open", "in_progress", "done", "cancelled"]);

export function createLeadstackMcpServer(
  deps: LeadstackMcpDependencies,
): McpServer {
  const server = new McpServer({
    name: "leadstack",
    version: "0.1.0",
  });

  const operations = new Phase1Operations(deps);

  server.registerTool(
    "leadstack_search_contacts",
    {
      description: "Search contacts in the authenticated Leadstack workspace.",
      inputSchema: z.object({
        query: z.string().max(200).optional(),
        tags: z.array(z.string().max(80)).max(50).optional(),
        status: contactStatus.optional(),
        limit: z.number().int().min(1).max(200).optional(),
      }),
      annotations: { readOnlyHint: true },
    },
    async (input) =>
      result(
        await operations.searchContacts({
          ...(input.query !== undefined ? { query: input.query } : {}),
          ...(input.tags !== undefined ? { tags: input.tags } : {}),
          ...(input.status !== undefined ? { status: input.status } : {}),
          ...(input.limit !== undefined ? { limit: input.limit } : {}),
        }),
      ),
  );

  server.registerTool(
    "leadstack_get_contact",
    {
      description: "Get one contact from the authenticated Leadstack workspace.",
      inputSchema: z.object({
        contactId: z.string().min(1).max(200),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ contactId }) => result(await operations.getContact(contactId)),
  );

  server.registerTool(
    "leadstack_create_contact",
    {
      description: "Create a contact in the authenticated Leadstack workspace.",
      inputSchema: z.object({
        firstName: z.string().trim().min(1).max(80),
        lastName: z.string().trim().max(80).optional(),
        email: z.string().email().max(254).optional(),
        phone: z.string().max(40).optional(),
        status: contactStatus.optional(),
        tags: z.array(z.string().max(80)).max(50).optional(),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (input) =>
      result(
        await operations.createContact({
          firstName: input.firstName,
          ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
          ...(input.email !== undefined ? { email: input.email } : {}),
          ...(input.phone !== undefined ? { phone: input.phone } : {}),
          ...(input.status !== undefined ? { status: input.status } : {}),
          ...(input.tags !== undefined ? { tags: input.tags } : {}),
        }),
      ),
  );

  server.registerTool(
    "leadstack_update_contact",
    {
      description: "Update a contact in the authenticated Leadstack workspace.",
      inputSchema: z.object({
        contactId: z.string().min(1).max(200),
        firstName: z.string().trim().min(1).max(80).optional(),
        lastName: z.string().trim().max(80).optional(),
        email: z.string().email().max(254).optional(),
        phone: z.string().max(40).optional(),
        status: contactStatus.optional(),
        tags: z.array(z.string().max(80)).max(50).optional(),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (input) =>
      result(
        await operations.updateContact({
          contactId: input.contactId,
          ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
          ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
          ...(input.email !== undefined ? { email: input.email } : {}),
          ...(input.phone !== undefined ? { phone: input.phone } : {}),
          ...(input.status !== undefined ? { status: input.status } : {}),
          ...(input.tags !== undefined ? { tags: input.tags } : {}),
        }),
      ),
  );

  server.registerTool(
    "leadstack_list_companies",
    {
      description: "List companies in the authenticated Leadstack workspace.",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true },
    },
    async () => result(await operations.listCompanies()),
  );

  server.registerTool(
    "leadstack_list_deals",
    {
      description: "List deals in the authenticated Leadstack workspace.",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true },
    },
    async () => result(await operations.listDeals()),
  );

  server.registerTool(
    "leadstack_create_task",
    {
      description: "Create a task in the authenticated Leadstack workspace.",
      inputSchema: z.object({
        title: z.string().trim().min(1).max(160),
        status: taskStatus.optional(),
        dueAt: z.string().datetime({ offset: true }).optional(),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (input) =>
      result(
        await operations.createTask({
          title: input.title,
          ...(input.status !== undefined ? { status: input.status } : {}),
          ...(input.dueAt !== undefined ? { dueAt: input.dueAt } : {}),
        }),
      ),
  );

  return server;
}

function result(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(value),
      },
    ],
  };
}
