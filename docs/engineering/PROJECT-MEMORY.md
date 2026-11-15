# RAWAA Store — durable project memory

This file is the repository-backed memory that survives AI sessions, client changes, and expired hosted quotas. Keep it concise, factual, and updated when a material decision changes. It contains no credentials, customer records, or private order data.

## Canonical project

- Repository: `raawaa93/Raawaa`; `main` is the only canonical website source.
- Cloudflare Pages project: `raawaa-store`; current known URL: https://raawaa-store.pages.dev.
- Pages uses Direct Upload, not Git integration. A merge to `main` is **not** a production deployment.
- Production release is automated by the existing `RAWAA production CI and release` workflow after the full validation job succeeds on a push to `main`; manual dispatch with `confirm_production=yes` remains available for controlled reruns. It validates the exact current `main` SHA, rebuilds the clean payload, and refuses stale/dirty source. Owner has granted standing authorization for routine releases after these gates pass.
- Preview deployment is isolated from production. Never deploy a backup branch.
- `backup/*` branches and `recovery/` snapshots are historical rollback/evidence; do not delete, overwrite, or deploy them.

## Owner-confirmed commercial rules

- Sham Cash discount: 10% only.
- Cash on delivery: no Sham Cash discount.
- Delivery: free across every Syrian governorate for every payment method.
- Prices and product data live in `js/config.js`; pricing calculations live in `js/pricing-policy.js`.
- Do not duplicate policy calculations in page scripts or change prices/policies without explicit owner approval.

## Storefront and checkout

- Active customer pages: `index.html`, `serum.html`, `campaign.html`, `privacy.html`, and `404.html`.
- Product blends: Rosemary + Caffeine, Olive Oil + Panthenol, and Castor Blend; sizes 30/50/100ml.
- Current product packaging visuals are conceptual illustrations, not verified photographs of physical inventory. Preserve the disclosure.
- Orders are prepared for review and handoff through WhatsApp. Do not claim a message was sent, an online payment was collected, or an automated order-management system exists unless that behavior is implemented and tested.
- Privacy policy remains a draft requiring review before it is treated as legally final.
- Never fabricate product photography, testimonials, reviews, business credentials, inventory status, or order data.

## Architecture and release safety

- Preserve the static-site architecture unless measurement demonstrates a concrete need to change it.
- `scripts/check-site.mjs` validates commercial policy, page integrity, metadata, cart completeness, and local asset references.
- `scripts/build-deploy.mjs` creates the clean Cloudflare payload and excludes recovery/development material.
- Playwright tests cover browser behavior, including Chromium and WebKit. Add deterministic regression coverage before changing cart, pricing, or WhatsApp behavior.
- Production deploy runs automatically only after successful validation on pushes to `main`; pull-request events never deploy. Preserve exact-SHA checkout, latest-main freshness check, clean-source check, Cloudflare secret check, and the production environment. Never bypass a failed gate.
- Do not change DNS/domain ownership, secrets, billing, Supabase data/schema, customer/order records, or security permissions unless technically necessary and within the owner's standing authority; irreversible/destructive data changes still require a recoverable plan and specific approval.
- Do not confuse unrelated Supabase projects. Verify the project ID before any backend operation.

## SEO, performance, and source quality

