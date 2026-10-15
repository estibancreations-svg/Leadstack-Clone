import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  Company,
  Contact,
  ContactSearch,
  CrmPort,
  Deal,
  Task,
} from "../ports/crm.js";

export interface StandaloneCrmAdapterConfig {
  supabaseUrl: string;
  publishableKey: string;
  /**
   * The signed-in user's Supabase access-token JWT.
   *
   * The adapter intentionally accepts no service-role key. Database RLS must
   * continue to make the final authorization decision.
   */
  accessToken: () => Promise<string>;
}

export class StandaloneCrmAdapterError extends Error {
  constructor(
    readonly operation: string,
    readonly code: string | undefined,
    message: string,
  ) {
    super(`${operation}: ${message}`);
    this.name = "StandaloneCrmAdapterError";
  }
}

interface ContactRow {
  id: string;
  workspace_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: Contact["status"];
  tags: string[] | null;
}

interface CompanyRow {
  id: string;
  workspace_id: string;
  name: string;
  domain: string | null;
  phone: string | null;
}

interface DealRow {
  id: string;
  workspace_id: string;
  pipeline_id: string;
  stage_id: string;
  title: string;
  amount: number | string;
  status: Deal["status"];
}

interface TaskRow {
  id: string;
  workspace_id: string;
  title: string;
  status: Task["status"];
  due_at: string | null;
}

