# RAWAA Store — durable project memory

This file is the repository-backed memory that survives AI sessions, client changes, and expired hosted quotas. Keep it concise, factual, and updated when a material decision changes. It contains no credentials, customer records, or private order data.

## Canonical project
- Branch hygiene: the tested policy deletes unchanged merged PR heads, branches whose current history is contained in `main`, and exact reviewed superseded/stale refs. It preserves `main`, all `backup/*` and `recovery/*`, protected refs, open-PR heads, and unreviewed closed-unmerged work. See `docs/engineering/BRANCH-INVENTORY.md`, `docs/engineering/ARCHIVED-BRANCHES.md`, and `docs/engineering/TOOLING-REGISTRY.md`.

- Repository: `raawaa93/Raawaa`; `main` is the only canonical website source.
- Cloudflare Pages project: `raawaa-store`; current known URL: https://raawaa-store.pages.dev.
- Pages uses Direct Upload, not Git integration. Qualifying website-source pushes to canonical `main` run full validation and automatically deploy the validated commit to production.
- No manual dispatch, confirmation input, or GitHub Environment reviewer gate is part of the production release path. PRs and non-main branches never deploy. Exact-SHA checkout, latest-main freshness, clean-source, Cloudflare secret, and successful validation gates remain mandatory.
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
- Production deploy runs automatically on qualifying pushes to `main` after full validation; pull-request events and non-main branches never deploy. There is no manual confirmation input or approval-gated GitHub Environment. Preserve exact-SHA checkout, latest-main freshness check, clean-source check, and Cloudflare secret check. Never bypass a failed technical gate.
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
- Superseded by PR #59: `package-lock.json` is committed, `npm ci --ignore-scripts` was validated on Node 22, npm audit found zero vulnerabilities, and OSV Scanner v2.7.1 is active. See the latest maintenance entry below.

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
- Superseded by PR #59: the lockfile is committed and both npm audit and OSV Scanner are active; the current scan reported no dependency findings.


## Verified integration and release audit — 2026-11-15

### Production and quality gates
- Canonical `main` is `845ace2c45c0cc9aa70c9b4093bf4aa69780cc7f`. The latest production deployment remains `d00b2e27`, built from `032a62601e5a6925c8bc97889607b4804ebceb08` at 2026-11-15 03:58:13Z; PRs #65 and #53 changed only workflow/docs/validation files, so production deployment was correctly skipped.
- The latest Store checks, production release, and disaster-recovery backup workflow runs all completed successfully for that commit.
- Cloudflare Pages is deployed by GitHub Actions using Wrangler Direct Upload (deployment trigger `ad_hoc`; no Pages build command is configured). The deployment API showed 541 total historical deployment records at the latest check; this is not a monthly usage meter and must not be interpreted as 541 builds in the current month. Keep preview uploads deliberate and avoid redundant production releases.
- A fresh OpenSEO audit on 2026-11-15 crawled 7/7 pages with no crawl errors, critical issues, or warnings. The only findings are three informational canonicalization notices for product-selection query states that intentionally canonicalize to `/serum`.
- Fresh Lighthouse sample: desktop performance/accessibility/best-practices/SEO all 100 for home, serum, and privacy; mobile scores were home 100 and serum/privacy 99, with accessibility/best-practices/SEO 100 on all three. Mobile LCP measured approximately 1.23s (home), 2.08s (serum), and 0.95s (privacy) in this run. Treat these as one measured audit, not a guarantee for every device/network.

### Supabase boundary and backend readiness
- Store backend project is `Ghaiooth-core` (`oyoyozdugicmnkfhjovo`), region `eu-west-1`, status `ACTIVE_HEALTHY`. It is shared with a separate council/control-plane system; do not treat its general activity as Store traffic.
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
- Superseded by PR #59: production validation and Playwright CI now use `npm ci`; npm audit and OSV Scanner cover the locked dependency tree. Do not revert to mutable `npm install`.
- The repository currently has 62 branches, including immutable backup/recovery checkpoints and numerous historical feature/automation/preview branches. Do not bulk-delete them. Inventory ancestry and artifact dependencies before retiring any non-backup branch.
- The GitHub branch object reports `main.protected=false` and the repository rulesets endpoint returned an empty list. The connected app cannot administer branch protection (403); required checks are not enforced by a branch-protection rule at this snapshot.

### Second Supabase project — isolated fallback audit — 2026-11-15
- A second active project exists: `raawaa-engine-fallback` (`xuwtuhfqjjwszxqkmivj`, `us-east-1`). It is not the same database as `Ghaiooth-core`.
- Its applied migration history is four entries: three `engine_fallback` ledger migrations and one `commerce_multi_store_spine` migration. It contains no `rawaa_store` schema.
- Function metadata: `engine-fallback` v5 (`verify_jwt=false`) and `commerce-api` v4 (`verify_jwt=false`). The Supabase connector's `get_edge_function` operation returned an internal protocol error for both functions, so deployed source and application-level authentication could not be verified.
- Read-only counts: `engine_fallback.tasks` 0, `audit_log` 0, `task_process_dispatches` 0, `heartbeat` 1; `commerce.orders`, `order_events`, and `rate_limits` all 0.
- `commerce.orders.currency` defaults to `USD`; unit cost defaults to 0 cents, courier cost to 200 cents, refusal cost to 100 cents. These are placeholders, not approved Raawaa values. Do not connect checkout to this schema or rely on these defaults.
- No `commerce-api` invocations appeared in the last-24-hour edge-log query on either Supabase project. This is not proof that an endpoint is safe or unused beyond that window.
- Decision: keep both projects isolated. `Ghaiooth-core` is actively used by the separate council/control-plane system; `raawaa-engine-fallback` is a separate fallback ledger with a dormant commerce spine. Neither is approved as the live Store order system until deployed function source, auth, currency, costs, and operational ownership are reviewed.
- Security advisor also reports Supabase Auth leaked-password protection disabled on `Ghaiooth-core`. Do not alter sign-in settings until the owner-auth flow and impact are reviewed.

- Cloudflare Web Analytics was checked through the account API on 2026-11-15: no Web Analytics sites are configured. Cloudflare documents it as available on all plans; it collects minimal page-load timing metrics and does not track individual end users across customers. Its beacon still sends performance metrics and supports dimensions such as country, referrer, browser, device, and OS, so it is a candidate for basic traffic/RUM but has not been enabled pending privacy-notice review and CSP changes.

- PR #55 is merged and deployed. Cloudflare Pages production smoke tests passed against the live site: global clickjacking/MIME/referrer/permissions protections are present; owner routes additionally return restrictive same-origin CSP, `Cache-Control: no-store`, and `X-Robots-Tag: noindex`. The site currently uses no Pages Functions, so the static `_headers` rules cover the site's responses.

- A deeper privilege check confirmed `commerce` has no `USAGE` grant for `service_role` and no table grants for `service_role`, `anon`, or `authenticated` in either project. By contrast, `rawaa_store` in `Ghaiooth-core` grants `service_role` schema usage and CRUD on its private tables. Therefore the deployed `commerce-api` cannot use the `commerce` schema through normal PostgREST service-role access as currently granted; it may be intentionally dormant or use a different access path. Do not add grants until the deployed function source and intended auth model are recovered.

- Edge Function source recovery was attempted through the Supabase connector (`get_edge_function` returned an internal protocol error). A temporary, read-only GitHub Actions recovery workflow also checked for the `SUPABASE_ACCESS_TOKEN` repository secret; it was absent, so both downloads were skipped. The temporary workflow was removed and no project or source files were changed. To complete this audit, the only missing access is a read-only Supabase access token with permission to download Edge Function source (or a source archive exported from the Supabase Dashboard). Never commit the token or place it in a source file.

- PR #58 is merged. The homepage now uses explicit, shorter motion transitions, respects `prefers-reduced-motion`, and exposes keyboard focus states. Store checks, Playwright browser checks, Graphify, and the mobile Lighthouse baseline all passed. The change was deployed with the validated `b37f20fd` main commit.

