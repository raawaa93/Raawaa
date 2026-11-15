# RAWAA Store — durable project memory

This file is the repository-backed memory that survives AI sessions, client changes, and expired hosted quotas. Keep it concise, factual, and updated when a material decision changes. It contains no credentials, customer records, or private order data.

## Canonical project
- Branch hygiene: the tested policy deletes unchanged merged PR heads, branches whose current history is contained in `main`, and exact reviewed superseded/stale refs. It preserves `main`, all `backup/*`, `recovery/*`, `restore/*`, `release/*`, `production-deploy/*`, `deploy/*`, active `preview-deploy/*`, protected refs, open-PR heads, and unreviewed closed-unmerged work. See `docs/engineering/BRANCH-INVENTORY.md` and `docs/engineering/TOOLING-REGISTRY.md`.

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
- Superseded by PR #59: production validation and Playwright CI now use `npm ci`; npm audit and OSV Scanner cover the locked dependency tree. Do not revert to mutable `npm install`.
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

- Cloudflare Web Analytics was checked through the account API on 2026-11-15: no Web Analytics sites are configured. Cloudflare documents it as available on all plans; it collects minimal page-load timing metrics and does not track individual end users across customers. Its beacon still sends performance metrics and supports dimensions such as country, referrer, browser, device, and OS, so it is a candidate for basic traffic/RUM but has not been enabled pending privacy-notice review and CSP changes.

- PR #55 is merged and deployed. Cloudflare Pages production smoke tests passed against the live site: global clickjacking/MIME/referrer/permissions protections are present; owner routes additionally return restrictive same-origin CSP, `Cache-Control: no-store`, and `X-Robots-Tag: noindex`. The site currently uses no Pages Functions, so the static `_headers` rules cover the site's responses.

- A deeper privilege check confirmed `commerce` has no `USAGE` grant for `service_role` and no table grants for `service_role`, `anon`, or `authenticated` in either project. By contrast, `rawaa_store` in `Ghaiooth-core` grants `service_role` schema usage and CRUD on its private tables. Therefore the deployed `commerce-api` cannot use the `commerce` schema through normal PostgREST service-role access as currently granted; it may be intentionally dormant or use a different access path. Do not add grants until the deployed function source and intended auth model are recovered.

- Edge Function source recovery was attempted through the Supabase connector (`get_edge_function` returned an internal protocol error). A temporary, read-only GitHub Actions recovery workflow also checked for the `SUPABASE_ACCESS_TOKEN` repository secret; it was absent, so both downloads were skipped. The temporary workflow was removed and no project or source files were changed. To complete this audit, the only missing access is a read-only Supabase access token with permission to download Edge Function source (or a source archive exported from the Supabase Dashboard). Never commit the token or place it in a source file.

- PR #58 is merged. The homepage now uses explicit, shorter motion transitions, respects `prefers-reduced-motion`, and exposes keyboard focus states. Store checks, Playwright browser checks, Graphify, and the mobile Lighthouse baseline all passed. The change was deployed with the validated `b37f20fd` main commit.

- PR #59 is merged. `package-lock.json` now pins the Playwright toolchain to `@playwright/test@1.65.1`; lock generation validated `npm ci` and `npm audit --audit-level=high` reported zero vulnerabilities. Playwright CI and production validation now use `npm ci`; dependency/test-only changes no longer trigger a static-site production deployment. Google's OSV-Scanner v2.7.1 now runs on dependency PRs/merge groups and weekly on main.
- PR #61's proposal to make production releases manual-only was closed after checking `AGENTS.md`: canonical-main automatic releases after complete validation are the owner-approved policy. Preserve that policy and its exact-SHA, clean-source, freshness, Cloudflare-secret, and production-environment gates.


### Maintenance updates after the November 14 baseline

- PR #54: replaced unsafe dynamic evaluation in the owner pricing editor with JSON parsing and added a deep-link regression test; production deploy was validated.
- PR #57: removed duplicate Store-check and Playwright workflows from main pushes. PRs and recovery/restore branches still run them; production CI remains the single main-branch release validation path.
- PR #59: committed `package-lock.json`, switched CI to `npm ci`, added npm audit and OSV Scanner v2.7.1; npm audit and the OSV scan both reported no dependency findings. Dependency/test-only changes no longer trigger a static-site production deployment.
- PR #55 production response-header smoke test passed against the deployed Pages origin, confirming the strict owner CSP, no-store/noindex, X-Frame-Options, Permissions-Policy, Referrer-Policy, and nosniff headers.
- PR #56 migration archive and its recovery-only workflow changes are in main; the backup artifact after merge includes the archive. No SQL was executed.

- PR #64 strengthened the stale-release guard: a validated release can tolerate only intervening documentation, recovery, workflow, dependency, test, or validation-only commits; any changed production source/configuration/build file still blocks deployment. The earlier run for PR #62's SHA was correctly blocked when main moved, and the subsequent validated run for `032a6260` deployed successfully.
- PR #65 is merged. The production workflow now excludes workflow-only changes from deployment triggers and retains the controlled manual rerun with `confirm_production=yes`. Automatic releases for qualifying website-source changes remain the default; pull requests and non-main branches remain excluded.


