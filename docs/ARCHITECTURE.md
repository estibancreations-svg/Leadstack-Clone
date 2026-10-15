# Leadstack Architecture

## System role

Leadstack is the control plane above EstibanCreations-owned CRM data and provider adapters. It is not a CRM vendor wrapper.

```
T.H.E.L.M.A. / ChatGPT / approved agents / human UI
                         |
                         v
                MCP / application API
                         |
                         v
              Leadstack Execution Layer
              + policy + audit + validation
                         |
          +--------------+--------------+
          |              |              |
        CRM port      messaging      calendar ...
          |              |              |
          +--------------+--------------+
                         |
                         v
             EstibanCreations-owned systems
```

## Layers

### 1. Tool/API layer

Tools describe business capabilities such as `leadstack_search_contacts` or
`leadstack_send_message`. Tool names are Leadstack-native and do not expose
provider-specific identifiers.

### 2. Execution layer

Every tool execution receives an `ActorContext` containing the agency,
workspace, identity, authentication assurance level, source and delegated
permissions.

The execution layer authorizes first, records the decision, executes the
operation, then records success or failure.

### 3. Ports

Ports define what Leadstack needs from the outside world without selecting a
vendor. The initial `CrmPort` mirrors the core records already present in the
standalone CRM: contacts, companies, deals and tasks.

Additional ports will cover:

- conversations / messaging
- calendars
- workflows
- media
- social publishing
- products / inventory
- invoices / estimates / payments
- forms / surveys

### 4. Adapters

Adapters implement ports against EstibanCreations-controlled infrastructure.
An adapter must not weaken workspace isolation or move secrets to client-side
code.

## Data authority

The CRM database remains the system of record for CRM data. Leadstack is the
command/control and automation layer. It should never create a second,
unsynchronized source of truth for the same record type.

## Rule

No adapter may be added merely because another CRM offers an endpoint. A
capability enters Leadstack only after its data owner, security boundary,
audit behavior and failure mode are defined.