export function createStandaloneCrmClient(
  config: StandaloneCrmAdapterConfig,
): SupabaseClient {
  if (!config.supabaseUrl || !config.publishableKey) {
    throw new Error("Standalone CRM Supabase URL and publishable key are required.");
  }

  return createClient(config.supabaseUrl, config.publishableKey, {
    accessToken: config.accessToken,
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export class StandaloneCrmAdapter implements CrmPort {
  private readonly client: SupabaseClient;

  constructor(config: StandaloneCrmAdapterConfig) {
    this.client = createStandaloneCrmClient(config);
  }

  async searchContacts(workspaceId: string, input: ContactSearch): Promise<Contact[]> {
    assertWorkspaceId(workspaceId);

    let query = this.client
      .from("contacts")
      .select("id,workspace_id,first_name,last_name,email,phone,status,tags")
      .eq("workspace_id", workspaceId)
      .is("archived_at", null)
      .order("created_at", { ascending: false })
      .limit(clampLimit(input.limit));

    if (input.status) {
      query = query.eq("status", input.status);
    }

    if (input.tags?.length) {
      query = query.contains("tags", input.tags);
    }

    if (input.query?.trim()) {
      const needle = sanitizeLikeNeedle(input.query);
      query = query.or(
        [
          `first_name.ilike.%${needle}%`,
          `last_name.ilike.%${needle}%`,
          `email.ilike.%${needle}%`,
          `phone.ilike.%${needle}%`,
        ].join(","),
      );
    }

    const { data, error } = await query;
    if (error) throwAdapterError("searchContacts", error);

    return ((data ?? []) as ContactRow[]).map(mapContact);
  }

  async getContact(workspaceId: string, contactId: string): Promise<Contact | null> {
    assertWorkspaceId(workspaceId);

    const { data, error } = await this.client
      .from("contacts")
      .select("id,workspace_id,first_name,last_name,email,phone,status,tags")
      .eq("workspace_id", workspaceId)
      .eq("id", contactId)
      .is("archived_at", null)
      .maybeSingle();

    if (error) throwAdapterError("getContact", error);
    return data ? mapContact(data as ContactRow) : null;
  }

  async createContact(
    workspaceId: string,
    input: Omit<Contact, "id" | "workspaceId">,
  ): Promise<Contact> {
    assertWorkspaceId(workspaceId);

    const { data, error } = await this.client
      .from("contacts")
      .insert({
        workspace_id: workspaceId,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email ?? null,
        phone: input.phone ?? null,
        status: input.status,
        tags: input.tags,
      })
      .select("id,workspace_id,first_name,last_name,email,phone,status,tags")
      .single();

    if (error) throwAdapterError("createContact", error);
    return mapContact(data as ContactRow);
  }

  async updateContact(
    workspaceId: string,
    contactId: string,
    patch: Partial<Omit<Contact, "id" | "workspaceId">>,
  ): Promise<Contact> {
    assertWorkspaceId(workspaceId);

    const update: Record<string, unknown> = {};
    if (patch.firstName !== undefined) update.first_name = patch.firstName;
    if (patch.lastName !== undefined) update.last_name = patch.lastName;
    if (patch.email !== undefined) update.email = patch.email;
    if (patch.phone !== undefined) update.phone = patch.phone;
    if (patch.status !== undefined) update.status = patch.status;
    if (patch.tags !== undefined) update.tags = patch.tags;

    if (Object.keys(update).length === 0) {
      const existing = await this.getContact(workspaceId, contactId);
      if (!existing) {
        throw new StandaloneCrmAdapterError(
          "updateContact",
          "not_found",
          "Contact does not exist in the scoped workspace.",
        );
      }
      return existing;
    }

    const { data, error } = await this.client
      .from("contacts")
      .update(update)
      .eq("workspace_id", workspaceId)
      .eq("id", contactId)
      .is("archived_at", null)
      .select("id,workspace_id,first_name,last_name,email,phone,status,tags")
      .single();

    if (error) throwAdapterError("updateContact", error);
    return mapContact(data as ContactRow);
  }

  async listCompanies(workspaceId: string): Promise<Company[]> {
    assertWorkspaceId(workspaceId);

    const { data, error } = await this.client
      .from("companies")
      .select("id,workspace_id,name,domain,phone")
      .eq("workspace_id", workspaceId)
      .is("archived_at", null)
      .order("name");

    if (error) throwAdapterError("listCompanies", error);

    return ((data ?? []) as CompanyRow[]).map((row) => ({
      id: row.id,
      workspaceId: row.workspace_id,
      name: row.name,
      ...(row.domain ? { domain: row.domain } : {}),
      ...(row.phone ? { phone: row.phone } : {}),
    }));
  }

  async listDeals(workspaceId: string): Promise<Deal[]> {
    assertWorkspaceId(workspaceId);

    const { data, error } = await this.client
      .from("deals")
      .select("id,workspace_id,pipeline_id,stage_id,title,amount,status")
      .eq("workspace_id", workspaceId)
      .is("archived_at", null)
      .order("created_at", { ascending: false });

    if (error) throwAdapterError("listDeals", error);

    return ((data ?? []) as DealRow[]).map((row) => ({
      id: row.id,
      workspaceId: row.workspace_id,
      pipelineId: row.pipeline_id,
      stageId: row.stage_id,
      title: row.title,
      amount: Number(row.amount),
      status: row.status,
    }));
  }

  async createTask(
    workspaceId: string,
    input: Omit<Task, "id" | "workspaceId">,
  ): Promise<Task> {
    assertWorkspaceId(workspaceId);

    const { data, error } = await this.client
      .from("tasks")
      .insert({
        workspace_id: workspaceId,
        title: input.title,
        status: input.status,
        due_at: input.dueAt ?? null,
      })
      .select("id,workspace_id,title,status,due_at")
      .single();

    if (error) throwAdapterError("createTask", error);

    const row = data as TaskRow;
    return {
      id: row.id,
      workspaceId: row.workspace_id,
      title: row.title,
      status: row.status,
      ...(row.due_at ? { dueAt: row.due_at } : {}),
    };
  }
}

function mapContact(row: ContactRow): Contact {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    firstName: row.first_name,
    lastName: row.last_name,
    status: row.status,
    tags: row.tags ?? [],
    ...(row.email ? { email: row.email } : {}),
    ...(row.phone ? { phone: row.phone } : {}),
  };
}

function clampLimit(limit: number | undefined): number {
  if (limit === undefined) return 50;
  return Math.max(1, Math.min(Math.trunc(limit), 200));
}

function sanitizeLikeNeedle(value: string): string {
  return value.trim().replace(/[%_(),]/g, "");
}

function assertWorkspaceId(workspaceId: string): void {
  if (!workspaceId.trim()) {
    throw new Error("workspaceId is required.");
  }
}

function throwAdapterError(
  operation: string,
  error: { code?: string; message: string },
): never {
  throw new StandaloneCrmAdapterError(operation, error.code, error.message);
}
