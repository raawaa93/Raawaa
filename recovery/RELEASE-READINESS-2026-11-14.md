# RAWAA Store — Release readiness and backend audit

Updated: 2026-11-14

## Canonical source and active commercial rules

- GitHub repository: `raawaa93/Raawaa`.
- `main` is the sole canonical website source.
- Owner-confirmed policy: **10% Sham Cash discount only**; COD receives no Sham Cash discount; delivery is free to all Syrian governorates for all payment methods.
- Product price values remain centralized in `js/config.js`; calculation logic remains in `js/pricing-policy.js`.
- Current products: Rosemary + Caffeine, Olive Oil + Panthenol, Castor Blend; 30 ml, 50 ml, 100 ml.
- Do not reuse 15% content from PR #205 or the old Cloudflare previews.

## Work merged into main on 2026-11-14

- PR #4: canonical 10% policy, source-of-truth rules, and archive boundaries.
- PR #5: regression guard against the superseded 15% promotion in active HTML/JS assets.
- PR #7: approved Nitro campaign direction, 10% + free-delivery banner, corrected delivery/scent copy, product visuals beside campaign details, and regression checks.
- PR #9: aligned owner pricing labels and fallback formatting to SYP; owner order totals now respect an explicit order currency and default to the Store's configured SYP currency. No database or Edge Function changes were made.
- PR #6 was closed unmerged as a superseded failed iteration; PR #7 contains the corrected version.
- GitHub Actions for PR #7 completed successfully.
- These merges changed GitHub source only; they did not deploy to Cloudflare production.

## Current Cloudflare Pages state

- Project: `raawaa-store`, Direct Upload, `uses_functions=false`, production branch label `main` (but no Git source is configured).
- Production deployment: `10b28454-da98-4bb7-9172-ee947a93a9e3`, created 2026-11-08. The live site was smoke-tested and works, but still displays the superseded 15% promotion.
- Latest known preview: `pr-208`, deployment `10b8ef21-037c-43a9-adf8-37ac7874dcdd`, created 2026-11-14. It also displays 15% on the homepage and Serum page, so it is not an acceptable release candidate.
- No deployment of the current GitHub `main` has been created. Do not claim that PR merges have updated the live website.
- Cloudflare Pages asset upload token can be retrieved, but the available connector's asset check endpoint returns 403 because its request interface cannot attach the required upload-token Authorization header. No deployment was created as part of this attempt. Resolve the upload path using an authorized supported method before creating a preview.

## PR #208 preview reconciliation

The read-only browser audit of `https://pr-208.raawaa-store.pages.dev/` found:

- Homepage and Serum pages advertise 15%, conflicting with the owner's 10% decision.
- Product price ladder is unchanged: Rosemary + Caffeine 2,000 / 2,400 / 2,800 SYP; Olive + Panthenol 1,800 / 2,200 / 2,600 SYP; Castor Blend 1,800 / 2,200 / 2,600 SYP.
- Delivery is free across all provinces and payment methods.
- `/hama` is a divergent city page with USD prices ($13 / $16 / $25), a legacy `H12-HAMA` WhatsApp code, and two short videos. Exclude it from the canonical source; do not reintroduce its USD pricing or old route-specific checkout.
- `/privacy` exists but is explicitly marked as a draft pending legal review. Preserve the draft disclosure and do not represent it as legally finalized.
- The Serum page has detailed prefilled WhatsApp messages and the cart is a side drawer. These functions are already present in the recovered source and must be retained.
- The preview's images look photographic, but the page itself says they are proposed packaging designs, not final printed product photographs. Treat them as conceptual imagery until supplier/product provenance is verified. The current campaign cards disclose this clearly.
- No public owner login link was found. The owner route exists separately at `/owner/` and is marked as not yet receiving direct website orders.

## Supabase backend — read-only findings

The Store owner frontend is configured to use Supabase project `Ghaioooth-core` (`oyoyozdugicmnkfhjovo`). A separate project `raawaa-engine-fallback` exists; do not substitute it for the Store backend or mix its resources with the Store.

The `Ghaioooth-core` project contains both Store-specific schemas and the separate council/control-plane tables. The Store-specific schemas are `rawaa_store` and `commerce`.

### Deployed Edge Functions (metadata only)

