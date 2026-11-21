# RAWAA Store — backend contract audit

**Audit date:** 2026-11-21  
**Canonical repository:** `raawaa93/Raawaa`  
**Supabase project:** `Ghaioooth-core` (`oyoyozdugicmnkfhjovo`)  
**Scope:** read-only metadata and source inspection. No customer records, secrets, or message identifiers were read. No database, function, deployment, or customer data was changed.

## Executive decision

Keep the current customer order handoff through WhatsApp. Do not enable direct checkout intake, expose `commerce-api`, or add order-status controls until the deployed Edge Function source and the authoritative order model are verified.

The owner-facing client is currently a list/pairing/test-notification client, not a complete order-management API. Two empty order schemas exist, but they are not interchangeable.

## Verified application contract

The canonical owner configuration points to Supabase project `oyoyozdugicmnkfhjovo` and these Edge Function endpoints:

- `rawaa-owner-orders`
- `rawaa-telegram-pair`
- `rawaa-telegram-test`

The inspected `owner/owner-client.mjs` exposes:
- Password login and logout.
- Paginated order listing.
- Telegram pairing start/finish.
- Telegram test notification.
- A marketing-withdrawal method only when an optional endpoint is configured.

It does **not** expose order confirmation, cancellation, preparation, fulfillment, stock mutation, or an order-status update method. The live `owner/settings.mjs` does not configure `marketingPreferencesEndpoint`; therefore the withdrawal method fails closed and is not currently wired to a live endpoint.

The storefront's documented customer order flow remains WhatsApp handoff. Do not represent the owner dashboard as live automated order management.

## Deployed Edge Function inventory

| Function | Version | JWT verification | Audit status |
|---|---:|---:|---|
| `rawaa-owner-orders` | 9 | enabled | Source not retrieved; behavior must be reviewed |
| `rawaa-telegram-pair` | 7 | enabled | Source not retrieved; behavior must be reviewed |
| `rawaa-telegram-test` | 6 | enabled | Source not retrieved; behavior must be reviewed |
| `rawaa-outbox` | 7 | disabled | Scheduler/worker path; internal authentication not verified |
| `rawaa-retention` | 3 | disabled | Scheduler path; internal authentication not verified |
| `commerce-api` | 4 | disabled | Do not expose; authentication, authorization, rate limits, and idempotency not verified |

The Edge Function source retrieval was unavailable during this audit. Function versions and JWT settings are metadata only; they do not prove the functions' internal authorization or request validation. No function was invoked, changed, or redeployed.

## Database inventory and access boundaries

### `rawaa_store`

Tables present:
- `orders`
- `notification_outbox`
- `telegram_pairing_challenge`
- `telegram_recipient`
- `order_rate_limit`
- `marketing_preference_events`

Observed row counts:
- `orders`: 0
- `notification_outbox`: 0
- `marketing_preference_events`: 0
- One pairing challenge and one Telegram recipient record exist; their values were not read.

All inspected tables have RLS enabled. No RLS policies were present. This is not, by itself, evidence of public exposure: `anon` and `authenticated` have no schema usage or table privileges. `service_role` has schema usage and the required table privileges for the Store tables.

The schema includes order lifecycle values `pending_review`, `confirmed`, `cancelled`, and `fulfilled`, plus idempotency fields, an outbox, rate-limit storage, closure triggers, and retention routines. These structures do not prove a production order intake or mutation API exists.

### `commerce`

Tables present:
- `orders`
- `order_events`
- `rate_limits`

All are empty. The schema currently defaults order currency to `USD`, unit cost to zero, courier cost to 200 cents, and refusal cost to 100 cents. Those defaults are not approved Store economics and do not match the Store's SYP price presentation and free-delivery policy.

The `anon`, `authenticated`, and `service_role` roles have no schema usage or table privileges on `commerce` in the inspected grants. The current owner client does not use this schema. It is not a usable Store source of truth in its current state.

## Source-of-truth decision

Do not operate `rawaa_store` and `commerce` as competing order systems.

- `rawaa_store` is the current owner-client integration target and has Store-scoped service-role access, but its deployed function contract still needs source review and there are no orders.
- `commerce` is a separate, empty schema with incompatible defaults and no grants for the inspected API roles.

No schema was selected or modified by this audit. Keep WhatsApp handoff active while the function source, migration history, order payload contract, and intended lifecycle are reconciled.

## Required implementation gates

1. Retrieve and review the deployed source for all six Edge Functions, especially `rawaa-owner-orders`, `rawaa-outbox`, `rawaa-retention`, and `commerce-api`.
2. Verify owner authorization, scheduler authentication, rate limiting, CORS, request validation, idempotency, retry behavior, and audit/event writes.
3. Reconcile deployed function source with the recorded migration history and repository migration archive.
4. Select exactly one order source of truth; do not create parallel order, stock, or customer records.
5. Define the permitted state transitions and actor permissions before adding mutation endpoints.
6. Add contract tests for authorization failures, duplicate submissions, invalid transitions, notification uncertainty, and event/audit consistency.
7. Only then implement the smallest owner workflow slice on a feature branch and validate it without touching live customer data.

## Production and storefront status

Cloudflare Pages project `raawaa-store` reported a successful production deployment `34aa7138-4a82-4046-b8b9-de82f2595d79` at 2026-11-21 02:00:47 UTC, from source commit `1e35a8db697f25ed46bec32a81e9b9fc1dfe1762`.

The current repository `main` is at `9fd60cecf1076aaf40ee3875f9da4c447921e40b`. A comparison from the deployed source commit to current `main` showed 55 commits ahead and no commits behind; the changed-file list contained documentation, workflow, and test/policy files, not storefront source files. Therefore no storefront release was required for the documentation-only changes in this audit window.

## Explicit non-actions

- No customer/order data was queried.
- No database schema, rows, grants, or policies were changed.
- No Edge Function was invoked, edited, or redeployed.
- No payment, WhatsApp, Telegram, or marketing message was sent.
- No Cloudflare DNS/domain settings were changed.
- No production deployment was triggered.
