# Leadstack deployed MCP — plan (DRAFT, no deploy done)

## Current state (verified)

- Factory exists: src/mcp/server.ts createLeadstackMcpServer + Phase1Operations (7 tools).
- Tools: leadstack_search_contacts, get_contact, create_contact, update_contact, list_companies, list_deals, create_task.
- Auth model: ActorContext resolved per call/connection; authorize() before adapter resolution; workspace from context; RLS-preserving adapter (publishable key + caller JWT, no service-role).
- Audit: MemoryAuditSink only (in-memory, not persistent). NOT sufficient for production.
- No deployed transport endpoint, no account connection, no persistent audit, no live CRM smoke-test evidence.
- Quality Gate passes on 9eaf00a; gate uses npm install (needs npm ci once lockfile exists).

## Decisions before any deploy

1. Transport: Streamable HTTP (recommended for hosted MCP) vs stdio (local only) vs SSE (legacy). For a connected service, Streamable HTTP is the expected choice — confirm.
2. Hosting: where does the MCP server run? Options: Vercel (serverless), separate Node host, Supabase Edge Function (not ideal for MCP server). Confirm hosting + domain.
3. Authentication: how does a caller prove identity? Supabase JWT forwarded per request (matches adapter design). No shared global user token baked in. Confirm token flow + expiry + revocation.
4. Connection: which client(s) connect first? (e.g., Claude / Muse / internal tool). Confirm first client + scopes.
5. Persistent audit: where do audit events live? Options: Supabase table (append-only, RLS-protected, service-role write via Edge Function) vs external log store. Memory sink must be replaced before deploy. Confirm schema + retention.
6. Rate limits / abuse: per-workspace limits, per-tool limits, AAL2 enforcement for external/destructive (already in policy.ts).

## Pre-deploy gate (all must be true)

- [ ] Lockfile committed + Quality Gate switched to `npm ci` (fallback to npm install until lockfile exists)
- [ ] Persistent audit sink implemented + tested (append-only, cannot be edited/deleted by caller)
- [ ] Transport endpoint implemented + auth tested (unauthenticated denied, wrong-workspace denied, undelegated agent denied)
- [ ] Live non-destructive smoke test against TEST Supabase (never prod first): search/get contact, create + delete test contact in test workspace, list companies/deals, create test task — record exact SHA + timestamps + workspace
- [ ] Operating Policy approved (see OPERATING_POLICY.md) — external effects still require T.H.E.L.M.A. approval
- [ ] Deployment/runtime evidence recorded (URL, deployment ID, health check)

## Explicitly NOT in this phase

- Notes, broader company/deal/task management (update/delete companies/deals, task update/delete), communications/calendar, automation phases 2–4, social publishing, commerce. Those remain Phase 1 remainder / later phases per IMPLEMENTATION_PLAN.
- No GoHighLevel runtime/code integration (boundary stands).