- `rawaa-owner-orders` v9 — JWT verification enabled.
- `rawaa-telegram-pair` v7 — JWT verification enabled.
- `rawaa-telegram-test` v6 — JWT verification enabled.
- `rawaa-outbox` v7 — JWT verification disabled (scheduler/worker path; review source before exposing).
- `rawaa-retention` v3 — JWT verification disabled (scheduler/worker path; review source before exposing).
- `commerce-api` v4 — JWT verification disabled; do not connect it to public checkout until its code, authorization, rate limits, and idempotency behavior are reviewed.

The Supabase connector failed to retrieve Edge Function source code during this audit. No function was changed or redeployed.

### Data state (counts only; no customer data read)

- `rawaa_store.orders`: 0 rows.
- `rawaa_store.notification_outbox`: 0 rows.
- `rawaa_store.marketing_preference_events`: 0 rows.
- `commerce.orders`: 0 rows.
- `commerce.order_events`: 0 rows.
- A Telegram recipient record exists; do not expose its chat identifier.
- Therefore there are no existing Store orders to migrate, but the schema and notification infrastructure must be preserved.

### Access-control and advisor findings

- RLS is enabled on the Store and commerce tables.
- No RLS policies exist on these schemas; the read-only grants audit found no `anon` or `authenticated` table grants. Access is limited to the database owner and/or `service_role` where explicitly granted. The advisor's 17 RLS-without-policy findings are therefore INFO-level findings, not evidence of public table access.
- Auth leaked-password protection is disabled (WARN). Enable after reviewing owner login impact and available Auth settings.
- Two identical indexes were reported on `rawaa_store.orders` (`orders_closed_at_idx`, `orders_retention_idx`). Do not drop either until migration definitions and index usage are reconciled.
- Ten unused indexes were reported (INFO). Do not remove them during storefront recovery.
- The owner portal uses a publishable key in the browser and JWT-authenticated Edge Function endpoints; no service-role key was found in the public owner settings.
- The owner page explicitly says direct website order intake is not activated. The public site still confirms orders through WhatsApp. The owner panel must not be described as a live automated order-management system until a real end-to-end order is tested.
- The owner pricing editor and order-total display were aligned to SYP in PR #9. The backend response contract has not yet been verified with a real order, so direct intake remains disabled; if the backend supplies an explicit `order.currency`, the owner UI respects it.
- The `commerce` schema is a newer multi-store order spine with cost/RTO fields but currently has no orders and is not connected to the owner dashboard. Its current `commerce.orders` defaults to USD, accepts COD/Sham Cash/Syriatel Cash/MTN Cash, sets unit cost to 0, courier cost to 200 cents, and refusal cost to 100 cents. This does not yet match the Store's current SYP price presentation and confirmed payment policy. Keep it isolated until currency handling, product-cost inputs, payment methods, and the intended order-system architecture are reconciled. Do not populate its cost defaults by guesswork.

## Domain status — HOLD

- Cloudflare lists `rawaa.eu.org` as pending with error `CNAME record not set`.
- This does not establish that this is the intended historical Store domain. Do not alter DNS, nameservers, or custom-domain settings without independent confirmation.

## Remaining work — in order

1. Produce a Cloudflare Direct Upload preview from the latest canonical `main` using a supported authenticated asset-upload path; keep it isolated from production.
2. Test that preview on iPhone/Safari: all 3 formulas, all sizes, cart, discount 10% for Sham Cash only, COD without discount, free delivery for every zone, and WhatsApp message composition.
3. Replace conceptual campaign/product visuals only after verified supplier photographs for the exact formulas and branded packaging are available. Keep the conceptual-image disclosure until then.
4. Review the owner Edge Function source, scheduler protections, `commerce-api` authentication/rate-limits, Auth leaked-password protection, and duplicate index migration history.
5. Decide whether the Store's order-management source of truth remains `rawaa_store` or moves to the newer `commerce` schema. Do not run both as competing systems.
6. Complete privacy-policy legal review before commercial launch.
7. Confirm the intended Store domain independently before any DNS or custom-domain action.
8. Only after preview validation and owner approval, promote the release to production.

## Non-destructive cleanup policy

- Keep both `backup/*` branches.
- Keep `recovery/snapshots/*` as read-only evidence, including PR #188, #196, #197, #204, #205, and PR #208 checkpoints.
- Do not delete `restore/integrated-store-2026-11-14` or `recovery/cloudflare-manifest-2026-11-14` before proving all unique commits and assets are preserved.
- Retire merged/failed work branches only when a supported branch-delete action is available and their commits are already reachable from `main` or a backup.
- Keep old Hama video assets and routes out of the active deployment payload; their archival presence does not make them part of the current Store.
