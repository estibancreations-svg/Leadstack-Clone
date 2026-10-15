# Source and Reference Policy

Leadstack is implemented as EstibanCreations-owned source.

## Allowed

- Public product behavior as research
- Public API concepts as interoperability knowledge
- Generic CRM terminology and common workflows
- Official open standards and permissively licensed dependencies used in
  accordance with their licenses

## Not allowed

- Copying implementation source from the GoHighLevel-MCP repository
- Importing its custom-licensed modules
- Copy/pasting its tool handlers or API client
- Depending on GoHighLevel at runtime
- Representing third-party test/demo responses as Leadstack functionality

## Engineering rule

When an external project demonstrates a useful capability, write the
Leadstack requirement first, then implement it against Leadstack's own domain
model and owned adapters.
