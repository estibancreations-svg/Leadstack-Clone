# Operating Policy — T.H.E.L.M.A. + Leadstack (DRAFT — needs Owner approval)

Status: APPROVED and IN EFFECT 2026-10-17 (Owner: Sire). Approved in chat 2026-10-17 — 'Approved. Go ahead and fix and update it all.' + re-ask for CRM PR #9 merged. Mirror of standalone-crm canonical policy. Intended to reconcile CRM handbook rule ("external helpers must submit requests through T.H.E.L.M.A.") with Leadstack rule ("delegated direct CRM writes permitted").

## One rule

Default path for ALL external helpers / agents: submit a signed request through `thelma-gateway`. It waits for Owner approval (two-step on). Nothing is deleted from that record.

Exception — Leadstack delegated direct writes — allowed ONLY when ALL of these hold:
1. Caller has an explicit delegated permission for that exact tool/permission (Leadstack `authorize()` checks delegation before adapter resolution; undelegated agent denied).
2. Workspace scope comes from authenticated ActorContext, never from model input. Every query carries workspace_id + RLS underneath.
3. Caller JWT (publishable key + caller token) is used. No service-role bypass. Supabase RLS is final authority.
4. AAL2 required for external or destructive actions (Leadstack policy.ts: external/destructive → aal2; destructive → privileged role owner/backup/admin).
5. Every agent-capable write emits an auditable record (Leadstack audit sink; today MemoryAuditSink only — persistent sink required before deployed MCP, see MCP plan).
6. Owner can revoke delegation at any time.

## Hard boundary — even Leadstack cannot bypass

These externally visible / irreversible actions ALWAYS go through the T.H.E.L.M.A. approval queue, never direct:
- Sending a message/email/SMS, publishing a post, connecting an app / OAuth, charging a card, putting a site live, deleting data.

Leadstack Phase 1 tools (search/get/create/update contact, list companies/deals, create task) are INTERNAL CRM CRUD within one workspace. They do NOT include send/publish/charge/connect/go-live. If a future Leadstack tool would do one of those, it must file a T.H.E.L.M.A. request instead of executing directly.

## What this resolves

- CRM docs saying "helpers never touch tables" → clarified: helpers never touch tables DIRECTLY; Leadstack touches them only via RLS-preserving adapter + delegation + audit, for internal CRUD.
- Leadstack docs saying "delegated direct writes" → clarified: delegated, scoped, AAL2-gated, audited, internal-only. No external effects without Owner approval.

## Evidence required before "policy in effect"

- [x] Owner approves this file — approved 2026-10-17 in chat (CRM PR #9 merged; this mirror follows)
- [ ] Policy file committed to standalone-crm docs/ AND referenced from Leadstack docs/
- [ ] Negative tests: undelegated agent denied, cross-workspace denied, AAL1 denied for external/destructive, audit record present
- [ ] Persistent audit sink implemented (not memory-only) before any deployed MCP


> Mirror of standalone-crm docs/OPERATING_POLICY.md. Canonical copy lives in standalone-crm; keep them in sync.
