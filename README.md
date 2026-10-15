# Leadstack

Leadstack is EstibanCreations' native CRM intelligence and automation layer.

## Non-negotiable boundary

**GoHighLevel is not a dependency, connector, fallback, migration target, or runtime provider for this repository.**

This project does not import, call, authenticate to, proxy, sync with, or otherwise depend on GoHighLevel. External CRM projects may be studied only as public feature references. Their source code is not incorporated here.

## Purpose

Leadstack provides an AI/MCP-ready control plane over EstibanCreations-owned CRM capabilities:

- Contacts and companies
- Pipelines, stages, deals, tasks, notes
- Conversations, email and SMS adapters
- Calendar and appointments
- Workflows and automations
- Social publishing
- Media
- Products and inventory
- Payments, invoices and estimates
- Surveys and forms
- Audit events and permission-aware agent actions

The protected CRM system of record remains the EstibanCreations standalone CRM / Supabase architecture. Leadstack is designed to operate through owned interfaces and scoped adapters rather than bypassing tenant isolation.

## Architecture

```
AI / MCP / T.H.E.L.M.A.
          |
          v
   Leadstack Control Plane
          |
   +------+------+------+
   |      |      |      |
contacts deals  tasks workflows ...
   |      |      |      |
   +------+------+------+
          |
          v
  EstibanCreations-owned CRM adapters
          |
          v
    Supabase / Postgres
```

## Foundation rules

1. No third-party CRM dependency in core.
2. Tenant/workspace scope is mandatory on every CRM action.
3. Authorization is checked before execution, not only in the UI.
4. Destructive or externally visible actions are explicit operations.
5. Every agent-capable write emits an auditable action record.
6. Provider adapters are replaceable; domain contracts are provider-neutral.
7. Secrets never enter source control or client-side bundles.
8. MCP tools call Leadstack services; they do not call databases directly.

## Current phase

Phase 0 establishes the native contracts, service boundaries, MCP tool registry, authorization model and provider-neutral connector interfaces. Subsequent phases will bind these contracts to the existing standalone CRM and add owned communication/payment providers as needed.

See:

- `docs/ARCHITECTURE.md`
- `docs/FEATURE_MATRIX.md`
- `docs/SECURITY_BOUNDARY.md`
- `docs/IMPLEMENTATION_PLAN.md`
