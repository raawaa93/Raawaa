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
- PR #12: archived and removed the legacy Hama, setup, and diagnostic pages from the active source root; removed Hama from sitemap/service-worker cache; added a clean 174-file Pages payload builder and a preview-only Wrangler workflow.
- PR #6 was closed unmerged as a superseded failed iteration; PR #7 contains the corrected version.
- GitHub Actions for PR #7 completed successfully.
- These merges changed GitHub source only; they did not deploy to Cloudflare production.

## Current Cloudflare Pages state

- Project: `raawaa-store`, Direct Upload, `uses_functions=false`, production branch label `main` (but no Git source is configured).
- Production deployment: `10b28454-da98-4bb7-9172-ee947a93a9e3`, created 2026-11-08. The live site was smoke-tested and works, but still displays the superseded 15% promotion.
- Latest known preview: `pr-208`, deployment `10b8ef21-037c-43a9-adf8-37ac7874dcdd`, created 2026-11-14. It also displays 15% on the homepage and Serum page, so it is not an acceptable release candidate.
- No deployment of the current GitHub `main` has been created. The preview workflow successfully built and validated a 174-file payload from source SHA `af0f6f54873aaea169214a21b5c42be47e9e0d9a`, but skipped the upload because the GitHub repository secret `CLOUDFLARE_API_TOKEN` is not configured. Do not claim that PR merges have updated the live website.
- The supported preview path is now a GitHub Actions workflow using Wrangler. It is hard-limited to the Cloudflare branch `raawaa-recovery-preview` and never targets production. To activate it, add a GitHub repository Actions secret named `CLOUDFLARE_API_TOKEN` with Account → Cloudflare Pages → Edit permission scoped to the Raawaa Cloudflare account. Do not grant DNS permissions. The existing `preview-deploy/2026-11-14` trigger branch can be updated to rerun the preview after the secret is added.

## PR #208 preview reconciliation

The read-only browser audit of `https://pr-208.raawaa-store.pages.dev/` found:

- Homepage and Serum pages advertise 15%, conflicting with the owner's 10% decision.
- Product price ladder is unchanged: Rosemary + Caffeine 2,000 / 2,400 / 2,800 SYP; Olive + Panthenol 1,800 / 2,200 / 2,600 SYP; Castor Blend 1,800 / 2,200 / 2,600 SYP.
- Delivery is free across all provinces and payment methods.
- `hama.html` was moved to `recovery/snapshots/legacy-pages-2026-11-14/` and removed from the active source root. It was a divergent city page with USD prices ($13 / $16 / $25), a legacy `H12-HAMA` WhatsApp code, and two short videos. Its page-specific CSS/JS were archived and removed from the active root; `assets/img/hama/` remains historical but is excluded from deployment.
- `/privacy` exists but is explicitly marked as a draft pending legal review. Preserve the draft disclosure and do not represent it as legally finalized.
- `setup.html` and `check.html` were also archived and removed from the active root; the old setup page linked to the suspended GitHub repository. Their CSS/JS were archived. They are not part of the deployment payload.
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


## Git branch inventory and safe retirement (2026-11-14)

Current `main` head: `2a70977ba1f8852b87c9731040fafaa89f9d62a0`. No pull requests remain open. PRs #1, #2, #3, #4, #5, #7, #8, #9, and #10 are merged. PR #6 is closed unmerged and explicitly superseded by PR #7.

| Branch | Classification | Action |
|---|---|---|
| `main` | Canonical current source | Keep |
| `backup/site-2026-11-14-restored-main` | Recovery checkpoint | Keep immutable |
| `backup/site-2026-11-14-post-mobile-audit` | Recovery checkpoint | Keep immutable |
| `deploy/10-percent-2026-11-14` | Deployment manifest candidate | Keep until latest preview/release is verified |
| `deploy/10-percent-site-only` | Static-site-only payload candidate | Keep until latest preview/release is verified |
| `recovery/cloudflare-manifest-2026-11-14` | Recovery source checkpoint | Keep until all assets and provenance are reconciled |
| `restore/integrated-store-2026-11-14` | Divergent recovery/history branch (174 commits ahead, 5 behind at last comparison) | Do not delete; inspect unique history/assets before any retirement |
| `work/mobile-ux-audit-2026-11-14` | PR #3 merged | Safe to retire after final backup verification |
| `maintenance/canonical-source-of-truth-2026-11-14` | PR #4 merged | Safe to retire |
| `maintenance/policy-regression-guard-2026-11-14` | PR #5 merged | Safe to retire |
| `feature/campaign-nitro-offer-2026-11-14-v2` | PR #7 merged | Safe to retire |
| `feature/campaign-nitro-offer-2026-11-14` | PR #6 closed unmerged; superseded by PR #7 | Safe to retire |
| `fix/owner-currency-syp-2026-11-14` | PR #9 merged | Safe to retire |
| `docs/release-readiness-backend-audit-2026-11-14` | PR #8 merged | Safe to retire |
| `docs/owner-currency-alignment-2026-11-14` | PR #10 merged | Safe to retire |

No branch was deleted. The connected GitHub toolset exposes branch reads and PR merges but no branch-delete action; the historical/recovery branches also require preservation until their unique commits/assets are verified. Merged/closed feature branches are inactive and are not Cloudflare deployment sources. They can be deleted later through an authorized GitHub branch-management path after final backup verification. Do not delete the backup, recovery, restore, or deploy branches as part of routine cleanup.