- A page marked `noindex` must not appear in `sitemap.xml`. The campaign landing page remains accessible for campaigns but is intentionally `noindex,follow` and excluded from the sitemap (PR #42, merged 2026-11-15).
- Product selection query variants that are UI states of `/serum` should canonicalize to `/serum`; do not create duplicate indexable product URLs without an explicit information-architecture decision.
- Do not use Google's Indexing API for ordinary storefront pages. It is restricted to JobPosting and livestreaming VideoObject content.
- Lighthouse CI measures mobile performance on the key storefront pages. Current measured gates: Performance >=80, Accessibility >=95, Best Practices >=95. SEO and intentional noindex states remain warnings; do not disable checks to obtain a green run.
- Lighthouse reports are retained as GitHub Actions artifacts for 14 days; do not upload reports to a hosted service.
- Graphify is pinned to `graphifyy==0.9.109`, runs daily offline and code-only, with model/API backends disabled. It excludes `.github/workflows/` and generated/dependency/recovery material. Its graph is a regenerable index, not authoritative business-policy memory.
- Dependabot weekly updates are enabled for npm dependencies and GitHub Actions (PR #37, merged 2026-11-15).
- `package.json` currently declares `@playwright/test` as a version range; a committed `package-lock.json` was not present at the last verified read. Do not fabricate a lockfile. Generate it using npm in a real environment, validate with `npm ci`, then add OSV-Scanner against the resolved lockfile. Until then, report the dependency audit as incomplete rather than claiming a clean vulnerability scan.

## AI/tooling memory policy

- Read this file and `AGENTS.md` before substantial repository work.
- Keep decisions and lessons here when they are durable and useful across tools. Keep transient debugging details out; use an optional local memory tool for those.
- **Primary optional event memory — [ProjectMem](https://github.com/riponcm/projectmem):** MIT, local-first, no cloud quota or API key. Pin the reviewed v0.3.5 rather than auto-upgrading. Its PyPI v0.3.5 artifacts did not show trusted-publishing provenance in the inspected release metadata; treat it as an opt-in trial, not a trusted dependency.
- On a developer machine with a local clone and a compatible MCP client, install in an isolated Python environment and initialize conservatively:

  ```bash
  python3 -m venv ~/.venvs/rawaa-projectmem
  ~/.venvs/rawaa-projectmem/bin/python -m pip install 'projectmem==0.3.5'
  cd /path/to/Raawaa
  ~/.venvs/rawaa-projectmem/bin/pjm init --no-hooks --no-global --no-watch --no-backfill --no-claude-md --no-structure
  ```

  Then configure the MCP client using the configuration printed by `pjm init` and the official client-specific guide. This local MCP process is not automatically connected to ChatGPT's hosted environment. Keep `.projectmem/` untracked.
- ProjectMem's security policy documents that its event log is append-only, its git hooks execute code on commits, and its generated summaries/maps may be sent to the connected AI provider. The conservative init flags above avoid hooks, watcher, global memory, automatic history ingestion, and generated project-structure cache. Never record secrets, API keys, customer names, phone numbers, addresses, order payloads, or private commercial data.
- **Secondary local fallback — [MCP Memory Service](https://github.com/doobidoo/mcp-memory-service):** Apache-2.0; local SQLite-vec storage and local ONNX embeddings are documented, so semantic retrieval can work without a hosted embedding API. Requires Python 3.11+ and a persistent local service; it is semantic memory, not a replacement for ProjectMem's typed issue/attempt/fix history. Keep it as a separate fallback and do not run both stores until data ownership and duplicate-write behavior are tested.
- **Code-structure index — [Graphify](https://github.com/Graphify-Labs/graphify):** use the pinned offline CLI in the existing daily GitHub Actions workflow. Generated graphs are short-lived artifacts and can be rebuilt from source.
- **Performance measurement — Lighthouse CI:** mobile baseline for key storefront pages. Reports stay in GitHub Actions artifacts; no hosted upload.
- Promptfoo and Langfuse remain candidates for a later stage when there is a real model/agent pipeline to evaluate and observe. Sharp remains deferred until image references and visual equivalence are audited; do not batch-replace production imagery before that.
- If optional tools or free hosted quotas are unavailable, this file, `AGENTS.md`, Git history, tests, and preserved recovery checkpoints remain the fallback. Local memory and Graphify are self-run tools with no vendor free-tier quota; the graph workflow is reproducible and can be rerun.

## Updating this memory

Update only when a verified, durable fact changes (for example: owner-approved policy, architecture, deployment boundary, or validated recovery decision). Include a date and evidence link for material changes. Do not treat a proposal or an unverified assumption as an established fact.

## Verified maintenance update — 2026-11-15

- PR #36: daily Graphify 0.9.109 and measured Lighthouse gates merged.
- PR #37: weekly Dependabot updates for npm and GitHub Actions merged.
- PR #42: campaign noindex/sitemap policy correction merged.
- PR #43: expanded `AGENTS.md` guidance for Antigravity and SEO/release safeguards merged.
- PR #44: refreshed durable project memory merged (merge commit `36ef0a3fc4acd5e10cb9fd6ef9540493e98826e2`).
- PR #45: enabled automatic production releases after successful canonical-main validation; merged as `c38c1f1a1ead58dec3af8b312e0b5a0c368e2887`.
- Production run [#43667394554](https://github.com/raawaa93/Raawaa/actions/runs/43667394554) completed successfully: all 15 Playwright tests passed, store policy validation passed, the clean Pages payload validated at 179 files, source remained unchanged, and the deploy job succeeded.
- Cloudflare Pages production deployment [1386853d](https://1386853d.raawaa-store.pages.dev) completed successfully at 2026-11-15 02:23:37Z from exact main commit `c38c1f1a1ead58dec3af8b312e0b5a0c368e2887`. The project domain `https://raawaa-store.pages.dev` is attached; latest production deployment is no longer the old `fb97756`.
- Lighthouse run [#43666416941](https://github.com/raawaa93/Raawaa/actions/runs/43666416941) succeeded on the immediately preceding site-code commit: homepage Performance 99, serum 86, campaign 96, privacy 100; Accessibility and Best Practices 100 across all four pages. Campaign SEO score 69 is expected due to intentional noindex. Serum remains the main performance opportunity (LCP 3.84s, render-blocking estimate 750ms, unused CSS ~42KB, unused cart JS ~42KB).
- Graphify run [#43666416972](https://github.com/raawaa93/Raawaa/actions/runs/43666416972) succeeded: 293 nodes, 617 edges, 22 communities, 28 code files scanned, with no model/API extraction.
- The Pages project still has only `raawaa-store.pages.dev` attached. `rawaa.sy` is not attached yet.
- OpenSEO project had 500 credits remaining at the 2026-11-14 check. Google Search Console is now connected to the verified URL-prefix property `https://raawaa-store.pages.dev/`; the latest 3-month report still showed zero clicks/impressions before Google recognized the pages. No GA4 property/stream is exposed by the connected Google account, so GA4 remains unconnected.
- `package.json` declares `@playwright/test` as a version range and `package-lock.json` is absent. Reproducible dependency lock and OSV lockfile scan remain outstanding; do not claim vulnerability scanning complete.


## Verified integration and release audit — 2026-11-15

### Production and quality gates
- Canonical `main` is `b37f20fd005024d587df8191414cc80064ff5f47`; Cloudflare Pages production deployment `3967c264` completed successfully from that exact clean commit at 2026-11-15 03:51:50Z.
- The latest Store checks, production release, and disaster-recovery backup workflow runs all completed successfully for that commit.
- Cloudflare Pages is deployed by GitHub Actions using Wrangler Direct Upload (deployment trigger `ad_hoc`; no Pages build command is configured). The deployment API showed 538 total historical deployment records across 22 pages; this is not a monthly usage meter and must not be interpreted as 538 builds in the current month. Keep preview uploads deliberate and avoid redundant production releases.
- A fresh OpenSEO audit on 2026-11-15 crawled 7/7 pages with no crawl errors, critical issues, or warnings. The only findings are three informational canonicalization notices for product-selection query states that intentionally canonicalize to `/serum`.
- Fresh Lighthouse sample: desktop performance/accessibility/best-practices/SEO all 100 for home, serum, and privacy; mobile scores were home 100 and serum/privacy 99, with accessibility/best-practices/SEO 100 on all three. Mobile LCP measured approximately 1.23s (home), 2.08s (serum), and 0.95s (privacy) in this run. Treat these as one measured audit, not a guarantee for every device/network.

### Supabase boundary and backend readiness
- Store backend project is `Ghaioooth-core` (`oyoyozdugicmnkfhjovo`), region `eu-west-1`, status `ACTIVE_HEALTHY`. It is shared with a separate council/control-plane system; do not treat its general activity as Store traffic.
- The database currently records 19 applied migrations. PR #56 has now merged a read-only archive of the seven Store-specific applied migrations under `recovery/supabase-store-migrations/`; this is deliberately not a runnable Supabase CLI migration directory. Deployed Edge Function source still needs recovery/review before backend feature work or schema changes.
- The `rawaa_store` and `commerce` schemas are not exposed to `anon` or `authenticated`; both roles lack schema USAGE and table SELECT privileges. All inspected Store/control-plane tables have RLS enabled and no policies. For the inspected roles this is a private service-role access model, not an open-table exposure; do not add public policies just to silence the informational advisor.
- Current Edge Function metadata: `rawaa-owner-orders` v9 (JWT verification on), `rawaa-telegram-pair` v7 (on), `rawaa-telegram-test` v6 (on), `rawaa-outbox` v7 (off; scheduler/worker path), `rawaa-retention` v3 (off; scheduler path), and `commerce-api` v4 (off). The connector failed to retrieve deployed function source during this audit. Do not connect `commerce-api` to public checkout until its source, authentication, authorization, rate limiting, idempotency, and currency handling are reviewed.
- The public storefront still prepares a reviewable WhatsApp handoff; it does not create a database order. The owner dashboard explicitly remains in test/staging mode and says direct website order intake is not enabled. Do not describe the Store as having live automated order intake or fulfillment.
- The separate `commerce.orders` schema currently has a USD default currency, while the Store's approved currency is SYP. It has no Store orders at this audit. Treat this as a blocker before any use of the commerce spine; align currency and validate pricing/idempotency before connecting it.
- Supabase advisors reported an informational no-policy RLS notice across 17 tables, a warning that leaked-password protection is disabled, and a duplicate-index warning for `rawaa_store.orders` (`orders_closed_at_idx` / `orders_retention_idx`). Do not loosen RLS. Review the auth setting with the owner before changing sign-in behavior; reconcile the duplicate index through a versioned, reversible migration after restoring migration sources.
- The connected Supabase tool could list migration metadata and inspect catalog/grant metadata, but Edge Function source retrieval failed. Do not claim a full backend source audit until those deployed sources are recoverable.

### Analytics and design integrations
- Google Search Console remains connected to the verified URL-prefix property. The connected Google account currently exposes no GA4 properties to OpenSEO; GA4 is not connected, and Cloudflare Pages reports no Web Analytics tag. Do not invent a measurement ID or publish analytics code until a real property/stream is available and the privacy disclosure is reviewed.
- Figma MCP is connected, but the current Figma team seat reports View access. No Figma file key is recorded in this repository. Use it for read-only inspection only when a specific shared file is identified; do not claim design-file editing access.
- OpenSEO, GitHub, Cloudflare, Supabase, and Figma integrations are available in the current workspace. Prefer these existing integrations; do not add redundant paid analytics plugins before a concrete data/measurement requirement exists.

### Dependency and repository hygiene
- `package-lock.json` is still absent. Production validation currently installs Playwright without a committed lockfile, so the dependency tree is not reproducibly pinned and a complete lockfile-based vulnerability scan remains incomplete. Generate the lockfile in a real Node/npm environment, validate with `npm ci`, then add OSV scanning against the committed lockfile.
- The repository currently has 62 branches, including immutable backup/recovery checkpoints and numerous historical feature/automation/preview branches. Do not bulk-delete them. Inventory ancestry and artifact dependencies before retiring any non-backup branch.
- The GitHub integration could not read the main branch-protection endpoint during this audit (403); do not assume branch protection is enabled or disabled. Revisit with an authorized read path.

### Second Supabase project — isolated fallback audit — 2026-11-15
- A second active project exists: `raawaa-engine-fallback` (`xuwtuhfqjjwszxqkmivj`, `us-east-1`). It is not the same database as `Ghaioooth-core`.
- Its applied migration history is four entries: three `engine_fallback` ledger migrations and one `commerce_multi_store_spine` migration. It contains no `rawaa_store` schema.
- Function metadata: `engine-fallback` v5 (`verify_jwt=false`) and `commerce-api` v4 (`verify_jwt=false`). The Supabase connector's `get_edge_function` operation returned an internal protocol error for both functions, so deployed source and application-level authentication could not be verified.
- Read-only counts: `engine_fallback.tasks` 0, `audit_log` 0, `task_process_dispatches` 0, `heartbeat` 1; `commerce.orders`, `order_events`, and `rate_limits` all 0.
- `commerce.orders.currency` defaults to `USD`; unit cost defaults to 0 cents, courier cost to 200 cents, refusal cost to 100 cents. These are placeholders, not approved Raawaa values. Do not connect checkout to this schema or rely on these defaults.
- No `commerce-api` invocations appeared in the last-24-hour edge-log query on either Supabase project. This is not proof that an endpoint is safe or unused beyond that window.
- Decision: keep both projects isolated. `Ghaioooth-core` is actively used by the separate council/control-plane system; `raawaa-engine-fallback` is a separate fallback ledger with a dormant commerce spine. Neither is approved as the live Store order system until deployed function source, auth, currency, costs, and operational ownership are reviewed.
- Security advisor also reports Supabase Auth leaked-password protection disabled on `Ghaioooth-core`. Do not alter sign-in settings until the owner-auth flow and impact are reviewed.

- Cloudflare Web Analytics was checked through the account API on 2026-11-15: no Web Analytics sites are configured. Cloudflare documents the service as free and privacy-first, with no collection/use of visitor personal data, and Pages supports a one-click enablement. It is a candidate to replace the missing GA4 measurement for basic traffic/RUM, but it has not been enabled and the privacy notice must be reviewed before adding any analytics beacon.

- PR #55 is merged and deployed. Cloudflare Pages production smoke tests passed against the live site: global clickjacking/MIME/referrer/permissions protections are present; owner routes additionally return restrictive same-origin CSP, `Cache-Control: no-store`, and `X-Robots-Tag: noindex`. The site currently uses no Pages Functions, so the static `_headers` rules cover the site's responses.

- A deeper privilege check confirmed `commerce` has no `USAGE` grant for `service_role` and no table grants for `service_role`, `anon`, or `authenticated` in either project. By contrast, `rawaa_store` in `Ghaiooth-core` grants `service_role` schema usage and CRUD on its private tables. Therefore the deployed `commerce-api` cannot use the `commerce` schema through normal PostgREST service-role access as currently granted; it may be intentionally dormant or use a different access path. Do not add grants until the deployed function source and intended auth model are recovered.

- Edge Function source recovery was attempted through the Supabase connector (`get_edge_function` returned an internal protocol error). A temporary, read-only GitHub Actions recovery workflow also checked for the `SUPABASE_ACCESS_TOKEN` repository secret; it was absent, so both downloads were skipped. The temporary workflow was removed and no project or source files were changed. To complete this audit, the only missing access is a read-only Supabase access token with permission to download Edge Function source (or a source archive exported from the Supabase Dashboard). Never commit the token or place it in a source file.

- PR #58 is merged. The homepage now uses explicit, shorter motion transitions, respects `prefers-reduced-motion`, and exposes keyboard focus states. Store checks, Playwright browser checks, Graphify, and the mobile Lighthouse baseline all passed. The change was deployed with the validated `b37f20fd` main commit.
