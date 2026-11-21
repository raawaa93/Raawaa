# RAWAA Store — Edge Function source recovery provenance

**Audit date:** 2026-11-21  
**Repository:** `raawaa93/Raawaa`  
**Supabase project:** `Ghaiooth-core` (`oyoyozdugicmnkfhjovo`)  
**Scope:** read-only repository and database metadata inspection. No deployed function, database row, schema, secret, or production setting was changed.

## Finding: a temporary recovery workflow existed, but did not preserve source in Git

The branch `recovery/inspect-edge-functions-2026-11-15` points at commit `770a8beeef093dadd5f78fff0f7f157d050fe0c9`, whose message is `chore: remove one-off function source recovery workflow`.

Its parent, `ee858173fad2833bb9662a569fa79b71a6d0fac1`, contains `.github/workflows/inspect-edge-functions.yml`. The workflow:

1. Checks whether the GitHub secret `SUPABASE_ACCESS_TOKEN` exists.
2. If present, uses `npx supabase@latest functions download --project-ref ... --use-api` against both `Ghaiooth-core` and `raawaa-engine-fallback`.
3. Archives the downloaded directories in the runner temporary directory.
4. Uploads `supabase-edge-function-source-review` as a GitHub Actions artifact with a **2-day retention period**.

The workflow has no step that commits downloaded function source into the repository. The current recovery branch tree contains the workflow removed; its parent tree contains it. Neither tree contains the six deployed function source directories.

The workflow was therefore a temporary artifact-recovery mechanism, not durable source restoration. The available connector does not expose the push-triggered workflow-run listing for this historical run, so this audit cannot establish whether the workflow executed, whether the secret was configured, or whether an artifact was successfully uploaded. If an artifact was uploaded around 2026-11-15, its configured retention would have expired around 2026-11-17. Do not treat the source as recovered until an actual archive is retrieved and matched to deployed versions.

## Migration provenance

The branch `recovery/archive-store-supabase-migrations-2026-11-15` contains seven Store migration SQL files under `recovery/supabase-store-migrations/`, plus a README documenting their origin. The README states these SQL statements were recovered read-only from `supabase_migrations.schema_migrations.statements` in the shared project.

This is a **historical, partial archive**, not an executable Supabase migration directory:
- 7 Store migrations are included.
- 12 council/control-plane migrations are intentionally omitted.
- The archive is deliberately outside `supabase/migrations`.
- It must not be replayed against the shared project, where these migrations are already applied.

The live Supabase migration listing independently reports the same seven Store versions, ending with `20261106181603 commerce_multi_store_spine`, among 19 total migrations.

## Additional read-only database findings

- Four SQL routines exist in `rawaa_store`: `redact_expired_marketing_preference_events`, `redact_expired_order_contacts`, `set_order_closed_at`, and `track_order_closure`.
- `redact_expired_marketing_preference_events` is `SECURITY DEFINER`, has a fixed `search_path=pg_catalog, rawaa_store`, and is executable by `service_role` but not `anon` or `authenticated`.
- `redact_expired_order_contacts` is invoker-security and executable by `service_role` but not public API roles.
- `set_order_closed_at` is executable only by `postgres`; `track_order_closure` is executable by `service_role` and `postgres`.
- A read-only catalog check found no `cron.job` relation. This only means the expected pg_cron catalog table was not present; it does not rule out an external scheduler or another scheduling mechanism.
- In the queried recent log window, `edge_logs` was present; no `function_edge_logs` source rows were returned. This is not proof that functions have never executed.

## Required next action

Recover the actual source archive from an extant artifact or an authorized Supabase CLI download path, then:
1. Preserve it in a private, access-controlled review location without secrets.
2. Record each function's deployed version and source checksum.
3. Review authentication, scheduler authorization, CORS, validation, rate limiting, idempotency, retries/leases, retention, and audit behavior.
4. Add sanitized, reviewed source and contract tests to a dedicated feature branch only after provenance is established.

Until that happens, keep WhatsApp handoff active. Do not expose `commerce-api`, change grants/policies, run archived migrations, or enable order mutation.
