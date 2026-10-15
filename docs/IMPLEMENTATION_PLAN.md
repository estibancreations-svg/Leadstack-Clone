# Leadstack Implementation Plan

## Phase 0 — Foundation

Status: in progress

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
- [ ] Green GitHub Quality Gate
- [ ] MCP v2 transport/server binding

## Phase 1 — Bind owned CRM core

Target: the existing standalone CRM capabilities.

- [ ] Define standalone CRM adapter contract
- [ ] Map workspace/agency identity without duplicating authority
- [ ] Contacts: search/get/create/update
- [ ] Companies
- [ ] Deals/pipelines
- [ ] Tasks
- [ ] Notes
- [ ] Audit read
- [ ] Cross-workspace denial tests
- [ ] Agent delegated-permission tests
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