## Verified tooling and discovery update — 2026-11-15

- PR #53 merged as `845ace2c45c0cc9aa70c9b4093bf4aa69780cc7f`; PR #67 subsequently aligned project memory with canonical main as `2f11981bb9b9fac4fe59cd88a4dc9920ce4d8560`. Both were documentation/CI-only. The latest confirmed production deployment remains Cloudflare Pages deployment `d00b2e27-4d3a-4486-9ff8-0bb27a656339`, from validated source SHA `032a62601e5a6925c8bc97889607b4804ebceb08`. Do not interpret later docs-only commits as new storefront releases.
- GitHub Actions run [#43674768876](https://github.com/raawaa93/Raawaa/actions/runs/43674768876) completed successfully and generated 12 Lighthouse reports across four storefront URLs. It emitted advisory warnings for cache insight, document latency, image delivery, render blocking, unminified CSS/JS, unused CSS/JS, FCP/LCP, and SEO crawlability; these are not test failures. The separate latest OpenSEO audit [f2734602](https://app.openseo.so/p/8609bf87-b153-41f8-b10c-c716c36a5c4f/audit?auditId=f2734602-dfd8-4ef5-8472-aaf709d9ec01) crawled 7/7 pages and reported only three informational canonicalized product-query URLs. Its measured mobile Lighthouse scores were home 100, privacy 99, serum 99; desktop 100 for all three. Mobile LCP was approximately 1.23s, 0.95s, and 2.08s respectively. These are single-run measurements, not guarantees.
- Search Console remains connected to the verified URL-prefix property `https://raawaa-store.pages.dev/`, but the last three months returned zero clicks and impressions. URL inspection returned “URL is unknown to Google” for home, serum, privacy, and campaign. The current sitemap contains only home, serum, and privacy, and robots.txt references it. On 2026-11-15, IndexNow successfully submitted home, serum, and privacy to supported IndexNow engines; this does not notify Google. Google sitemap submission and indexing requests remain outstanding and must be performed through Search Console when an authorized write path is available.
- No GA4 property is exposed by the connected Google account. Cloudflare Web Analytics site configuration was created for `raawaa-store.pages.dev` with `auto_install=false`; no beacon has been injected and no analytics collection is active. Do not install the snippet until the privacy disclosure and Content Security Policy are reviewed and updated together.
- Current connected service balances observed on 2026-11-15: OpenSEO 424 credits remaining; Firecrawl 0 credits remaining (plan allowance 1,000; current period ends 2026-11-29). Avoid further Firecrawl calls until the quota renews or the balance changes.
- The connected Supabase account lists only `raawaa-engine-fallback` and `Ghaioooth-core`; neither is confirmed as the Store database. Do not run Store database operations against either project. The Store-specific deployed Edge Function source recovery blocker remains unresolved.
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
- Branch-cleanup policy: only exact reviewed same-repository merged PR heads may be retired when the current head still matches the merged PR head; moved heads require GitHub compare `ahead_by=0`. Closed-unmerged and stale no-PR refs also require exact allowlists and `ahead_by=0`. Preserve backup/*, recovery/*, restore/*, release/*, production-deploy/*, and active preview-deploy/*/deploy/* refs, plus all open-PR heads and unknown work.

## Branch cleanup outcome and policy correction — 2026-11-15 04:33 UTC

- PR #70 merged at 04:28 UTC. Run #43676889692 inspected 84 branches/72 PRs, completed 15 ancestry comparisons, deleted 55 refs with zero failures (54 merged-PR heads plus one closed-unmerged branch whose head was already in main). Follow-up run #43676951048 inspected 29 branches and deleted zero.
- Three operational/historical checkpoints were included in the first allowlist by mistake and were immediately restored at their exact original PR head commits: restore/integrated-store-2026-11-14 (b74fcf3dadecf52c0c40ce848ef67b104d7f73ec), release/clean-pages-payload-2026-11-14 (8cba6b94ce39282999d3c4c86ca2a60845c805a2), and preview-deploy/visual-qa-current-2026-11-15 (7ca62ffaaf2be5fd337255d66679621be399ddae). No backup/* or recovery/* refs were deleted; four backup and three recovery refs remain.
- Ten other closed-unmerged refs and all four stale no-PR refs were retained because their current heads contain commits ahead of main. Net refs retired after restoration: 52. Current inventory: 35 branch refs, 75 PRs (61 merged, 13 closed-unmerged, one open PR #74).
- PR #73, which would have re-added restored/active refs to the deletion allowlist, was closed without merge. PR #74 adds regression tests and protects restore/*, release/*, production-deploy/*, and active preview-deploy/*/deploy/* refs. It also removes maintenance/test scripts from production release triggers. Do not run another cleanup pass until PR #74 is merged and validated.
- PR #71 fixed the visual audit harness by removing Playwright screenshot animations: disabled, which caused 20 WebKit CSP console errors. The site CSP remains strict. Run #43677078729 is the fresh visual audit against canonical main SHA d4e6c066; its report still requires inspection.