- PR #59 is merged. `package-lock.json` now pins the Playwright toolchain to `@playwright/test@1.65.1`; lock generation validated `npm ci` and `npm audit --audit-level=high` reported zero vulnerabilities. Playwright CI and production validation now use `npm ci`; dependency/test-only changes no longer trigger a static-site production deployment. Google's OSV-Scanner v2.7.1 now runs on dependency PRs/merge groups and weekly on main.
- PR #61's proposal to make production releases manual-only was closed after checking `AGENTS.md`: canonical-main automatic releases after complete validation are the owner-approved policy. Preserve that policy and its exact-SHA, clean-source, freshness, Cloudflare-secret, and technical release gates.


### Maintenance updates after the November 14 baseline

- PR #54: replaced unsafe dynamic evaluation in the owner pricing editor with JSON parsing and added a deep-link regression test; production deploy was validated.
- PR #57: removed duplicate Store-check and Playwright workflows from main pushes. PRs and recovery/restore branches still run them; production CI remains the single main-branch release validation path.
- PR #59: committed `package-lock.json`, switched CI to `npm ci`, added npm audit and OSV Scanner v2.7.1; npm audit and the OSV scan both reported no dependency findings. Dependency/test-only changes no longer trigger a static-site production deployment.
- PR #55 production response-header smoke test passed against the deployed Pages origin, confirming the strict owner CSP, no-store/noindex, X-Frame-Options, Permissions-Policy, Referrer-Policy, and nosniff headers.
- PR #56 migration archive and its recovery-only workflow changes are in main; the backup artifact after merge includes the archive. No SQL was executed.

- PR #64 strengthened the stale-release guard: a validated release can tolerate only intervening documentation, recovery, workflow, dependency, test, or validation-only commits; any changed production source/configuration/build file still blocks deployment. The earlier run for PR #62's SHA was correctly blocked when main moved, and the subsequent validated run for `032a6260` deployed successfully.
- PR #65 is merged. The production workflow excludes workflow-only changes from deployment triggers and automatically releases qualifying website-source changes after successful validation; no manual dispatch or confirmation input is present.


## Verified tooling and discovery update — 2026-11-15

