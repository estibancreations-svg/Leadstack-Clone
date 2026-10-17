# Leadstack Implementation Plan

## Phase 0 — Foundation

Status: foundation complete, transport pending (corrected 2026-10-17)

- [x] Initialize repository
- [x] Establish no-third-party-CRM boundary
- [x] Strict TypeScript foundation
- [x] Provider-neutral CRM port
- [x] Native tool catalog
- [x] Actor/workspace authorization policy
- [x] Agent delegation checks
- [x] AAL2 external-action rule
- [x] Audit sink contract
- [x] Initial policy/execution tests
- [x] Green GitHub Quality Gate (passes on 9eaf00a; re-verify in Actions after any gate edit)
- [ ] MCP v2 transport/server binding

## Phase 1 — Bind owned CRM core

Target: the existing standalone CRM capabilities.

- [x] Define standalone CRM adapter contract
- [x] Map workspace/agency identity without duplicating authority
- [x] Contacts: search/get/create/update
- [x] Companies (list only — broader management remains below)
- [x] Deals/pipelines (list only — broader management remains below)
- [x] Tasks (create only — broader management remains below)
- [ ] Notes
- [ ] Audit read
- [x] Cross-workspace denial tests (`tests/policy.test.ts`, `tests/standalone-crm-adapter.test.ts`)
- [x] Agent delegated-permission tests (`tests/policy.test.ts`, `tests/mcp-phase1.test.ts` — undelegated agent denied before adapter resolution)
- [ ] Live non-destructive smoke test

## Phase 2 — Communications + calendar

- [ ] Conversation domain model
- [ ] Provider-neutral email port
- [ ] Provider-neutral SMS port
- [ ] Unified message timeline
- [ ] Calendar model
- [ ] Availability
- [ ] Appointment create/update/cancel
- [ ] AAL2 enforcement for externally visible actions
- [ ] Delivery/retry/idempotency records

## Phase 3 — Automation

- [ ] Workflow definitions
- [ ] Trigger registry
- [ ] Action registry
- [ ] Dry-run mode
- [ ] Approval-required actions
- [ ] Retry/dead-letter handling
- [ ] Agent workflow execution limits
- [ ] Forms and surveys
- [ ] Media library

## Phase 4 — Commerce + publishing

- [ ] Products
- [ ] Pricing
- [ ] Inventory
- [ ] Estimates
- [ ] Invoices
- [ ] Payment provider abstraction
- [ ] Social account abstraction
- [ ] Social scheduling/publishing

## Production gate

A phase is not considered complete because code exists. It requires:

- green typecheck
- green automated tests
- tenant-isolation evidence where applicable
- no secret exposure
- failure-path evidence
- exact tested commit SHA
- deployment/runtime evidence for deployed components

> Correction note (2026-10-17): Phase 1 items above marked done are the Phase 1 scope actually merged in PRs #1–3 (head 9eaf00a). Still unchecked: Notes, Audit read, Live non-destructive smoke test, broader company/deal/task management. MCP v2 transport/server binding stays unchecked — factory exists (`src/mcp/server.ts`), but no deployed transport endpoint, account connection, persistent audit, or live smoke-test evidence. Code exists ≠ phase complete (see Production gate). Operating policy: `docs/OPERATING_POLICY.md` (Owner-approved 2026-10-17).
