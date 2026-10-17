# Docs refresh — staged corrections (DRAFT, push after Owner approval)

## standalone-crm START_HERE.md

Current stale line (main, §4):
> "Version 2.0 has not yet passed the Vercel build gate (lint, typecheck, unit tests, build) — the machine that wrote it couldn't download packages."

Correction (verified 2026-10-17):
> "Version 2.0 production deployment dpl_64gtDrsxgA1d72bV85Xq1y4CWqjZ (main 609ca86) is READY on Vercel. The old 'has not yet passed' note is retired. CI (GitHub Actions) is still being activated — see docs/CI_ACTIVATION_NOTE.md and PR #6. Do not treat Vercel Ready alone as DB/RLS gate evidence."

Also update §4 checklist:
- [ ] Change "Apply migration 20261014000008" to note main already includes 01–08; v2.1 adds 09–11 (PR #5, not merged).
- [ ] Add: "Confirm repo is private" — verified private via GitHub read, but re-confirm in Settings before any prod customer data.

## standalone-crm docs/VERIFICATION_REPORT.md

Current: covers v3.1 bdb0356 only, plus "Advisor shows only intentional notes + leaked password protection off."

Addendum to append (do NOT rewrite history — add new section):
- v2.0 prod: main 609ca86, Vercel dpl_64gt... READY, /api/health ok per Oct 17 review (re-verify at release time).
- v2.1: PR #5 head c455752, preview READY, NOT merged, NOT production-certified. No fresh authenticated end-to-end run on 2026-10-17.
- CI: inactive until PR #6 lands (workflow files in ci/ not executed). Vercel verify runs lint/typecheck/tests before build, but DB/isolation gate is not automatically protecting every change until CI lands.
- Lockfiles: none in either repo as of 2026-10-17.
- DOCX/ZIP from earlier chat: explicitly marked OUTDATED deployment references — use repo + this report instead.

## Leadstack-Clone docs/IMPLEMENTATION_PLAN.md

Current stale marks:
- Phase 0: "in progress", "[ ] Green GitHub Quality Gate", "[ ] MCP v2 transport/server binding"
- Phase 1: ALL unchecked, including adapter + contacts/companies/deals/tasks

Corrected marks (verified: PRs #1–3 merged, head 9eaf00a):
- Phase 0: "[x] Green GitHub Quality Gate" — Quality Gate passes on 9eaf00a (per Oct 17 review; re-verify in Actions after any gate edit). Status → "foundation complete, transport pending".
- Phase 0: "[ ] MCP v2 transport/server binding" — STAYS unchecked. Server factory exists (src/mcp/server.ts), but NO deployed transport endpoint, NO account connection, NO persistent audit, NO live smoke test.
- Phase 1: mark DONE: adapter contract, workspace identity mapping, contacts search/get/create/update, companies (list), deals/pipelines (list), tasks (create), cross-workspace denial tests (verify test files exist — do not claim without file check), agent delegated-permission tests.
- Phase 1: STAYS unchecked: notes, audit read, live non-destructive smoke test, broader company/deal/task management.
- Add explicit note: "Code exists ≠ phase complete. Production gate requires exact SHA, tenant-isolation evidence, no secret exposure, failure-path evidence, deployment/runtime evidence."

## Handbook scaffolding honesty

Handbook must keep (not soften) the explicit unfinished list:
- Unfinished delivery workers, social publishing, app OAuth connections, execution of approved T.H.E.L.M.A. requests.
- Reserved mailbox addresses are NOT hosted mailboxes.
- Support = meeting links, NOT built-in screen sharing (PR #5 claims "live screen-share sessions" — reconcile: if IT support sessions are meeting links, say so; do not claim built-in screen sharing).

Do not change handbook product claims without code evidence.
