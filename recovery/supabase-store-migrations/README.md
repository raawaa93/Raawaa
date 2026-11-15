# Raawaa Store — Supabase migration source archive

**Archive captured:** 2026-11-15  
**Purpose:** Preserve the seven Rawaa/commerce migrations already applied to the shared Supabase project.  
**Status:** Historical source archive only — not a runnable migration directory.

## Source and scope

The SQL in this directory was recovered read-only from `supabase_migrations.schema_migrations.statements` in the existing `Ghaiooth-core` Supabase project. The source project contains 19 applied migrations:

- 12 migrations belong to the separate council/control-plane system and are intentionally excluded from this Store archive.
- These 7 migrations are the Store-specific `rawaa_store` and `commerce` history, preserved with their original version prefixes and SQL statements.

No customer rows were exported. A count-only check on 2026-11-15 found zero rows in:
- `rawaa_store.orders`
- `rawaa_store.notification_outbox`
- `rawaa_store.marketing_preference_events`
- `commerce.orders`
- `commerce.order_events`

The existing project is shared with the council/control-plane system. **Do not run these files against that project**: these migrations are already applied there, and this archive intentionally omits the 12 unrelated migrations. It is not a complete migration history for the shared database and is deliberately stored outside `supabase/migrations` so the Supabase CLI cannot treat it as an executable migration set by default.

## Applied Store migration sequence

1. `20261029220654_rawaa_private_order_staging.sql` — private order and notification outbox tables; service-role-only grants.
2. `20261029224159_rawaa_telegram_pairing_staging.sql` — pairing challenge and recipient tables.
3. `20261030033946_rawaa_order_rate_limit.sql` — HMAC-keyed order rate-limit storage.
4. `20261030134505_rawaa_order_retention.sql` — closure tracking and bounded contact redaction after 365 days.
5. `20261106104317_rawaa_order_closed_at.sql` — repair/constraint migration and a second closure index.
6. `20261106111321_rawaa_marketing_preference_events.sql` — HMAC-based opt-in/withdrawal event history and bounded expiry cleanup.
7. `20261106181603_commerce_multi_store_spine.sql` — isolated multi-store order, event, and rate-limit tables.

## Findings to preserve before any backend activation

- `rawaa_store` and `commerce` are private schemas: `anon` and `authenticated` have no schema/table access; inspected tables have RLS enabled with no public policies. Do not add public policies to silence the informational RLS advisor.
- The two indexes `orders_retention_idx` and `orders_closed_at_idx` have identical definitions on `rawaa_store.orders(closed_at, id)` with `closed_at IS NOT NULL`. Keep both until the history is managed through a reviewed, versioned migration.
- `commerce.orders.currency` currently defaults to `USD`, and the schema also has cost defaults of 0/200/100 cents. These are not approved Raawaa commercial values. Do not connect this schema to checkout or populate cost fields by assumption.
- The deployed Edge Function source was not retrievable through the current Supabase connector. Metadata only: `rawaa-owner-orders` v9 (JWT on), `rawaa-telegram-pair` v7 (JWT on), `rawaa-telegram-test` v6 (JWT on), `rawaa-outbox` v7 (JWT off), `rawaa-retention` v3 (JWT off), `commerce-api` v4 (JWT off). The two scheduler functions and `commerce-api` require source/authentication review before further exposure or connection.
- The storefront currently hands off orders through WhatsApp; it does not insert a live database order. The owner dashboard remains staging/test-only.

## Safe next migration workflow

1. Recover and review the deployed Edge Function source and scheduler authentication.
2. Decide whether Rawaa remains on this shared project or moves to a dedicated Supabase project. Do not create a second live order source of truth.
3. If a dedicated project is chosen, create a fresh Supabase CLI project baseline and replay these migrations only in a disposable branch/database first.
4. Resolve the duplicate index and currency/cost defaults through new additive migrations with explicit tests.
5. Keep the current shared project untouched until the new project and migration plan are validated.

No SQL was applied, no function was deployed, and no database configuration was changed while creating this archive.
