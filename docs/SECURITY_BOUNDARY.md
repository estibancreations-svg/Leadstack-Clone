# Leadstack Security Boundary

## Mandatory scope

Every CRM operation requires:

- actor ID
- agency ID
- workspace ID
- request ID
- role set
- authentication assurance level
- source: human, agent or system

Missing scope means deny.

## Agent rule

Agents receive no implied authority from a human's broad account access.
An agent action must be explicitly delegated the permission it is attempting
to use.

Example: an agent with `contacts.read` cannot send a message merely because
the human owner could.

## AAL2 rule

Actions that cause an external side effect require AAL2:

- sending messages
- booking appointments
- publishing social content
- running externally visible workflows
- sending invoices
- destructive actions

## Destructive actions

Destructive operations require both:

1. AAL2
2. owner, backup or admin role

Destructive tools will be introduced only with explicit audit and recovery
behavior.

## Audit rule

Leadstack records:

1. authorization decision
2. success or failure

The production audit sink must be append-only from normal application roles.

## Secret rule

Secrets never enter:

- Git history
- browser bundles
- MCP tool arguments unless the tool specifically manages an approved secret
  flow
- normal audit payloads

Provider credentials belong in an encrypted server-side secret store.

## Third-party CRM prohibition

GoHighLevel is explicitly outside the Leadstack trust boundary.

Leadstack must not contain:

- GoHighLevel API credentials
- GoHighLevel Location IDs
- GoHighLevel SDK/client dependencies
- GoHighLevel HTTP endpoints
- GoHighLevel webhooks
- GoHighLevel runtime connectors
- copied GoHighLevel-MCP implementation source

Publicly observable feature categories may be used as product research only.
