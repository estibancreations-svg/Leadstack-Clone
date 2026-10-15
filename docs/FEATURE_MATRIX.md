# Leadstack Feature Matrix

This matrix is a product specification, not a third-party integration plan.

| Domain | Standalone CRM today | Leadstack target | Phase |
|---|---|---|---|
| Contacts | Yes | AI/MCP read + write | 1 |
| Companies | Yes | AI/MCP read + write | 1 |
| Pipelines / deals | Yes | AI/MCP read + write | 1 |
| Tasks | Yes | AI/MCP read + write | 1 |
| Notes | Yes | AI/MCP read + write | 1 |
| Audit history | Yes | Agent-aware audit | 1 |
| Conversations | Not yet | Unified inbox model | 2 |
| Email | Auth email only | Provider-neutral outbound/inbound | 2 |
| SMS | No | Provider-neutral outbound/inbound | 2 |
| Calendar | No | Calendars, availability, appointments | 2 |
| Workflows | No | Native trigger/action engine | 3 |
| Forms / surveys | No | Native forms + submissions | 3 |
| Media | No | Workspace media library | 3 |
| Social publishing | No | Provider-neutral publishing | 4 |
| Products | No | Catalog + pricing + inventory | 4 |
| Invoices / estimates | No | Native billing documents | 4 |
| Payments | No | Payment-provider adapter layer | 4 |
| Blogs/content | No | Optional content module | Later |

## Phase 1 acceptance

Leadstack must be able to operate existing CRM primitives without bypassing
the standalone CRM security model:

- search/get/create/update contacts
- list/manage companies
- list/manage deals
- create/manage tasks
- notes
- scoped audit reads
- workspace-scoped authorization
- explicit agent delegation
- verifiable tests

No provider integration is required to complete Phase 1.
