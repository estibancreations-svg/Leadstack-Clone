# Standalone CRM Bridge

## Purpose

This adapter binds Leadstack to the EstibanCreations-owned standalone CRM
without creating a second authorization system.

## Authentication

The adapter uses:

- the standalone CRM Supabase URL
- its publishable key
- the signed-in user's access-token JWT

It intentionally has **no service-role-key configuration**.

Supabase applies the user's JWT to Row Level Security. Leadstack also includes
`workspace_id` in every query as defense in depth.

## Current mapped records

- contacts
- companies
- deals
- tasks

The field mapping follows the current standalone CRM schema.

## Security behavior

Leadstack authorization happens first.

Then the adapter calls Supabase as the user.

Then standalone CRM RLS independently decides whether that user may access or
modify the requested workspace rows.

This means a Leadstack policy bug must not automatically become cross-client
database access.

## Multi-project production model

The standalone CRM documentation supports separate Supabase projects for
production clients. Leadstack must therefore treat CRM project selection as a
connection-resolution concern, not as a single global hard-coded database.

The current adapter represents one resolved CRM project. A later resolver will
select the correct project configuration for the authenticated workspace.

## Explicitly excluded

- service-role access from normal Leadstack requests
- direct SQL connections that bypass RLS
- GoHighLevel or other CRM bridges
- synchronization into a duplicate Leadstack CRM database