- PR #53 merged as `845ace2c45c0cc9aa70c9b4093bf4aa69780cc7f`; PR #67 subsequently aligned project memory with canonical main as `2f11981bb9b9fac4fe59cd88a4dc9920ce4d8560`. Both were documentation/CI-only. The latest confirmed production deployment remains Cloudflare Pages deployment `d00b2e27-4d3a-4486-9ff8-0bb27a656339`, from validated source SHA `032a62601e5a6925c8bc97889607b4804ebceb08`. Do not interpret later docs-only commits as new storefront releases.
- GitHub Actions run [#43674768876](https://github.com/raawaa93/Raawaa/actions/runs/43674768876) completed successfully and generated 12 Lighthouse reports across four storefront URLs. It emitted advisory warnings for cache insight, document latency, image delivery, render blocking, unminified CSS/JS, unused CSS/JS, FCP/LCP, and SEO crawlability; these are not test failures. The separate latest OpenSEO audit [f2734602](https://app.openseo.so/p/8609bf87-b153-41f8-b10c-c716c36a5c4f/audit?auditId=f2734602-dfd8-4ef5-8472-aaf709d9ec01) crawled 7/7 pages and reported only three informational canonicalized product-query URLs. Its measured mobile Lighthouse scores were home 100, privacy 99, serum 99; desktop 100 for all three. Mobile LCP was approximately 1.23s, 0.95s, and 2.08s respectively. These are single-run measurements, not guarantees.
- Search Console remains connected to the verified URL-prefix property `https://raawaa-store.pages.dev/`, but the last three months returned zero clicks and impressions. URL inspection returned “URL is unknown to Google” for home, serum, privacy, and campaign. The current sitemap contains only home, serum, and privacy, and robots.txt references it. On 2026-11-15, IndexNow successfully submitted home, serum, and privacy to supported IndexNow engines; this does not notify Google. Google sitemap submission and indexing requests remain outstanding and must be performed through Search Console when an authorized write path is available.
- No GA4 property is exposed by the connected Google account. Cloudflare Web Analytics site configuration was created for `raawaa-store.pages.dev` with `auto_install=false`; no beacon has been injected and no analytics collection is active. Do not install the snippet until the privacy disclosure and Content Security Policy are reviewed and updated together.
- Current connected service balances observed on 2026-11-15: OpenSEO 424 credits remaining; Firecrawl 0 credits remaining (plan allowance 1,000; current period ends 2026-11-29). Avoid further Firecrawl calls until the quota renews or the balance changes.
- The connected Supabase account lists only `raawaa-engine-fallback` and `Ghaiooth-core`; neither is confirmed as the Store database. Do not run Store database operations against either project. The Store-specific deployed Edge Function source recovery blocker remains unresolved.
- Figma MCP is connected, but the account reports a View seat on its team. Treat it as read-only until edit permissions are available. Playwright, Chromium/WebKit browser coverage, Graphify offline code indexing, and Lighthouse CI already exist in the repository; do not duplicate them with overlapping tools.
- Reviewed design/agent skill sources: Emil Kowalski `emil-design-eng` and Taste Skill are MIT; selected Anthropic skills such as `frontend-design` and `webapp-testing` carry Apache-2.0 license files; EveryInc Compound Engineering is MIT. Use Emil's interaction-polish guidance selectively. Taste Skill 2.5.1 is a large bundle with scripts/assets and several blanket rules that conflict with RAWAA's required conceptual-image disclosures and verified contact details; do not bulk-import or apply it unchanged. These sources have been reviewed for this session but are not installed into the hosted ChatGPT runtime. The repository's existing `AGENTS.md` remains the persistent agent guidance.
- Memory/tooling decision: retain repository-backed `PROJECT-MEMORY.md` as the durable source of truth and Graphify as the regenerable code map. ProjectMem and MCP Memory Service remain local-only candidates; neither is connected to this hosted session. Do not add Graphiti, Mem0, Cognee, or Letta without a concrete requirement and a persistent runtime/database, because they overlap the existing memory model and add service/embedding complexity.


## Current tool, SEO, and market audit — 2026-11-15 04:22 UTC

- OpenSEO balance after the latest live audit and regional keyword research: 251 credits. Firecrawl remains at 0 credits; its current/historical endpoint counters do not reconcile, so treat it as exhausted until renewal. Ahrefs shows 200,000 API units but keyword/location endpoints return `Insufficient plan`; only the public Domain Rating endpoint was usable in this audit.
- The live OpenSEO audit `5f5a4013-0115-4580-8d00-53615d3a71c1` crawled 7/7 pages. Home, serum, privacy: desktop Lighthouse 100 each; mobile 100, 99, 98; accessibility, best practices, SEO 100 each. Mobile LCP: 1.16s, 2.16s, 0.94s. Only three informational canonicalized serum-query variants were reported.
- Search Console currently reports zero clicks/impressions over the last three months and URL Inspection says home, serum, privacy, and campaign are unknown to Google. Sitemap exists in repo and robots.txt references it, but Google sitemap submission/request-indexing is not confirmed through the read-only integration. IndexNow successfully submitted home, serum, privacy to supported engines; not Google.
- Syria is unsupported by the current keyword location providers. OpenSEO's Arabic seed `سيروم شعر` produced Saudi and Egypt proxy estimates of 22,200 and 12,100 monthly searches; these are not Syrian volumes. Do not label them as Syria demand.
- Global product-page benchmark: Mielle Rosemary Mint Oil (2 oz, published $9.99), The INKEY List Caffeine Scalp Treatment (150 ml, published £15), Kérastase Genesis Serum (90 ml), Moroccanoil Treatment Original (100 ml, published £38.50). Competitors consistently provide ingredients, use instructions, FAQs/routines, and customer reviews. RAWAA's 30/50/100 ml size ladder is sound; real product photography, full INCI, approved blend-specific usage, and real reviews remain the main content gaps.
- Free Ahrefs DR snapshot: RAWAA pages.dev 0; Mielle 72; The Ordinary 79; INKEY 54; Kérastase 72; Moroccanoil 79; Briogeo 70. DR is a third-party comparative metric, not a Google ranking factor.
- Latest Graphify: 299 nodes, 626 edges, 23 communities across 29 code files; generated assets, recovery archives, and workflows remain intentionally excluded. Latest backup artifact: 12.96 MB, 90-day retention.
- Visual QA on the isolated preview built from canonical main (run `43675783829`) found no HTTP, page-JS, failed-request, broken-visible-image, missing-font, or horizontal-overflow issues. It failed only on 20 WebKit console errors from Playwright screenshot `animations: 'disabled'` injecting a CSP-blocked inline stylesheet; do not weaken site CSP. PR #71 removed that option and added viewport-height diagnostics; fresh visual run #43677078729 is in progress and must be inspected before marking QA complete.
- Cloudflare Web Analytics configuration exists for `raawaa-store.pages.dev` with `auto_install=false`; no beacon or data collection is active pending privacy/CSP review. Figma MCP remains View-seat only. Supabase projects visible remain unconfirmed as the Store database.
- Branch-cleanup policy: retire exact reviewed same-repository merged PR heads when unchanged; moved merged heads require GitHub compare `ahead_by=0`. Exact reviewed closed-unmerged superseded refs may be retired after their replacements are verified on main; a reused branch with later unmerged work requires `ahead_by=0`. Stale no-PR refs require an exact allowlist and `ahead_by=0`. Preserve backup/*, recovery/*, restore/*, release/*, production-deploy/*, deploy/*, active preview-deploy/*, all open-PR heads, and unknown work.

## Branch cleanup outcome and policy correction — 2026-11-15 04:33 UTC

- PR #70 merged at 04:28 UTC. Run #43676889692 inspected 84 branches/72 PRs, completed 15 ancestry comparisons, deleted 55 refs with zero failures (54 merged-PR heads plus one closed-unmerged branch whose head was already in main). Follow-up run #43676951048 inspected 29 branches and deleted zero.
- Three operational/historical checkpoints were included in the first allowlist by mistake and were immediately restored at their exact original PR head commits: restore/integrated-store-2026-11-14 (b74fcf3dadecf52c0c40ce848ef67b104d7f73ec), release/clean-pages-payload-2026-11-14 (8cba6b94ce39282999d3c4c86ca2a60845c805a2), and preview-deploy/visual-qa-current-2026-11-15 (7ca62ffaaf2be5fd337255d66679621be399ddae). No backup/* or recovery/* refs were deleted; four backup and three recovery refs remain.
- At the first cleanup snapshot, ten closed-unmerged refs and four no-PR refs remained because the original policy required ancestry proof. Net refs retired after restoration: 52. This was a historical snapshot (35 refs, 75 PRs), superseded by the current inventory in docs/engineering/BRANCH-INVENTORY.md.
- PR #73 was closed without merge. PR #74 merged at 04:35 UTC and added regression tests plus protections for restore/*, release/*, production-deploy/*, deploy/*, and active preview-deploy/* refs. PR #77 now completes the reviewed cleanup allowlist: 57 merged refs, 12 exact superseded closed-unmerged refs (with reused QA branch still requiring ancestry proof), and four stale no-PR refs. Current snapshot: 37 refs, 77 PRs (63 merged, 13 closed-unmerged, one open PR #77). After PR #77 merges, the next cleanup should remove 18 exact refs and leave approximately 19; verify the actual run and branch listing.
- PR #71 fixed the visual audit harness by removing Playwright screenshot animations: disabled, which caused 20 WebKit CSP console errors. The site CSP remains strict. Run #43677078729 is the fresh visual audit against canonical main SHA d4e6c066; its report still requires inspection.


## Repository and workspace cleanup — 2026-11-15 04:42 UTC

- PR #74 merged and protects operational namespaces. Post-protection cleanup run #43677406307 inspected 35 refs, completed 12 ancestry comparisons, found zero candidates, and succeeded.
- PR #77 is open. It adds exact cleanup allowlist entries for merged PR heads #71, #74, #75, and #76; a no-PR docs branch proven ahead_by=0/behind_by=3; and its own branch after merge. The open-PR guard protects PR #77's branch until merge.
- The cleanup classifier now requires ahead_by=0 for every reviewed closed-unmerged ref, moved merged ref, and no-PR ref. Its workflow explicitly performs comparisons for reviewed closed-unmerged candidates. Tests cover this safety rule.
- Superseded by the 2026-11-15 branch archive audit: current snapshot is 21 refs and 101 PRs (72 merged, 28 closed-unmerged, 1 open); 29 refs have already been archived with verified annotated tags, and three exact-SHA refs remain for the next archive run.
- Workspace inventory: 801 tool definitions across 24 integration families and 151 available skills. The repository contains no project-local .agents/skills, skills/, or .claude/ packages. Global skills and integrations are shared across projects; do not uninstall them based only on RAWAA activity.
- Current balances: OpenSEO 251 credits; Firecrawl 0/1,000 through 2026-11-29; Ahrefs Free API key 0/200,000 units, workspace quota 0; public Domain Rating endpoint costs zero and keyword endpoints are plan-restricted. Figma remains View-only; Notion's advanced connector search/data-source tools require Business/Enterprise. No billing enabled.
- Store Supabase database remains unidentified among visible projects; no Supabase writes were made. Cloudflare Web Analytics remains configured with auto_install=false and no beacon. No DNS, customer data, secrets, prices, discounts, or shipping policy changed.

## Repository and integration hygiene — 2026-11-15 (pre-archive snapshot)

- GitHub repository hygiene now separates ancestry-safe merged-ref pruning from recoverable archival of reviewed inactive refs. The archive workflow writes annotated tags before deleting branch refs; open PR heads and backup/recovery/deploy/preview namespaces are retained.
- Archive run #43680881436 completed successfully: 29 exact-SHA annotated tags were created and verified, 29 branch refs were archived and deleted, and the merged archive-workflow branch was pruned. The canonical recovery index is `docs/engineering/ARCHIVED-BRANCHES.md`.
- Cloudflare Store Worker `raawaa-store` had no routes, custom domains, bindings, or schedules and recorded zero invocations over the previous 30 days. Its `workers.dev` subdomain was disabled; the Worker script and deployment metadata remain as rollback material because source export was unavailable.
- Cloudflare Pages remains the Store production host. No DNS, custom-domain, Supabase database, queue, secret, customer, or order data was changed.
- The account-wide tooling catalog is not equivalent to Store integrations. Keep shared-project resources intact unless ownership and dependencies are confirmed; use the Tooling Registry as the current connection/quota/permission inventory.


## Current repository and integration state — 2026-11-15 05:55 UTC

- PR #100 merged the exact-SHA archive workflow. Run #43680881436 succeeded: 29 annotated tags verified and 29 branch refs archived/deleted; the merged archive-workflow branch was also pruned. The current inventory is 21 branch refs: 17 operational refs, three SHA-pinned archive candidates, and the active PR #101 branch.
- PR #101 is open from `maintenance/final-workspace-hygiene-2026-11-15`. It restores the exact Google Search Console HTML verification asset, asserts that the clean Cloudflare Pages payload contains it unchanged, adds a regression test, and consolidates the archive/branch/tool/skill inventories. Merge only after Store checks, Playwright, mobile performance, and Graphify checks complete successfully.
- Three archive candidates are pinned to exact SHAs in `scripts/branch-archive-policy.cjs` and `docs/engineering/ARCHIVED-BRANCHES.md`: `docs/workspace-hygiene-2026-11-15` (`10e76ec9ed8de51cca6aad0451281f18513615b0`), `fix/visual-audit-top-viewport-clean-2026-11-15` (`c0ccb2db0657d414885e68f16b8b79c9f73b4531`), and `maintenance/archive-inactive-branches-final-2026-11-15` (`ad3aaa80e47f2a4d823d85123f30c27726fb206d`). The PR #101 branch is in the exact merged-head allowlist and is pruned only after its head is merged.
- The canonical archive record is `docs/engineering/ARCHIVED-BRANCHES.md`; the duplicate `BRANCH-ARCHIVE-MANIFEST.md` was removed. The canonical skill inventory is `docs/engineering/SKILL-REGISTRY.md` (151 workspace Skills); the tooling registry is `docs/engineering/TOOLING-REGISTRY.md`.
- Workspace catalog: 801 tool definitions across 24 integration families and 151 Skills. These are shared workspace capabilities, not project-local packages. No global plugin, connector, or Skill was removed; the connected management tools do not provide a complete project-scoped dependency inventory or safe bulk-uninstall action. TinyFish remains prohibited.
- Free quota snapshot: OpenSEO 251 credits; Firecrawl 0/1,000 until 2026-11-29; Ahrefs API allowance 200,000 units with 0 used and workspace quota 0. Figma is View-only; Notion advanced connector actions are plan-limited. No paid billing was enabled.
- Cloudflare inventory: seven Worker scripts, three D1 databases (zero tables reported), two Queues, zero KV namespaces. R2 is not enabled; its buckets endpoint returns HTTP 403, so the bucket count is unknown. The Store Worker has no routes/bindings/schedules or recent invocations; its workers.dev subdomain is disabled. Web Analytics remains configured with `auto_install=false`; no beacon is installed.
- GitHub reports `main.protected=false` and no repository rulesets. The connected app cannot configure protection (403); enable required status checks and branch protection in repository Settings.
- No DNS, custom-domain, Supabase schema, secrets, customer/order data, pricing, discounts, shipping policy, or billing settings were changed.


## Final repository and integration state — 2026-11-15 06:00 UTC

- PR #101 restored the Google Search Console verification HTML, its clean Pages payload assertion, and regression test. Production deployment ID `b2923438-ad03-4c5a-816d-240fa6b5bbfd` succeeded from commit `db1e0b131f596208b10e2e9c951d1f22c9beb916`; deployment URL: `https://b2923438.raawaa-store.pages.dev`. The 188-file payload included the verification HTML and post-deploy security headers passed.
- PR #102 merged the final 17-branch/32-tag inventory and cleared the completed archive allowlist. Current main is `88404f1c02dcc3db3768ab615d4a175f836d398c`.
- Current live refs: 19 — 17 durable operational refs and two temporary documentation refs. PR #103 is the only open PR. The old `docs/final-branch-inventory-2026-11-15` ref now points exactly to main and is allowlisted for pruning; the `docs/final-tooling-state-2026-11-15` ref is the PR #103 head. After merge, both refs are pruned, leaving 17.
- All 32 exact-SHA recovery tags are verified and indexed in `docs/engineering/ARCHIVED-BRANCHES.md`. The archive allowlist is empty; no archive candidate remains.
- Search Console URL-prefix property `https://raawaa-store.pages.dev/` is visible with `siteOwner` permission. The separate domain property `sc-domain:raawaa-store.pages.dev` remains unverified.
- Final validation succeeded: Store checks, Playwright Chromium/WebKit, main Lighthouse audit (12 reports), Graphify, repository backup, production validation/deployment, and post-deploy security-header checks.
- Workspace inventory: 801 tool definitions across 24 integration families and 151 available Skills across 15 provider packages. Canonical inventories: `docs/engineering/TOOLING-REGISTRY.md` and `docs/engineering/SKILL-REGISTRY.md`. No global plugin, connector, or Skill was removed because these are shared workspace resources and there is no complete project-scoped dependency map. TinyFish remains prohibited.
- Free quota snapshot: OpenSEO 251 credits; Firecrawl 0/1,000 until 2026-11-29; Ahrefs API allowance 200,000 units with 0 used and workspace quota 0. Figma is View-only; Notion advanced connector actions are plan-limited. No paid billing enabled.
- Cloudflare: seven Worker scripts, three D1 databases (zero tables reported), two Queues, zero KV namespaces. R2 is not enabled; its buckets endpoint returns HTTP 403, so bucket count is unknown. The Store Worker has no routes/bindings/schedules or recent invocations; its workers.dev subdomain is disabled. Web Analytics remains configured with `auto_install=false`; no beacon is installed.
- GitHub reports `main.protected=false` and no repository rulesets. The connected app cannot configure protection (403); enable required status checks and branch protection in repository Settings.
- No DNS, custom-domain, Supabase schema, secrets, customer/order data, pricing, discounts, shipping policy, or billing settings were changed.

## Final repository and tooling state — 2026-11-15 05:53 UTC

- Canonical main: `41a37816b3e491cfa38bf8f8c81af9092f3b586a` (PR #105 merged).
- [Final branch-hygiene run #43682885648](https://github.com/raawaa93/Raawaa/actions/runs/43682885648) succeeded. The final superseded maintenance branch was preserved at its exact SHA and retired.
- Final steady state: **17 branch refs**, **33 annotated recovery tags**, **105 PRs total (76 merged, 29 closed-unmerged)**, **zero open PRs**, and no inactive unprotected working refs.
- The 17 remaining refs are the canonical `main`, four backups, three recovery refs, two deploy checkpoints, four preview checkpoints, one production-deploy checkpoint, one release checkpoint, and one restore checkpoint.
- Production release after PR #101: deployment `b2923438-ad03-4c5a-816d-240fa6b5bbfd`, source `db1e0b131f596208b10e2e9c951d1f22c9beb916`, URL `https://b2923438.raawaa-store.pages.dev`. Payload contained 188 files; post-deploy security-header checks passed.
- Visual QA run #43682151818 completed 16 Chromium/WebKit × iPhone/desktop page captures across home, serum, campaign, and privacy: all navigations 200, zero console errors, zero page errors, zero CSP violations, zero failed requests, zero bad responses, zero horizontal overflow, and zero broken images.
- Mobile Lighthouse audit passed with advisory findings: home 99 median (one 77 outlier), serum 86–87, campaign 96–97, privacy 100. Accessibility and best-practices scores were 100 throughout; campaign SEO 69 is expected because that page is intentionally noindex.
- Search Console URL-prefix property `https://raawaa-store.pages.dev/` remains `siteOwner`; domain property `sc-domain:raawaa-store.pages.dev` is unverified.
- Workspace catalog: 801 tool definitions across 24 integration families and 151 Skills across 15 packages. Canonical inventories: `TOOLING-REGISTRY.md` and `SKILL-REGISTRY.md`. TinyFish remains prohibited. No global plugin, connector, or Skill was removed because they are shared resources and no complete cross-project dependency map is available.
- Free quota snapshot: OpenSEO 251 credits; Firecrawl 0/1,000 until 2026-11-29; Ahrefs API allowance 200,000 units with 0 used and workspace quota 0. Figma remains View-only; Supabase Store database is still unidentified; no paid billing was enabled.
- **Security follow-up:** GitHub reports `main.protected=false` and no repository rulesets. The connected GitHub app cannot configure branch protection (403). Enable required status checks and branch protection in repository Settings or provide an authorized GitHub connection. No security control was bypassed.
- No DNS, custom-domain, Supabase schema, secrets, customer/order data, pricing, discounts, shipping policy, or billing settings were changed.


## Operational follow-up — 2026-11-15 05:56 UTC

- Repository hygiene is closed: 17 live durable branches, 33 verified exact-SHA recovery tags, zero open PRs. The authoritative inventory is `docs/engineering/BRANCH-INVENTORY.md`.
- Latest docs-only inventory correction is commit `74762017ceea2c0344dd4273319f1ecd4115a89c` on `main`; it does not represent a production release.
- Cloudflare Pages `raawaa-store` latest production deployment remains `b2923438-ad03-4c5a-816d-240fa6b5bbfd`, source `db1e0b131f596208b10e2e9c951d1f22c9beb916`, deployment stage success. The Pages custom domain `rawaa.eu.org` is still pending because its CNAME is absent; DNS was not changed.
- GitHub `main` branch protection remains unresolved. The repository's recorded audit found no protection/rulesets and the connected app was denied permission to configure them (403). Configure required checks through an authorized GitHub settings session; do not infer success from empty commit-status results.
- No production source, prices, discounts, delivery policy, customer/order data, Supabase data, secrets, billing, or DNS was changed in this follow-up.


## Order, payment, and backend audit — 2026-11-15

- Read-only source review confirms the storefront builds a WhatsApp handoff link from the cart; the customer reviews and sends the message. This does not create a server-side order record, payment transaction, stock reservation, or automated order confirmation.
- Payment options in the storefront are Sham Cash (10% discount only) and cash on delivery (no Sham Cash discount). Delivery is configured as free across both delivery zones and both payment methods. Preserve these rules exactly.
- The Sham Cash wallet number is blank in the current configuration; do not invent or insert a wallet number. The transfer receipt is verified manually after the customer contacts the store.
- Product ingredient descriptions explicitly state they are summaries, not complete INCI lists. Do not invent an INCI declaration, formula percentages, manufacturing credentials, or supplier provenance. Actual supplier/manufacturer documents are required before publishing those details.
- Product imagery is explicitly described as conceptual packaging artwork, not verified physical-product photography. Keep that disclosure until genuine product photos are supplied.
- Privacy page is still marked as a draft requiring review for the Syrian market. The current code path has no online payment gateway, customer accounts, store database, or server-side order storage; WhatsApp is an external handoff chosen by the customer.
- Supabase read-only inspection of both connected projects confirms neither is the Store database: `raawaa-engine-fallback` (`xuwtuhfqjjwszxqkmivj`) has no public tables; `Ghaiooth-core` (`oyoyozdugicmnkfhjovo`) contains council/provider/task tables unrelated to storefront orders. Do not write to either project or connect them to checkout.
- Next implementation boundary: only add order storage/payment integration after the owner selects the intended backend and a recoverable schema/security design is approved. Until then, keep the existing WhatsApp handoff and manual confirmation model.


## Domain and web-crawling research — 2026-11-15

- Supersedes the earlier 05:56 note that said the Pages CNAME was absent. A later read-only Cloudflare API audit found a CNAME record exists inside the pending zone: `rawaa.eu.org -> raawaa-store.pages.dev`. Pages still reports the domain pending with "CNAME record not set"; the zone itself is `pending` with activation failure `unresolvable`, so the Cloudflare-hosted record is not validating in public DNS.
- Cloudflare account inventory: exactly one Pages project (`raawaa-store`) and one zone (`rawaa.eu.org`). The Pages custom-domain binding and DNS record were both created 2026-11-14; DNS comment explicitly labels it "Raawaa Store Pages custom domain". Assigned nameservers: `carl.ns.cloudflare.com`, `irma.ns.cloudflare.com`.
- This is evidence that the domain was deliberately configured for Raawaa Store, but not proof of external registration ownership or present-day owner intent. No DNS, Pages binding, zone, nameserver, certificate, or registrar setting was deleted. Preserve until the domain registrant/owner intent is verified; if owner confirms it is not for this store, remove only the Pages binding and CNAME first, and do not delete the whole zone until external dependencies are checked.
- The repo's code search returned no hits for `rawaa.eu.org` or `raawaa-store.pages.dev`, but GitHub reports this repository is not code-search indexed. Do not present this as a complete repository-wide scan.
- Added `docs/engineering/WEB-CRAWLING-TOOLING-RESEARCH.md` at commit `94cb3e477de1ad54b1581b37af9f0c8736669234`. It ranks 19 direct crawler/browser/monitoring projects, records approximate GitHub stars and licenses, reviews the plugin directory, and recommends Crawl4AI + Scrapling + Crawlee + Playwright + changedetection.io as a free/open-source-first stack.
- Plugin directory search returned Firecrawl (already installed) and TinyFish (excluded by owner); no other dedicated crawling plugin was found in the matching searches. Do not use TinyFish.
- Connected Firecrawl quota endpoint currently reports 0 remaining of 1,000 plan credits, with billing period ending 2026-11-29. Prefer self-hosted/local alternatives and avoid assuming a hosted free quota is currently available.
- No crawler was installed or deployed in this turn. The research is recorded; deployment requires choosing a runtime/hosting location and estimating compute, memory, storage, and legal crawl scope first.


## Execution checkpoint — 2026-11-15 (live verification)

### Repository and automation
- Current canonical `main`: `fe98d30d8bb3bc9511b64214926e96903327122d`.
- Live GitHub enumeration confirms **17 branches**, **0 open pull requests**, and the 17 remaining refs are the documented durable backup/recovery/deploy/preview/release/restore checkpoints plus `main`. No further branch deletion or consolidation is justified.
- All 17 branch refs currently report `protected=false`; the repository rulesets endpoint returns an empty list. This confirms branch protection is still unresolved, not merely an old note. The available GitHub connection has previously been denied the required administrative write permission (403); do not attempt to bypass this boundary.
- Latest documentation commit triggered and completed the expected repository branch-hygiene, codebase-graph, and disaster-recovery-backup workflows successfully (runs #43683576809, #43683576836, #43683576862). It did not trigger the production validation/deploy workflow because the changes were documentation-only.
- Latest commit's legacy commit-status endpoint is empty/pending; that is not a failed check and not evidence of a successful production validation. The relevant workflow runs are the successful checks tied to the actual production source commit below.

### Production and quality verification
- Cloudflare Pages production still points to deployment `b2923438-ad03-4c5a-816d-240fa6b5bbfd`, source `db1e0b131f596208b10e2e9c951d1f22c9beb916`, with deployment stage `success`. No newer production deployment was found.
- For that deployed source, GitHub checks confirm successful canonical-main validation, automatic production release, mobile performance audit, and visual QA. Visual QA run #43682151818 produced 16 Chromium/WebKit × iPhone 13/desktop captures across home, serum, campaign, and privacy. The downloaded report contains **zero issues**, all 16 navigations returned HTTP 200, and no console/page/CSP/network errors, broken images, or horizontal overflow were reported.
- Lighthouse CI was run against the local built site in GitHub Actions, not directly against the live public URL. Accessibility and best-practices scored 100 across pages. Home performance varied (median around 99, one low outlier); serum performance was 85–86 with LCP around 3.8–4.0 seconds; campaign performance was 96; privacy performance was 100. Campaign SEO score 69 is expected because `campaign.html` explicitly declares `noindex,follow` and is intentionally absent from the sitemap. Do not remove that directive without a deliberate indexing decision.
- The serum Lighthouse sample identifies an oversized fallback bottle image (`rawaa-olive.jpg`, 928×928, 86 KB) with estimated savings of about 76 KB at its displayed size. The HTML preloads a different `size-50-v6` image that is not the actual initial bottle image. This is a modest, actionable responsive-image/preload cleanup; the measured 2.4-second TTFB came from the CI local-server run and must not be treated as a verified live-production TTFB.

### Domain and crawler runtime
- Current Cloudflare API re-check: the only Pages project is `raawaa-store`; its only custom domain is `rawaa.eu.org`, still pending with `CNAME record not set`. The only zone is also pending with activation failure `unresolvable`. The configured CNAME inside the inactive zone points to `raawaa-store.pages.dev` and is annotated for Raawaa Store. This is positive evidence of an intentional store binding, not proof of external domain registration ownership. Keep it unchanged until the registrant/owner intent is confirmed; if the owner confirms it is not for this store, remove only the Pages binding and corresponding CNAME first, then review whether the zone itself can be retired.
- The free/open-source crawler research is committed at `docs/engineering/WEB-CRAWLING-TOOLING-RESEARCH.md`. No crawler engine has yet been installed or deployed. Firecrawl is connected but currently has 0 of 1,000 credits remaining through 2026-11-29; TinyFish remains prohibited. The next technical decision is a no-paid-runtime execution model (for example, a bounded scheduled GitHub Actions job using Crawl4AI, with artifacts rather than a permanent database) and a confirmed list of public target URLs. Do not add a persistent hosted service or paid LLM dependency by default.

### Remaining launch and operations blockers (not safe to invent)
1. Enable `main` branch protection and require the actual production validation checks through an authorized GitHub Settings session.
2. Confirm whether `rawaa.eu.org` is owned/controlled for this store before retaining or detaching it; the current Cloudflare binding is store-specific.
3. Supply the real Sham Cash wallet number if that payment route is to be operational; the repository intentionally leaves it blank.
4. Provide verified full ingredient/INCI data, product/manufacturer/supplier documentation, and genuine product photographs before replacing the current conceptual packaging artwork or expanding formula claims.
5. Review and approve the privacy notice for the actual operating jurisdiction and business process.
6. Decide whether the store should remain a WhatsApp handoff or gain server-side order storage/payment. Neither connected Supabase project is confirmed as the Store database; do not connect either one or create checkout storage until the correct backend and security/backup design are selected.
7. Optionally improve serum first-screen image delivery using responsive AVIF/WebP variants and a matching preload, then rerun Playwright, Lighthouse, and visual QA before release.

No branch, DNS record, Pages domain binding, Supabase data, secret, customer/order data, price, discount, delivery rule, or billing setting was changed during this checkpoint.


## Execution checkpoint — 2026-11-15 06:23 UTC

### Deployment and quality
- Latest successful Cloudflare Pages production deployment: `44ff2ce7-0379-4311-86aa-43be465fdb75`, URL `https://44ff2ce7.raawaa-store.pages.dev`, source `adbc74f31801afa92a37c83dcb1c7698e1248c3e`, production branch `main`. Validation and deploy jobs both passed; the final live Security Headers verification step passed.
- Visual QA run `43684775744` completed successfully against `https://raawaa-store.pages.dev`: 16 Chromium/WebKit × iPhone 13/desktop captures across home, serum, campaign, and privacy; zero issues, no reported console/page/CSP/network errors, broken images, or horizontal overflow. Artifact: https://github.com/raawaa93/Raawaa/actions/runs/43684775744.
- Lighthouse CI remains a local-built-site benchmark, not a direct live-production measurement: accessibility and best-practices 100; home performance around 99 with one outlier; serum 85–86; campaign 96 (intentional `noindex,follow`); privacy 100. Serum first-screen image optimization is optional follow-up; the measured TTFB outlier was from the CI runner, not verified live TTFB.

### Competitor crawl
- The free Crawl4AI 0.9.5 workflow is merged and runs on GitHub-hosted runners; 10 exact public URLs, Monday 05:17 UTC schedule, manual dispatch, robots checks, 3-second sequential pacing, no LLM/API key, no paid crawler service, no proxy/stealth/CAPTCHA bypass. Artifacts retained 30 days.
- Latest run `43684667793` succeeded: **9/10 pages HTTP 200**. The official Kérastase UK URL returned HTTP 307 with a Cloudflare JavaScript challenge; it was not bypassed. Artifact: https://github.com/raawaa93/Raawaa/actions/runs/43684667793.
- Dated benchmark and marketing-positioning notes are saved in `docs/engineering/COMPETITOR-CRAWL-SNAPSHOT-2026-11-15.md`. Treat page metadata prices as selected-variant hints: OUAI/Gisou/Moroccanoil metadata returned smaller/default variants; Feel22's visible page showed SYP 2,460 while its Open Graph metadata said USD 16.40. Prefer rendered page/variant data over metadata alone.
- Firecrawl remains connected but its available credits are 0 through 2026-11-29. TinyFish remains excluded.

### Repository hygiene and remaining controls
- Before PR #114 cleanup, live branch enumeration returned 19 refs: 17 durable backup/deploy/preview/recovery/release/restore refs plus two temporary merged-maintenance refs. PR #114 is the sole open PR; it adds both exact temporary heads to the reviewed cleanup allowlist. Expected after merge and cleanup: **17 durable refs, 0 open PRs**.
- GitHub main branch protection is still not enabled: `main.protected=false`, repository rulesets count 0. The connected GitHub integration returns 403 for the administrative branch-protection endpoint; this needs an authorized repository Settings session.
- Cloudflare custom domain `rawaa.eu.org` remains pending/unresolvable. It is explicitly bound to `raawaa-store` and its CNAME points to `raawaa-store.pages.dev`; preserve it until the domain owner confirms it is not intended for this store. No DNS changes were made.

### Store operations still awaiting owner-supplied decisions/data
1. Real Sham Cash wallet number if that payment route is to be enabled; the current field remains blank.
2. Complete, approved ingredient/INCI and manufacturer/supplier information.
3. Genuine product photographs to replace conceptual packaging artwork.
4. Privacy notice review for the actual business jurisdiction and order-handling process.
5. Confirm whether WhatsApp handoff remains the intended order flow or whether server-side order storage/payment should be designed. Neither connected Supabase project has been connected to this store; no Supabase data was changed.
6. Confirm whether `rawaa.eu.org` is controlled by the store owner; detach the Pages binding/CNAME only if the owner confirms it is not for Raawaa.

No prices, discounts, delivery rules, payment settings, customer/order data, Supabase records, DNS records, or secrets were changed during this checkpoint.


## Final repository and release confirmation — 2026-11-15 06:25 UTC

- Canonical main after final maintenance merge: `b6c50075dae95179ea430a60b6dbdf92946b5f56`.
- Final GitHub inventory after the first archive cleanup: **17 branches, 34 tags, 0 open pull requests**; a second archive tag has since been verified, and two generated archive-finalization refs are being retired with exact ancestry checks. The 17 branches are the retained main, backup, deploy, preview, production-deploy, recovery, release, and restore refs.
- Branch hygiene run `43685324709` completed successfully. The one diverged post-merge maintenance branch was not force-deleted: it was preserved at exact commit `80e320e4b95138685ad10099c6087050d66b2b62` as annotated tag `archive/branches/2026-11-15/maintenance/pr112-branch-hygiene-inventory-2026-11-15`; tag target was read back and matched, then the temporary branch was deleted.
- No temporary work branches or open PRs remain. All durable operational/recovery refs remain.
- Latest successful production deployment remains Cloudflare Pages deployment `44ff2ce7-0379-4311-86aa-43be465fdb75`, source `adbc74f31801afa92a37c83dcb1c7698e1248c3e`. Subsequent main commits were documentation/maintenance only.
- Latest competitor crawl run `43684667793`: 9/10 pages HTTP 200; Kérastase UK official page returned a 307 JavaScript challenge and was not bypassed. Snapshot report: `docs/engineering/COMPETITOR-CRAWL-SNAPSHOT-2026-11-15.md`; artifact: https://github.com/raawaa93/Raawaa/actions/runs/43684667793.
- Visual QA remains successful: run `43684775744`, 16 browser/viewport/page combinations, zero reported issues.
- Remaining external controls are unchanged: GitHub `main.protected=false`, repository rulesets count 0 (connected integration received 403 for administrative settings); `rawaa.eu.org` remains pending/unresolvable despite its store-specific CNAME and Pages binding. No DNS or nameserver changes were made.
- Store owner inputs still required before full order/payment operation: Sham Cash wallet number, approved INCI/formula data, real product photographs, privacy notice review, and confirmation of whether WhatsApp-only order handoff remains the intended workflow. No connected Supabase project has been attached or modified.


## Additional archive and final branch cleanup — 2026-11-15 06:29 UTC

- Second exact-SHA recovery tag: `archive/branches/2026-11-15/maintenance/record-pr113-archive-2026-11-15`, targeting commit `1415d8dcac9ca2113626659d4454b2450b42b423`. Tag target read-back matched.
- This brings the verified archive-tag count to **35**. The one-time archive allowlist is being cleared.
- Two generated maintenance refs remain temporarily: `maintenance/finalize-archive-index-2026-11-15` and `maintenance/finalize-pr113-archive-2026-11-15`. Their unique changes are already represented in canonical main; they will be fast-forwarded to main and removed only after GitHub confirms `ahead_by=0`.
- No open pull requests. Expected final inventory after cleanup: **17 branches, 35 tags, 0 open PRs**.


## Execution checkpoint — 2026-11-15 08:02 UTC

### Mobile visual corrections and validation
- PR #132 merged as canonical main commit `9236a93b6afc225a0764e98954953ce07a0ea621`. It corrected the homepage promotion/header stacking, mobile hero spacing, menu alignment/positioning, 44px touch targets, and primary/secondary button states. It also added PR-scoped visual QA against an isolated local build.
- All five associated workflows completed successfully: Store checks, Playwright browser checks, mobile Lighthouse, visual QA, and offline Graphify.
- Visual QA artifact `14151948737` contains 16 route/engine/viewport cases (home, serum, campaign, privacy × Chromium/WebKit × iPhone 13/desktop). The inspected report records **zero issues**: all navigations HTTP 200; no broken images, console/page/CSP errors, failed requests, bad responses, or horizontal overflow. Screenshots were inspected for the mobile homepage and serum page. This is an isolated PR-source audit, not a fresh live-production crawl.
- Mobile Lighthouse artifact `14152951106` reports performance scores: home 89, serum 87, campaign 96, privacy 100. Accessibility and best-practices are 100 on all four pages. Campaign SEO 69 is expected because campaign is intentionally `noindex,follow`. Serum LCP is 3.8s and home TBT is 450ms in this local build; image/JS delivery remains a performance follow-up, not a launch blocker from this visual QA.

### Exact-SHA branch archive and repository hygiene
- PR #133 merged as commit `fd0e469e54ebea4732088fdd686ae4da6061e335`; its Store checks and Graphify workflows passed.
- The merged PR #132 branch was not ancestry-deleted because its squash-merged history diverged from main. Its exact live head `6d9887c48cbbbd5eb9c0bf84a97acb6db2bfaf95` was added to the reviewed archive allowlist, preserved as annotated tag `archive/branches/2026-11-15/fix/mobile-header-buttons-colors-2026-11-15`, and the tag target was read back and matched before branch retirement.
- Fresh GitHub enumeration after cleanup: **17 retained branches, 0 open PRs**. The temporary PR #133 branch was also retired by the exact merged-head cleanup policy. The archive index and branch inventory were refreshed in the follow-up documentation PR.

### Boundaries and remaining work
- These checks validate the PR source on a local CI server; they do not independently prove that the latest main source is live in Cloudflare Pages. The current production deployment was not re-read in this checkpoint.
- GitHub main branch protection remains unresolved; require branch protection and mandatory production checks through authorized repository settings. Do not infer protection from successful CI.
- Keep the custom domain pending until the registrant/owner intent and DNS delegation are confirmed. No DNS changes were made.
- Remaining owner-supplied operational inputs are unchanged: Sham Cash wallet number if that method is to be enabled; verified complete INCI/manufacturer/supplier documentation; genuine product photography; privacy-notice approval for the operating jurisdiction; and a decision on whether WhatsApp handoff remains the order flow or a separately designed backend/payment system is desired.
- Historical Supabase identity note, superseded by the 2026-11-21 live correction below: canonical `owner/settings.mjs` points the owner dashboard at `Ghaiooth-core`, which is a shared staging/test backend rather than a dedicated production Store database. Do not connect `raawaa-engine-fallback` to checkout. Firecrawl quota remains exhausted until its stated renewal; TinyFish remains prohibited. No paid billing, customer/order data, secrets, pricing, discounts, or delivery rules were changed.


## Live infrastructure correction — 2026-11-21

This section supersedes earlier assumptions in this file about the Store's Supabase backend and deployment/domain state.

### Supabase project identity — verified from canonical storefront source
- `owner/settings.mjs` on canonical `main` explicitly configures the owner dashboard to use Supabase project `Ghaiooth-core` (`oyoyozdugicmnkfhjovo`) and its `rawaa-owner-orders`, `rawaa-telegram-pair`, and `rawaa-telegram-test` Edge Function endpoints. This is the Store's configured owner-dashboard staging backend; the recovered migration archive identifies the project as shared with the separate council/control-plane system and classifies the Store schema/dashboard as staging/test-only, not a dedicated production Store database.
- The other connected project, `raawaa-engine-fallback` (`xuwtuhfqjjwszxqkmivj`), is not configured by the Store source and must not be connected to checkout.
- The storefront cart code `js/cart.js` hands the customer's order to WhatsApp. A source scan found no Supabase or `commerce-api` call in that cart code. The owner dashboard separately calls `rawaa-owner-orders`, `rawaa-telegram-pair`, and `rawaa-telegram-test`. Therefore there is no demonstrated direct ingestion path from a customer's WhatsApp handoff into `rawaa_store.orders`; the owner dashboard's order list may remain empty unless a separate, verified integration inserts those records. The database showed zero `rawaa_store.orders` at this inspection, and the last-24-hour log slice contained no matching Store Edge Function requests. Treat this as an unresolved order-workflow integration gap, not as a failed WhatsApp handoff.
- A prior statement that neither connected project was the Store database was incorrect. The repository's canonical owner settings are the source of truth and explicitly identify `Ghaiooth-core`.
- The archived Store migration README (`recovery/supabase-store-migrations/README.md` on `recovery/archive-store-supabase-migrations-2026-11-15`) says all seven Store migrations are already applied to the shared project, that the archive omits 12 council/control-plane migrations, and that the archive must not be replayed against the shared database. It also says the owner dashboard remains staging/test-only. Keep this database isolated; do not add production order writes, run archived migrations, or change its schema as part of routine Store release work.

### Read-only Supabase security and runtime inspection
- `rawaa_store` tables have RLS enabled. No policies are defined, and the `anon` and `authenticated` roles have neither schema USAGE nor table SELECT/INSERT privileges. The `service_role` has schema USAGE and the expected table privileges for orders, outbox, rate limits, and Telegram pairing; marketing preference events have service-role SELECT/INSERT only. This is a service-role-only data access model, not public table access. Edge Functions must continue to authenticate the owner and enforce authorization before using the service role.
- The six active deployed functions observed are `rawaa-outbox` (JWT off), `rawaa-telegram-test` (JWT on), `commerce-api` (JWT off), `rawaa-owner-orders` (JWT on), `rawaa-retention` (JWT off), and `rawaa-telegram-pair` (JWT on). JWT-off scheduler/public endpoints must enforce their own strong request authentication. Function source retrieval currently fails with an internal Supabase tool error, so their internal authorization logic has not been verified; do not claim a full function security audit.
- The `commerce` schema has RLS enabled but no policies, and the `anon`, `authenticated`, and `service_role` roles currently have no schema USAGE or table privileges there. It contains zero orders. `commerce-api` is not referenced by the storefront cart or owner dashboard source inspected in this audit. Treat this schema/function as staged or unintegrated until its intended authentication and privilege model is reviewed; do not wire it into production checkout as-is.
- At the time of inspection, `rawaa_store.orders` and `commerce.orders` each contained zero rows. The Telegram recipient/pairing configuration tables contain one row each; their values were not read.
- Supabase advisors reported 17 informational RLS-enabled/no-policy findings, one warning that leaked-password protection is disabled, ten unused indexes, and one duplicate-index warning. The RLS findings are consistent with the service-role-only model above; they are not evidence of public exposure. Leaked-password protection still needs an owner-login compatibility review before enabling.
- The two indexes `orders_closed_at_idx` and `orders_retention_idx` on `rawaa_store.orders` have byte-identical definitions: btree `(closed_at, id)` where `closed_at IS NOT NULL`. The archived migration README explicitly says to keep both until the history is managed through a reviewed, versioned migration. No index was dropped. Do not run DDL cleanup against this shared staging project or remove other unused indexes solely from zero-traffic statistics.
- No matching `/functions/v1/`, `rawaa_store`, or `commerce` API requests were found in the inspected last-24-hour edge log slice. This does not prove the functions are broken; it means recent usage was not demonstrated by those logs.
- `get_edge_function` failed repeatedly with an internal protocol error. Stop retrying the same source-fetch route; recover the deployed function source through a supported export path before changing or certifying function behavior.

### Cloudflare Pages — live API read
- Pages project: `raawaa-store`; production branch: `main`; project uses no Pages Functions.
- Latest production deployment remains `14abd47f-6d32-454a-a818-1abba6c71d4d`, URL `https://14abd47f.raawaa-store.pages.dev`, deployment stage `success`, created `2026-11-15T09:52:55Z`, source SHA `667db996286c9b3446f8d790df410861aa9e0b1f`.
- The deployed SHA is an ancestor of current main. Its comparison contains only workflow/policy/documentation/test changes; no storefront HTML, CSS, browser JavaScript, product/pricing configuration, or other Pages payload source changed. The 2026-11-21 inventory and memory corrections are documentation-only and excluded by the production workflow's trigger filters. There is no storefront-source change requiring a production redeploy at this checkpoint.
- The Pages custom-domain API reports `rawaa.eu.org` as `pending`, with verification error `CNAME record not set`. The project currently lists only `raawaa-store.pages.dev` as an active domain. Do not change DNS or nameservers without verified domain control and explicit intent.

### Release and repository controls
- The canonical production workflow is automatic after successful validation on qualifying main pushes. It has no manual approval/dispatch gate. Do not reintroduce an owner-confirmation gate.
- Repository metadata confirms the connected identity has admin/maintain/push permissions, but this audit did not verify branch protection. Do not claim required checks or branch protection are enabled without reading protection/ruleset settings.
- No DNS, Pages domain binding, production source, Supabase schema/data, secrets, prices, discounts, delivery rules, customer/order data, or billing settings were changed during this checkpoint.


## Operational audit summary — 2026-11-21

- Detailed technical, infrastructure, and security findings are retained in the private Notion continuity record, not duplicated into this public repository.
- PR #146 corrected the obsolete Pages build guard and merged as `48fa6d2dba4edd3ae9350e61362de680aa288754`. Production CI [#44840290249](https://github.com/raawaa93/Raawaa/actions/runs/44840290249) passed and deployed Cloudflare Pages deployment `7ea90c29-002b-403a-9b89-18d220544781`.
- Live Visual QA [#44840577452](https://github.com/raawaa93/Raawaa/actions/runs/44840577452) passed 16 browser/route/device captures with zero reported layout or runtime issues.
- Mobile Lighthouse baseline [#44840290194](https://github.com/raawaa93/Raawaa/actions/runs/44840290194) recorded Performance scores: home 99 median, serum 87, campaign 96, privacy 100; Accessibility and Best Practices 100.
- Search Console has low early visibility; IndexNow accepted a submission for the canonical serum URL. GA4 property is not available on the connected Google account.
- No pricing, delivery, payment, customer/order data, database schema, DNS, or billing changes were made.

## Branch cleanup closure — 2026-11-21

- PR #147 merged as `f8d4e945afbf693177444fc62f518a05bfefb322`.
- Branch hygiene run [#44841319041](https://github.com/raawaa93/Raawaa/actions/runs/44841319041) succeeded. It inspected 19 branch refs and 147 PR records, approved exactly two merged refs, and deleted `fix/remove-retired-route-build-guard-2026-11-21` and `maintenance/retire-pr146-branches-2026-11-21`.
- Fresh enumeration: **17 branches, 40 archive tags, 0 open PRs**. All remaining refs are the durable backup, deploy, preview, production-deploy, recovery, release, restore, and main refs listed in `docs/engineering/BRANCH-INVENTORY.md`.
- No recovery tag or operational branch was deleted. The branch inventory and technical audit now reflect the verified live count.


## Final execution update — 2026-11-21

- PR #148 shipped responsive product imagery and PWA cache updates. PR #149 reduced the serum page's shared CSS payload from 50,878 to 28,044 bytes. Production Lighthouse after PR #149 measured serum Performance median 91 and LCP median 3.25s (previous 89 / 3.46s); production Visual QA passed 16 captures with zero reported issues.
- Production deployment remains Cloudflare Pages `349bd1d4-1254-40e1-b4ec-5f19c74176b9` from validated storefront commit `e554489b78de8b280b1281b2c706d6acc42b5ad5`. Later PRs #153/#154 were documentation and repository-governance changes only.
- PR #151 added the local Modern Web Guidance skill; PR #152 hardened it with pinned CLI 1.0.1, telemetry opt-out, scoped non-trivial browser-platform triggers, and tests. No runtime dependency was added.
- PR #153 recorded the PostHog connector audit from a separate enabled MCP session. No event tracking, session replay, SDK, token, CSP expansion, or customer identification is active. PostHog data tools were available during that separate audit but are not exposed in this current session; no analytics instrumentation is active because the destination project must be confirmed before token configuration.
- PR #154 corrected archive-tag dates to use the actual execution date and removed account-level plugin permission details from public docs.
- Post-PR #155 baseline snapshot: main `8fe861b2496db12242aee3b8d3362d656de3e47c`, 17 durable branch refs, 40 archive tags, and zero open PRs at that time. Branch-hygiene run #44845577319 succeeded and deleted only the merged maintenance branch. PR #156 was subsequently closed as superseded because its 819/804/22 tool-count snapshot and claim of current-session PostHog tool access did not match the live session catalog; its branch was reset to main and is scheduled for exact closed-branch cleanup after PR #157 merges.
- The detailed technical audit remains in the Notion continuity record; the public copy is absent from the current repository tree. The earlier commit remains in Git history.
- Current-session tool inventory: **817 total definitions** (802 connector/MCP tools across 21 provider families + 15 native tools) and **152 Skills**. PostHog was audited through a separate enabled session but no PostHog MCP actions are exposed in this session.
- No product pricing, formulas, shipping/payment rules, WhatsApp checkout, customer/order data, Supabase schema/data, DNS, domain purchase, or billing changed.

## Live tooling and repository refresh — 2026-11-21

- The current ChatGPT session exposes **819 tool definitions**: **804 connector/MCP tools across 22 provider families** and **15 native tools**, plus **152 workspace Skills**. This is a workspace-wide capability count, not proof that every provider is connected to RAWAA.
- Cloudflare access was checked read-only: identity lookup and Pages project listing succeeded. The only Pages project is `raawaa-store`, production branch `main`, with only `raawaa-store.pages.dev` listed; latest production deployment `349bd1d4` succeeded from validated source SHA `e554489b78de8b280b1281b2c706d6acc42b5ad5`. The token-verification endpoint returned HTTP 401, so do not assume full token scope or write access. No DNS or deployment changes were made.
- PostHog MCP actions are now available in this session (two tools). No Store analytics instrumentation or session replay is active; confirm the intended destination and review consent/privacy before any SDK, token, CSP, or event-capture change.
- Agency Agents remains a selectively adopted MIT instruction catalog from PR #145, not an execution runtime. Do not bulk-import its roster.
- AgenC Core was reviewed as a separate MIT-licensed agent-runtime candidate. Keep it outside the static Store runtime; any pilot requires a separate host, provider, hard model budget, least-privilege permissions, and measurable baseline. Its published benchmark is project-reported, and model inference is not free.
- PR #157's original head ref was missing during the follow-up audit. The exact recorded head was preserved separately; all active PR heads must be checked before branch cleanup.


## Branch hygiene follow-up — 2026-11-21

- After PR #160 merged, two temporary documentation refs remained beyond the 17 durable operational/recovery refs: merged PR #160 head `docs/tooling-refresh-2026-11-21` and closed-unmerged PR #159 head `docs/final-live-state-2026-11-21`.
- PR #160's exact merged head is allowlisted for deletion only when the live branch head matches the merged PR head. PR #159's exact head is allowlisted for archive-first retirement; its 48-ahead/3-behind history must be preserved in an annotated archive tag before branch deletion.
- Do not delete either ref directly. The branch-cleanup and archive workflows must prove the exact conditions and the final 17-ref state must be rechecked.


## Active branch cleanup PR — 2026-11-21

- PR #161 is the only open PR. It contains exact-SHA policy and regression tests to remove merged PR #160's temporary branch, archive then remove closed PR #159's stale branch, and remove its own branch after merge.
- Current ref count is 20: 17 durable operational/recovery refs plus three temporary refs. Do not claim the final 17-ref state until the archive and branch-cleanup workflows verify it.


## Existing branch workflow and final archive — 2026-11-21

- Confirmed `.github/workflows/cleanup-merged-branches.yml` already executes exact reviewed branch cleanup on pushes to `main` and weekly; it runs merged-head pruning before inactive-ref archival. No duplicate executor was added to main.
- After PR #161 merged, the workflow removed the exact merged heads for PRs #160 and #161, and archived/deleted closed PR #159's exact branch head `b617c56799a3d913878df4915a1c2a94ea273617`. The archive tag `archive/branches/2026-11-21/docs/final-live-state-2026-11-21` resolves to the same inspected file blob as the archived commit.
- The only remaining non-durable ref is an unmerged experiment `maintenance/branch-maintenance-runner-2026-11-21` at exact SHA `881720de49a7a3a3a28fde6102987de9f06ded31`. It will be archived through the existing policy workflow; do not merge its code or add a second executor.
- Current branch count is 18: 17 durable refs plus the one reviewed archive candidate. The archive-policy PR branch is allowlisted for cleanup after its own merge; verify the final 17-ref state after the main-push workflow completes.


## Archive policy PR #162 — 2026-11-21

- PR #162 is the only open PR. Current branch count is 19: 17 durable refs plus the unmerged runner experiment and the active archive-policy PR branch.
- The unmerged experiment is allowlisted at exact SHA `881720de49a7a3a3a28fde6102987de9f06ded31`; it must be archived before deletion by the existing branch-hygiene workflow.
- The PR branch is allowlisted as an exact merged head so the same workflow can retire it after merge. Verify the tag target and final 17-ref inventory before marking branch cleanup complete.
