import type { ToolDefinition } from "../core/types.js";

export const TOOL_CATALOG: readonly ToolDefinition[] = [
  { name: "leadstack_search_contacts", description: "Search contacts in the current workspace.", permission: "contacts.read", risk: "read", category: "contacts" },
  { name: "leadstack_get_contact", description: "Get one contact in the current workspace.", permission: "contacts.read", risk: "read", category: "contacts" },
  { name: "leadstack_create_contact", description: "Create a contact in the current workspace.", permission: "contacts.write", risk: "write", category: "contacts" },
  { name: "leadstack_update_contact", description: "Update a contact in the current workspace.", permission: "contacts.write", risk: "write", category: "contacts" },

  { name: "leadstack_list_companies", description: "List companies in the current workspace.", permission: "companies.read", risk: "read", category: "companies" },
  { name: "leadstack_list_deals", description: "List deals in the current workspace.", permission: "deals.read", risk: "read", category: "deals" },
  { name: "leadstack_create_task", description: "Create a CRM task in the current workspace.", permission: "tasks.write", risk: "write", category: "tasks" },

  { name: "leadstack_list_calendar_events", description: "List workspace calendar events.", permission: "calendar.read", risk: "read", category: "calendar" },
  { name: "leadstack_create_appointment", description: "Create an appointment through an owned calendar provider.", permission: "calendar.write", risk: "external", category: "calendar" },

  { name: "leadstack_list_conversations", description: "Read workspace conversations.", permission: "conversations.read", risk: "read", category: "conversations" },
  { name: "leadstack_send_message", description: "Send a message using a configured owned provider.", permission: "conversations.write", risk: "external", category: "conversations" },

  { name: "leadstack_list_workflows", description: "List native Leadstack workflows.", permission: "workflows.read", risk: "read", category: "workflows" },
  { name: "leadstack_run_workflow", description: "Run a native Leadstack workflow.", permission: "workflows.write", risk: "external", category: "workflows" },

  { name: "leadstack_list_social_posts", description: "List planned social posts.", permission: "social.read", risk: "read", category: "social" },
  { name: "leadstack_publish_social_post", description: "Publish through configured social providers.", permission: "social.write", risk: "external", category: "social" },

  { name: "leadstack_list_products", description: "List workspace products.", permission: "products.read", risk: "read", category: "products" },
  { name: "leadstack_list_invoices", description: "List workspace invoices.", permission: "billing.read", risk: "read", category: "billing" },
  { name: "leadstack_send_invoice", description: "Send an invoice through the configured billing provider.", permission: "billing.write", risk: "external", category: "billing" },

  { name: "leadstack_list_forms", description: "List native forms and surveys.", permission: "forms.read", risk: "read", category: "forms" },
  { name: "leadstack_read_audit", description: "Read scoped audit history.", permission: "audit.read", risk: "read", category: "audit" },
] as const;

export function getTool(name: string): ToolDefinition | undefined {
  return TOOL_CATALOG.find((tool) => tool.name === name);
}