## Preview gate status (2026-11-14)

- PR #12 is merged. The clean payload builder passed GitHub Actions and produced 174 files; it excludes recovery docs, Hama media, setup/diagnostic pages, and development tooling.
- The service worker cache version was bumped so clients discard the old cached Hama route; the sitemap now includes `/campaign` and excludes `/hama`.
- A preview-only GitHub Actions workflow is installed. The first run completed the build successfully but skipped deployment because `CLOUDFLARE_API_TOKEN` is absent from repository secrets. No Cloudflare deployment was attempted by that workflow.
- Required one-time action: add `CLOUDFLARE_API_TOKEN` as a GitHub Actions repository secret, with only Account → Cloudflare Pages → Edit permission for the correct Cloudflare account. Do not paste the token into ChatGPT. After it is added, update the existing `preview-deploy/2026-11-14` trigger file to start the isolated preview.
- Expected preview hostname after a successful deployment: `raawaa-recovery-preview.raawaa-store.pages.dev`. This hostname does not exist until the workflow reports a created deployment.

 
## Operational re-audit — 2026-11-15

### Current Cloudflare state (API read-back)

- Pages project: `raawaa-store`, Direct Upload, `uses_functions=false`.
- Current production deployment: `4222fbbf-5d51-423d-a309-a2cec96b2f78`, URL https://4222fbbf.raawaa-store.pages.dev, source commit `4754dc63fff0f6d38f34d777699d1a99a8a41473`, deployment stage success.
- Current preview deployment: `652d59e8-a3b0-42dd-bd44-10a59d4c3d08`, URL https://652d59e8.raawaa-store.pages.dev, alias https://raawaa-recovery-preview.raawaa-store.pages.dev, same source commit, deployment stage success.
- Cloudflare reports `commit_dirty=true` on the latest production deployment and `commit_dirty=false` on the preview. This is a release-provenance warning: deployment succeeded, but the production deployment was built from a dirty working tree. It must not be represented as a fully clean/provenance-verified release.
- The only configured Pages domain remains `raawaa-store.pages.dev`; `rawaa.eu.org` is still pending with CNAME-not-set. Do not change DNS. The intended `rawaa.sy` purchase is a separate owner-side matter.

### CI/CD root cause and correction

- Root cause confirmed: `.github/workflows/production-cicd.yml` was configured to deploy on every push to `main`, contradicting the documented Direct Upload approval boundary. A second workflow, `pages-production.yml`, also provided a separate branch-push production deployment route.
- PR #24 was merged on 2026-11-15. Pushes to `main` now validate only; a production release requires a manual `workflow_dispatch` from `main` with `confirm_production=yes`. The deploy job is tied to the `production` GitHub Environment, rebuilds from the exact commit, verifies that `main` has not moved, and rejects dirty source.
- The duplicate `pages-production.yml` trigger was removed in PR #24. The isolated preview workflow remains separate.
- The workflow installs Playwright with `--package-lock=false` and uses a new `.gitignore` for local test/dependency output, preventing dependency installation from polluting the deploy working tree.
- PR #24 is merged. The workflow run triggered by the merge still requires Actions read-back verification. GitHub Environment required reviewers must be configured in repository Settings → Environments → production if an additional human approval gate is desired; the workflow's manual confirmation is already required. GitHub Environment required reviewers must still be configured in repository Settings → Environments → production if an additional human approval gate is desired; the workflow's manual confirmation is already required.

### Supabase advisor recheck (read-only)

- Project `oyoyozdugicmnkfhjovo`: Auth leaked-password protection remains disabled (WARN).
- The advisor reports 17 RLS-enabled/no-policy INFO findings, including Store tables. The current audit still does not show public `anon` or `authenticated` table grants; do not add broad policies or grants.
- Performance advisor reports 10 unused indexes (INFO) and one duplicate-index warning on `rawaa_store.orders` (`orders_closed_at_idx`, `orders_retention_idx`). Do not drop indexes without migration/history and workload review.
- Separate fallback project `xuwtuhfqjjwszxqkmivj` also has RLS-enabled/no-policy INFO findings. It remains unrelated to the Store and must not be substituted.

### Backup verification

- The disaster-recovery workflow definition exists, but this audit could not verify a completed run, artifact, SHA-256 verification, or restore drill through the available GitHub Actions read interface. Backup completion is therefore **unverified**, not complete.
- R2 remains deliberately inactive pending the owner's payment-card readiness. Do not enable paid resources or change DNS without the owner-side prerequisite.

### Release blockers unchanged

- Real product INCI/formula percentages and supplier documents are still required.
- Product images remain conceptual; actual product/packaging photography is still required.
- Privacy policy remains a draft pending legal review.
- Direct website order intake remains disabled; do not enable it until the Edge Function source and full order lifecycle are reviewed.


### Backup trigger improvement (merged PR #24)

- The backup workflow now runs on every push to canonical `main`, in addition to its daily schedule and manual trigger. The PR #24 merge commit should start a backup run and produce a 90-day GitHub Actions artifact without requiring Cloudflare R2 or a paid service.
- Artifact creation, SHA-256 verification and an isolated restore drill still require read-back evidence; the trigger change alone is not proof that a backup completed.
