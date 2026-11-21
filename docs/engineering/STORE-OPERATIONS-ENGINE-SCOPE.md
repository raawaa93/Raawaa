# Raawaa Store Operations Engine — scope and capability map

Reviewed: 2026-11-21
Canonical repository: `raawaa93/Raawaa`
Production delivery: Cloudflare Pages project `raawaa-store`

## Product objective

Build a store operations layer that helps the owner operate the Raawaa e-commerce business: monitor the storefront and releases, manage incoming orders, maintain product/pricing information, support customers, understand commercial performance, and automate repeatable operational work.

The engine is not a generic AI research platform, cryptocurrency system, exchange monitor, or trading product. Those capabilities are outside the store's scope.

## Current verified capabilities

### Storefront and commercial rules
- Static storefront with product catalogue, cart, pricing policy, payment-method presentation, delivery policy, and order handoff.
- Commercial policy is centralized: 10% discount only for eligible Sham Cash orders; free delivery to all Syrian governorates for every payment method.
- Customization and product details contain explicit confirmation boundaries; do not infer availability or final prices.

### Owner-facing operations
- Owner dashboard under `owner/`.
- Supabase authentication with an in-memory access token.
- Paginated order-list retrieval from the configured owner Edge Function.
- Telegram pairing and test-notification actions.
- Pricing editor/tool pages are present.

### Automation and reliability
The canonical repository currently contains store-specific workflows for:
- Production validation and Cloudflare Pages release.
- Store checks and browser regression tests.
- Visual QA for iPhone and desktop.
- Performance audits.
- Competitor crawling of approved public pages.
- Disaster-recovery repository backups.
- Preview deployment.
- Dependency/security scanning and repository hygiene.

These workflows are part of the store's existing operating system. Do not duplicate or replace them without evidence of a gap.

### Backend boundary
- Owner dashboard references Supabase Edge Functions for order listing, Telegram pairing, and Telegram test notification.
- Archived migrations document private order staging/outbox, Telegram pairing, rate limits, retention, phone marketing preference events, and a commerce schema.
- The migration archive is historical evidence, not a runnable migration set. The Supabase project is shared; do not replay archived migrations.
- Current repository documentation says storefront order flow is WhatsApp handoff and the owner dashboard remains staging/test-only.
- The owner client exposes order listing but no confirmed order-status mutation method in its current public interface.
- The available repository evidence does not establish a live inventory-management workflow or a complete production order-management API.

## Capability gaps to validate before implementation

1. **Production order operations:** establish whether orders are persisted in production, where the source of truth lives, and whether owner actions can safely confirm, cancel, prepare, fulfill, or reconcile an order.
2. **Inventory:** establish whether authoritative stock quantities exist and how stock changes are recorded. Do not introduce guessed quantities or parallel inventory.
3. **Product and pricing operations:** map the existing owner pricing editor to the canonical `js/config.js` and pricing policy; ensure edits are validated, audited, and recoverable.
4. **Customer support:** map WhatsApp and Telegram workflows, delivery exceptions, and notification delivery states.
5. **Commercial analytics:** identify reliable order, payment, delivery, cost, and return data before defining revenue or profit metrics.
6. **Store health:** consolidate existing CI, visual QA, performance, backup, and deployment outcomes into an owner-readable status view rather than creating duplicate scheduled jobs.
7. **Marketing:** enforce channel-specific consent and suppression. WhatsApp contact or an order is not email-marketing consent; the phone preference ledger is not an email subscription database.

## Target architecture

Keep the existing store repository, Cloudflare Pages deployment, Supabase backend, and owner controls as canonical. Add the smallest missing operational layer inside this repository only after the backend contracts are verified.

Preferred separation:
- **Storefront:** product discovery, cart, checkout/order request, customer-facing policies.
- **Store backend:** authoritative orders, lifecycle events, idempotency, notifications, consent, and audit records.
- **Operations interface:** owner dashboard for order triage, product/pricing controls, customer follow-up, and exceptions.
- **Automation layer:** scheduled checks and event-driven tasks that call narrowly scoped backend APIs.
- **Observability:** one operational status view sourced from actual workflow and backend results.

All writes must be authorized, idempotent, auditable, and constrained to the intended store. Payment execution, irreversible customer messaging, bulk customer actions, and production data migrations require explicit safeguards and verified contracts.

## Out of scope

- Cryptocurrency market data, exchange APIs, trading, and paper trading.
- Academic/general research discovery unrelated to store operations.
- A general-purpose financial ledger disconnected from store transactions.
- Replacing the current backend or deployment system without a migration plan.
- Duplicate order, customer, stock, or marketing-consent databases.

## Implementation sequence

1. Complete a read-only backend and owner-dashboard contract audit.
2. Document current source-of-truth tables, Edge Function behavior, auth, and lifecycle transitions.
3. Identify the highest-impact operational gap and implement only that slice.
4. Add contract tests, idempotency tests, authorization tests, and audit verification.
5. Use a feature branch and pull request; validate previews before any production release.
6. Expand only after the first operational slice is proven.

## Non-goals for this scope document

This document does not change production behavior, database schemas, secrets, Cloudflare settings, GitHub Actions permissions, or customer data. It records the scope and evidence required for the next implementation phase.
