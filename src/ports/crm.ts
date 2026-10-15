export interface Contact {
  id: string;
  workspaceId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: "lead" | "qualified" | "customer" | "inactive";
  tags: string[];
}

export interface Company {
  id: string;
  workspaceId: string;
  name: string;
  domain?: string;
  phone?: string;
}

export interface Deal {
  id: string;
  workspaceId: string;
  pipelineId: string;
  stageId: string;
  title: string;
  amount: number;
  status: "open" | "won" | "lost";
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  status: "open" | "in_progress" | "done" | "cancelled";
  dueAt?: string;
}

export interface ContactSearch {
  query?: string;
  tags?: string[];
  status?: Contact["status"];
  limit?: number;
}

export interface CrmPort {
  searchContacts(workspaceId: string, input: ContactSearch): Promise<Contact[]>;
  getContact(workspaceId: string, contactId: string): Promise<Contact | null>;
  createContact(workspaceId: string, input: Omit<Contact, "id" | "workspaceId">): Promise<Contact>;
  updateContact(
    workspaceId: string,
    contactId: string,
    patch: Partial<Omit<Contact, "id" | "workspaceId">>,
  ): Promise<Contact>;

  listCompanies(workspaceId: string): Promise<Company[]>;
  listDeals(workspaceId: string): Promise<Deal[]>;
  createTask(workspaceId: string, input: Omit<Task, "id" | "workspaceId">): Promise<Task>;
}
