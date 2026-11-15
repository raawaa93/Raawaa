# RAWAA Store tooling and skills registry

**Last verified:** 2026-11-15 05:55 UTC  
**Policy:** use free tiers and included quotas; never activate billing or paid usage without a separate explicit instruction. Quota values below are dated snapshots, not permanent guarantees.

## Project source of truth

- GitHub repository: https://github.com/raawaa93/Raawaa
- Canonical branch: main
- Cloudflare Pages project: raawaa-store (Direct Upload)
- Production: https://raawaa-store.pages.dev
- Durable project memory: docs/engineering/PROJECT-MEMORY.md
- Agent rules: AGENTS.md
- Branch rules: docs/engineering/BRANCH-INVENTORY.md
- This registry is the inventory of connected tools and skills; update it when access, quota, or project architecture changes.
- Complete Skills catalog: `docs/engineering/SKILL-REGISTRY.md` (151 entries).

## Connected tool families available in this ChatGPT workspace

The current workspace inventory exposes **801 tool definitions across 24 integration families**, plus **151 skills**. This is a workspace-wide count, not a claim that every tool is connected to the RAWAA production account.

| Integration | Available tools | Project use / status |
|---|---:|---|
| GitHub | 89 | Primary repository, PR, workflow, file, and release operations |
| Cloudflare | 4 | Pages/Workers/analytics inspection; DNS remains untouched |
| Supabase | 36 | Two projects visible; neither confirmed as Store database, so Store writes are blocked |
| OpenSEO | 87 | Active RAWAA SEO project and Search Console reporting |
| Ahrefs | 158 | Free API quota; keyword/backlink research |
| Firecrawl | 32 | Public-page extraction and research; currently exhausted |
| Figma | 45 | Connected, but current seat is View-only |
| Notion | 79 | Operating model, recovery, and project documentation |
| Lovable | 47 | App prototyping/build workflow; use only when it adds value |
| HubSpot | 39 | Connected but not configured for RAWAA |
| Metricool | 9 | Social scheduling/analytics integration |
| Gmail | 21 | Mail lookup and communications |
| Runway | 40 | Image/video generation; use only when a creative asset is needed |
| ChatGPT Ads Manager | 65 | Ad account operations; no spend without approval |
| Plugin Management | 6 | Discover/manage ChatGPT app integrations |
| Plugin Creator | 9 | Custom app/plugin development |
| Context7 | 2 | Current library documentation |
| Exa | 2 | Research/search |
| Consensus | 7 | Academic literature search |
| OpenAI Platform | 2 | API key/platform setup; do not create keys or incur spend without request |
| Automations | 7 | Scheduled checks and reminders |
| Files | 11 | Conversation and Library file operations |
| Skills | 2 | Discover and read workspace skills |
| User settings | 2 | Inspect/update ChatGPT appearance and personality settings only when requested |

Other available skill/tool families include data analysis, user settings, and file-library operations. Availability in this workspace does not mean every service is connected to a RAWAA account.


## Owned private plugin inventory

- **Hostless** — private USER-scope plugin, version `0.1.0`, plugin ID `plugins_6ade8fe19de081919d932135b5b265b2`.
- Its manifest points to the remote MCP endpoint `https://mcp.hostless.app/mcp`; the stored configuration contains no authentication headers. The current 801-action workspace tool inventory has no Hostless namespace, so an active Hostless connection is **not confirmed**.
- Keep it as a dormant owned integration candidate; do not delete or claim it is connected until the account's Hostless authorization and available tools are verified.
- Plugin Creator can enumerate owned personal plugins (one found). Plugin Management does not expose a complete account-wide installed-plugin listing in this session, so this audit does not claim to enumerate every workspace-installed plugin.
- No global plugin, connector, or Skill was uninstalled. Destructive uninstall requires exact target IDs and a confirmed dependency/ownership review; broad removal would risk other projects.

## Free-tier balances observed on 2026-11-15

| Service | Observed allowance / remaining | Decision |
|---|---|---|
| Ahrefs API | Free subscription: API-key limit 200,000 units, 0 used; workspace limit 0; reset 2026-12-04 | Public Domain Rating endpoint works at zero unit cost. Keyword/location endpoints returned `Insufficient plan`; the 200,000 API-key allowance is not a general workspace quota |
| OpenSEO | 251 credits remaining after current audit and keyword research | Active RAWAA SEO project; prioritize high-value audits and regional keyword research |
| Firecrawl | 0 remaining of 1,000 plan credits; current period 2026-10-29 to 2026-11-29 | Pause Firecrawl calls until renewal; verify balance before resuming |
| Cloudflare Web Analytics | Site configuration created for raawaa-store.pages.dev; auto_install=false | No beacon installed; no data collection active until privacy/CSP review |
| GitHub Actions | Free included usage subject to account limits | Existing workflows are pinned and used selectively |
| Supabase | Two active healthy projects visible | Do not mutate either until the Store database is positively identified |

## Project-relevant repository automation already present

- Playwright with Chromium and WebKit, including iPhone 13 emulation and checkout/WhatsApp regression coverage.
- Lighthouse CI performance audit.
- Graphify pinned to graphifyy 0.9.109, offline/code-only; no hosted model/API indexing.
- OSV dependency vulnerability scanning.
- Daily disaster-recovery bundle and source archive.
- Scheduled visual QA for mobile and desktop.
- Search Console connected through OpenSEO; IndexNow successfully submitted home, serum, and privacy on 2026-11-15.
- Automatic production release only after full validation of qualifying website-source changes on main; workflow-only/docs-only changes are excluded.
- Branch hygiene PR #70 and namespace-protection PR #74 are merged. Post-protection cleanup run #43677406307 inspected 35 refs, completed 12 ancestry comparisons, found zero candidates, and succeeded. PR #77 adds exact reviewed candidates for merged PR heads #71, #74, #75, #76, the no-PR docs ref, and its own head after merge.

## Skills available in the ChatGPT workspace

The current skill catalog lists 151 skills across the workspace. The RAWAA repository currently contains no `.agents/skills`, `skills/`, or `.claude/` skill packages; project-local skill packages are not installed or vendored. Relevant installed/available skills include:

- Superpowers: brainstorming, writing-plans, executing-plans, test-driven-development, systematic-debugging, verification-before-completion, finishing-a-development-branch.
- OpenSEO: SEO audit, SEO project setup, keyword research, competitive landscape, competitor analysis, keyword clustering, AI visibility audit, SEO reporting.
- Firecrawl: web extraction and deep research; calls paused while its credit balance is zero.
- Design and engineering: website design-system extraction, read-docs, Figma workflows.
- Data: data quality, product/business analysis, market sizing, KPI design, reports, dashboards, and visualization.

The catalog being available in ChatGPT is not the same as vendoring a skill into the repository or activating it in Codex/Antigravity.

### RAWAA project selection and cleanup policy

- Active core: GitHub, Cloudflare Pages, Playwright, Graphify, Lighthouse CI, OpenSEO/Search Console, Ahrefs public Domain Rating endpoint, and repository-backed project memory.
- Specialist-only: Figma (read-only), Notion (documentation), Supabase (blocked until the correct Store DB is identified), Metricool (only when publishing/analytics is required), Runway (only for requested creative assets), Ads Manager (only with explicit campaign/budget approval), and HubSpot (not configured for RAWAA).
- Paused: Firecrawl until credits renew. TinyFish is permanently excluded.
- Not required now: overlapping memory services, duplicate browser automation stacks, extra SEO crawlers, or paid analytics aggregators. Do not connect Windsor.ai/Supermetrics merely to increase connector count.
- Global ChatGPT apps and Skills are shared across projects. This audit curates RAWAA usage; it does not uninstall shared apps or delete global Skills. The repository has no vendored project-local skill bundles to prune.

## External skills reviewed, not bulk-imported

- Emil Kowalski emil-design-eng (MIT): reviewed for interaction and design-engineering guidance.
- Taste Skill (MIT): reviewed; do not bulk-import unchanged because its large asset/script bundle and blanket rules conflict with RAWAA's conceptual-image disclosures and verified business details.
- Selected Anthropic skills, including frontend-design and webapp-testing (Apache-2.0): reviewed as references.
- EveryInc Compound Engineering (MIT): reviewed; use selectively rather than duplicating Superpowers.
- These sources have not been installed into the hosted ChatGPT runtime. AGENTS.md contains Codex installation guidance; repository-local skill packages remain a separate, not-yet-vendored task.

## Integration gaps and boundaries

- Google Search Console is connected; no GA4 property is visible in the connected Google account.
- Windsor.ai and Supermetrics appeared in plugin discovery but are not installed; they are not required for current work and their free allowances were not verified.
- Google Drive connector is disabled by the workspace administrator.
- Figma MCP is read-only with the current View seat; the account is a Starter team member with Admin role metadata, but the seat itself is View and cannot edit files.
- Supabase account exposes raawaa-engine-fallback and Ghaioooth-core only; neither is confirmed as the Store database.
- Notion search surfaced the recovery record, development history, Arabic/English operating models, and sales operating page. Keep separate recovery and operating records; two AAE pages belong to another project and are out of RAWAA scope. Page search/fetch are available; connector-wide search and advanced data-source queries require Business/Enterprise, so do not upgrade for this project.
- TinyFish is explicitly prohibited; do not call, install, or reintroduce it.
- No ChatGPT plugin/app was uninstalled: the available manager cannot safely infer which global integrations are unused by other projects from RAWAA activity alone. Unconfigured or specialist-only integrations remain documented as such.
- ProjectMem and MCP Memory Service are not connected to this hosted session. Keep PROJECT-MEMORY.md as the durable source of truth and Graphify as a regenerable code map.
- Do not uninstall or delete broad ChatGPT integrations, Notion pages, Figma files, or external projects based only on inactivity. Connection management requires an exact target and explicit user action.

## Cost and privacy rules

- Prefer native GitHub Actions, Cloudflare free capabilities, OpenSEO/Ahrefs included quotas, and open-source tools.
- Do not create API keys, enable billing, purchase credits, or connect paid plans.
- Never send order payloads, phone numbers, addresses, customer data, or secrets to external AI/memory/indexing services.
- Never install analytics beacons before privacy disclosure and CSP are reviewed together.
- Keep external tool calls bounded by available quotas and log the remaining balance after significant research.


## Latest live SEO and market checks — 2026-11-15

- Fresh OpenSEO audit `5f5a4013-0115-4580-8d00-53615d3a71c1` crawled 7/7 pages on the live Pages URL. Home, serum, and privacy each scored 100 desktop; mobile scores were 100, 99, and 98 respectively. Accessibility, best practices, and SEO scored 100 on all three. Mobile LCP: home 1.16s, serum 2.16s, privacy 0.94s. The only audit issues were three informational query variants canonicalized to the base serum page.
- Search Console reports zero clicks/impressions in the last three months and URL Inspection reports home, serum, privacy, and campaign as unknown to Google. The sitemap exists in the repository and is referenced by robots.txt, but Google sitemap submission and indexing requests remain unverified through the connected read-only path. IndexNow successfully submitted home, serum, and privacy to supported engines; this does not submit to Google.
- Syria is not available as a location in the connected keyword providers. OpenSEO returned regional proxy estimates for the Arabic seed `سيروم شعر`: 22,200/month in Saudi Arabia and 12,100/month in Egypt. These are not Syrian search volumes and must not be presented as such. Ahrefs keyword/location endpoints returned `Insufficient plan`; its free Domain Rating endpoint is available.
- Global product-page benchmark: Mielle Rosemary Mint Oil (2 oz, published $9.99), The INKEY List Caffeine Scalp Treatment (150 ml, published £15), Kérastase Genesis Serum (90 ml), and Moroccanoil Treatment Original (100 ml, published £38.50). Competitor pages consistently provide detailed ingredient sections, usage instructions, FAQs, routine guidance, and customer reviews. RAWAA's 30/50/100 ml size ladder is competitive in format; complete INCI, verified product photography, product-specific usage, and real reviews remain the key content gaps.
- Free Ahrefs Domain Rating snapshot: raawaa-store.pages.dev 0; Mielle 72; The Ordinary 79; The INKEY List 54; Kérastase 72; Moroccanoil 79; Briogeo 70. DR is a third-party comparative metric, not a Google ranking factor; the pages.dev hostname score is not a measure of product quality.
- Visual QA harness fix PR #71 merged: Playwright screenshot `animations: 'disabled'` was removed to avoid CSP-blocked inline stylesheet injection in WebKit, and viewport-height diagnostics were added. Fresh visual audit run #43677078729 is running against the isolated preview from main SHA `d4e6c066`; do not mark visual QA complete until its report and screenshots are inspected.
- Latest Graphify run produced 299 nodes, 626 edges, and 23 communities across 29 code files; generated recovery archives and workflows remain intentionally excluded. The latest disaster-recovery artifact is 12.96 MB with 90-day retention.
- Cloudflare Web Analytics site configuration exists with `auto_install=false`; no beacon is installed and no analytics data is collected. Do not enable it until privacy disclosure and CSP are reviewed together.


## Latest cleanup and visual QA automation — 2026-11-15

- Current verified inventory before PR #80 merge: 36 branch refs; 81 PRs (66 merged, 14 closed-unmerged, 1 open).
- PR #79 merged the final branch allowlist and the no-PR docs ancestry check. Cleanup run #43678179625 inspected 40 refs and 80 PRs, completed 15 ancestry comparisons, deleted five reviewed refs, and reported zero failures.
- The five deleted refs were `docs/project-tooling-and-branch-inventory-2026-11-15`, `docs/visual-qa-and-inventory-finalization-2026-11-15`, `fix/visual-audit-csp-screenshots-2026-11-15`, `fix/visual-audit-webkit-csp-2026-11-15`, and `maintenance/branch-cleanup-final-2026-11-15`.
- PR #74's operational namespace protection remains active. All `backup/*`, `recovery/*`, `restore/*`, `release/*`, `production-deploy/*`, `deploy/*`, active `preview-deploy/*`, and open-PR heads are preserved.
- Closed-unmerged branches are now compared with main; allowlist membership alone is insufficient. Any ahead commit, comparison failure, unknown ref, or active PR causes retention.
- PR #80 consolidates this cleanup with a production release policy regression fix: production release is push-only after validated main checks; no manual `workflow_dispatch` deployment remains. Maintenance/visual-audit helper files are excluded from production release triggers and stale-source checks.
- Visual QA workflow runs on harness/workflow changes and after successful production releases; preview runs remain scoped to successful preview deployments. It chooses the live production URL for production-release runs.
- PR #78's narrowly scoped WebKit CSP event filter remains limited to the exact native SELECT user-agent shadow-style signature. All other CSP and console errors remain failures; strict CSP is unchanged.


## Visual QA WebKit regression — 2026-11-15

- PR #75's screenshot-caret option did not resolve the CSP console errors; the root cause is a documented Playwright/WebKit 27.2 regression affecting native `<select>` user-agent shadow styling: https://github.com/microsoft/playwright/issues/43497.
- PR #78 adds a narrowly scoped filter only for the exact `style-src-attr` / inline / empty-source / line-1 / SELECT / no-author-style signature. All other CSP events and console errors remain failures. Strict CSP is unchanged; no `unsafe-inline` added.
- Visual QA now runs on audit-harness changes and after successful production releases, using the production URL; preview deployments use the isolated preview host.
- Production CI excludes `scripts/visual-audit-csp-policy.cjs` from release triggers so test-harness changes do not deploy the storefront.


## Live account, workspace, and quota audit — 2026-11-15

### Free-tier balances

- **OpenSEO:** account verified; 251 credits remaining.
- **Ahrefs:** Free API allowance; 200,000 monthly API-key units, 0 used; next reset 2026-12-04. Workspace units are not included.
- **Firecrawl:** 0 of 1,000 credits remaining; current period ends 2026-11-29. Keep idle until renewal.
- **Cloudflare:** connected account verified. Pages and existing RUM site configuration remain; Web Analytics beacon is not installed.
- No paid plan, billing, credit purchase, or paid API was activated.

### External workspace state

- **Lovable:** Free workspace; zero projects, zero workspace skills, zero custom connectors, and zero templates. Its standard connector catalog is available but no RAWAA project or custom connector is configured.
- **HubSpot:** connected portal is not onboarded. No CRM data or settings changed.
- **Metricool:** one brand exists but no social network is connected. No posts or schedules exist for RAWAA.
- **Figma:** Starter team with a View seat; read-only. No file or team mutation.
- **Supabase:** only `raawaa-engine-fallback` and `Ghaioooth-core` are visible; neither is confirmed as the RAWAA Store database. No project, schema, secret, or data changes.
- **Notion:** connected and searchable; recovery, development history, operating models, and sales pages retained.
- **GitHub:** RAWAA repository connected with administrative access; cleanup is scoped to the repository.
- **ChatGPT Skills:** 151 skills listed in the current catalog. Project-relevant design, testing, data, SEO, and engineering skills were reviewed. The current skill catalog interface is read-only and exposes no uninstall operation.
- **Plugin Management:** current tools can search plugins and manage a specifically identified integration, but do not expose a safe complete account-wide inventory-and-prune operation. No broad uninstall or permission relaxation was performed.
- **TinyFish:** owner-prohibited; never call, install, or reintroduce it.

### Cleanup boundaries

- Keep GitHub, Cloudflare, OpenSEO, Ahrefs, Search Console, Notion, and the read-only Figma connection available.
- Keep Firecrawl connected but idle until credits renew.
- Keep Lovable, HubSpot, and Metricool dormant; they currently have no configured RAWAA Store project, CRM onboarding, or connected social channel.
- Do not delete Supabase projects, Notion pages, Figma files, or account-wide plugins solely because they are inactive for RAWAA; they may serve other projects and require exact-target authorization.
- Never send customer/order data, phone numbers, addresses, or secrets to external AI, memory, or indexing services.


## Workspace-wide tooling refresh — 2026-11-15 05:15 UTC

This section supersedes earlier workspace snapshots where values conflict. It distinguishes tools available in ChatGPT from services actually connected/configured for RAWAA.

### Current inventory and active project fit

- ChatGPT exposes **801 tool definitions across 24 integration families** and **151 Skills** in the workspace catalog. These are workspace-wide capabilities, not 801 RAWAA integrations.
- The Notion enabled-Skills endpoint currently returns **zero enabled Notion skills**. Keep the repository's `AGENTS.md` and `docs/engineering/PROJECT-MEMORY.md` as the durable project instructions and memory.
- Lovable is a **Free** workspace with **zero projects**, **zero workspace Skills**, and **zero connected MCP connectors**. Its standard/seamless integration catalog is available, but catalog availability is not an authenticated connection. No Lovable project or connector needs deleting.
- Figma remains read-only (View seat). Metricool has one brand but no connected social network. HubSpot remains un-onboarded for RAWAA. These are dormant, not broken.
- Supabase exposes `raawaa-engine-fallback` and `Ghaioooth-core`; neither is confirmed as the Store database. Do not write to either.
- GitHub and Cloudflare remain the core execution path. OpenSEO and Search Console remain the primary SEO path; Ahrefs is supplementary only where the Free endpoint supports the requested data.

### Verified quota snapshot

| Service | Current observed state | Operating decision |
|---|---|---|
| OpenSEO | **251 credits remaining** | Continue high-value audits and keyword/competitor checks; log balance after material research |
| Ahrefs | Free API-key allowance: **200,000 monthly units, 0 used**, next reset 2026-12-04; workspace units are not included | Use only endpoints that work on Free; keyword/location endpoints previously returned Insufficient plan |
| Firecrawl | **0 / 1,000 credits**; current period ends 2026-11-29 | Keep idle until renewal; do not spend or upgrade |
| Cloudflare | Connected; Web Analytics config exists with `auto_install=false` | No beacon, no collection; revisit only with privacy/CSP review |
| GitHub Actions | Store checks and Graphify available; cleanup runs automatically after main pushes and weekly | Prefer repository-native automation; no external paid runner |

### Tooling roles — keep the stack lean

- **Core:** GitHub Actions, Playwright (Chromium + WebKit), Graphify, Lighthouse CI, Cloudflare Pages, OpenSEO, Search Console, Ahrefs Free endpoints, repository-backed project memory.
- **Specialist/read-only:** Figma (View seat), Notion search, Context7, Exa, Consensus. Use only when they add evidence or implementation value.
- **Dormant until configured:** Lovable (no projects), Metricool (no connected social account), HubSpot (not onboarded), Supabase (Store DB identity unconfirmed).
- **Quota-paused:** Firecrawl until 2026-11-29.
- **Excluded:** TinyFish — explicitly prohibited; never call, install, or reintroduce.
- Do not add a second browser automation stack or a second memory database. Existing Playwright and `PROJECT-MEMORY.md` + Graphify already cover those roles.

### Global connector and Skill cleanup boundary

- No account-wide plugin, connector, Skill, workspace, or project was uninstalled or deleted in this refresh. The integrations are shared across projects, and the available plugin manager does not expose a reliable complete inventory of all cross-project dependencies.
- Lovable's large connector catalog is a list of available integrations, not evidence that each one is connected. Leave unused catalog entries alone; do not disconnect or disable an integration that is not actually connected.
- No paid plan, billing, credits, API key, DNS, customer data, Supabase schema, or Figma/Notion content was changed.
- No global Skills were bulk-imported. External skill repositories remain selectively reviewed references; do not duplicate their bundles into this project without a concrete use case.

## Cloudflare resource audit — 2026-11-15

This is an account-level inventory. Only resources positively identified as belonging to the Store were changed; other project namespaces and their dependencies remain untouched.

- **Pages:** `raawaa-store` is the active Store project. Production remains `https://raawaa-store.pages.dev`. The legacy custom-domain attachment `rawaa.eu.org` remains pending validation; no DNS was changed. The requested `rawaa.sy` domain remains a separate owner-side registration process.
- **Store Worker:** the separate `raawaa-store` Worker had no route, custom domain, D1/KV/Queue binding, or schedule, and recorded **0 invocations in the previous 30 days**. Its `workers.dev` subdomain was disabled on 2026-11-15. The Worker script and deployment metadata were retained because the API returned no exportable source content; do not delete them until a recoverable source export is available.
- **Other Workers:** seven Worker scripts exist in the account. Non-Store project workers were left untouched.
- **D1:** three databases exist and all currently report zero tables. `raawaa-engine-staging` and `raawaa-autonomous-engine` each have one Worker binding. `waa-engine-staging` has no Worker binding; it was retained because external consumers were not ruled out.
- **Queues:** two queues exist; one currently has a consumer. Both were retained because queue/dead-letter dependencies were not fully ruled out.
- **KV / R2:** zero KV namespaces. The R2 buckets endpoint returned HTTP 403 because R2 is not enabled for this account; bucket inventory is unavailable, so the bucket count is unknown.
- **Web Analytics:** the `raawaa-store.pages.dev` site configuration exists with automatic installation disabled. No beacon is injected and no analytics collection is active.
- **Secrets:** Worker binding names/counts were inspected only to establish dependencies; secret values were not read, rotated, or changed.

### App-specific permission audit

- App-specific elevated access is configured for **GitHub, Cloudflare, Notion, OpenSEO, and Firecrawl**. Other reviewed apps inherit the global low-risk setting.
- These permissions were not relaxed because the user explicitly delegated repository and integration work; narrowing them mid-task would interrupt authorized operations. No new app connection or permission grant was created in this audit.
- Plugin Management can search and manage a specifically identified integration, but does not expose a reliable complete cross-project inventory-and-prune operation. Therefore no broad account-wide plugin uninstall was attempted.
- ChatGPT exposes 801 tool definitions across 24 integration families and 151 Skills in the current catalog. The catalog interface is read-only for global Skills; no uninstall action is available. No global Skills were bulk-imported or removed.
- Notion's enabled-Skills endpoint reports zero enabled Notion Skills. Keep the repository's `AGENTS.md`, `PROJECT-MEMORY.md`, and Graphify index as the durable project guidance/memory stack.
- **TinyFish remains explicitly prohibited** and is not used, installed, or reintroduced.

### Branch lifecycle and recovery

- PR #100 merged the branch archive workflow.
- [Archive run #43680881436](https://github.com/raawaa93/Raawaa/actions/runs/43680881436) completed successfully: 29 exact-SHA annotated tags created and verified, 29 branch refs removed, zero failures.
- The exact-SHA archive allowlist is empty. All 32 inactive branch refs were tagged and removed; no archive candidates remain. The 32 recovery tags are retained in `docs/engineering/ARCHIVED-BRANCHES.md`.
- The branch archive workflow is part of the repository's maintenance stack; it preserves commit history before removing refs. Recovery steps are in `docs/engineering/ARCHIVED-BRANCHES.md`.
- No global ChatGPT plugin, workspace connector, or Skill was disabled or uninstalled. The integration catalog is shared and the audit found no safe, complete dependency map for destructive workspace-wide cleanup.


### GitHub branch protection

- The `main` branch object reports `protected=false`; the repository rulesets endpoint returned an empty list. The connected GitHub app cannot administer legacy branch-protection settings (protection endpoint returns 403). Required checks are therefore not enforced by a GitHub branch-protection rule at this snapshot; configure protection in repository Settings.


## Final repository state — 2026-11-15 05:53 UTC

- Canonical main commit: `41a37816b3e491cfa38bf8f8c81af9092f3b586a` (PR #105 merged).
- Final branch hygiene run [#43682885648](https://github.com/raawaa93/Raawaa/actions/runs/43682885648) succeeded: **17 branch refs remain**, **33 exact-SHA recovery tags** are verified, and **0 open PRs** remain.
- Pull request history: 105 total, 76 merged, 29 closed-unmerged.
- Remaining branch refs are the canonical main plus 4 backups, 3 recovery refs, 2 deploy checkpoints, 4 preview checkpoints, 1 production-deploy checkpoint, 1 release checkpoint, and 1 restore checkpoint.
- The archive allowlist and no-PR prune allowlist are empty. The branch archive workflow remains scheduled but has no inactive candidates.
- Production deployment from PR #101: `b2923438-ad03-4c5a-816d-240fa6b5bbfd`, source commit `db1e0b131f596208b10e2e9c951d1f22c9beb916`, URL https://b2923438.raawaa-store.pages.dev. The validated Pages payload contained 188 files and post-deploy security-header checks passed.
- Visual QA [run #43682151818](https://github.com/raawaa93/Raawaa/actions/runs/43682151818) covered 16 Chromium/WebKit × iPhone/desktop captures across home, serum, campaign, and privacy: all 200, zero console/page/CSP errors, zero failed or bad responses, zero horizontal overflow, and zero broken images.
- Mobile Lighthouse audit passed. Advisory scores: home 99 median (one 77 outlier), serum 86–87, campaign 96–97, privacy 100. Accessibility and best practices were 100 throughout. Campaign SEO 69 is intentional because the campaign page is noindex.
- Search Console URL-prefix property `https://raawaa-store.pages.dev/` has `siteOwner`; the separate `sc-domain:raawaa-store.pages.dev` property remains unverified.
- Workspace inventory: 801 tool definitions across 24 integration families and 151 Skills across 15 provider packages. Hostless is the only discovered private user-scope plugin and is dormant/not connected. TinyFish remains prohibited. No global plugin, connector, or Skill was uninstalled because they are shared workspace resources and no complete cross-project dependency map is available.
- Free quota snapshot: OpenSEO 251 credits; Firecrawl 0/1,000 until 2026-11-29; Ahrefs API allowance 200,000 units with 0 used and workspace quota 0. Figma is View-only; Supabase Store DB remains unidentified; Lovable has no RAWAA project, workspace Skills, or custom connectors; Metricool has no social networks connected; HubSpot is not onboarded.
- **Security follow-up:** `main.protected=false` and no repository rulesets are configured. The connected GitHub app receives 403 when attempting to administer branch protection. Enable required status checks and branch protection in repository Settings or provide an authorized GitHub connection.
- No DNS, custom-domain, Supabase schema/data, secrets, customer/order data, pricing, checkout rules, shipping policy, billing, or paid services were changed.


## Supabase read-only security and health re-audit — 2026-11-15 06:22 UTC

- Reconfirmed the Store's Supabase project as `Ghaioooth-core` in `eu-west-1`; the separate `raawaa-engine-fallback` project remains unrelated and untouched. Both currently report `ACTIVE_HEALTHY` on PostgreSQL 17.11.
- Store schemas `rawaa_store` and `commerce` were inspected read-only. Store order, outbox, rate-limit, and marketing-event tables have zero rows; the Telegram pairing challenge and recipient singleton records each have one row. No customer/order payloads or recipient identifiers were read or recorded.
- All inspected Store/commerce tables have RLS enabled. The SQL privilege audit found no `anon` or `authenticated` table grants; the listed table grants are limited to `service_role`. No policies are currently defined, which explains the 17 RLS-without-policy INFO findings; do not add blanket policies or grants without an actual client access requirement.
- Security advisor: leaked-password protection remains disabled (one WARN). Performance advisor: 10 unused-index INFO findings and one duplicate-index WARN on `rawaa_store.orders` (`orders_closed_at_idx` / `orders_retention_idx`). Health advisor returned zero findings. No indexes, auth settings, schema, data, or functions were changed.
- Six active Edge Functions remain deployed. JWT verification is enabled for `rawaa-owner-orders`, `rawaa-telegram-pair`, and `rawaa-telegram-test`; disabled for the scheduler/worker functions `rawaa-outbox` and `rawaa-retention`, and for `commerce-api`. Keep `commerce-api` disconnected from public checkout until its authorization, rate limits, idempotency, and currency contract are reviewed.
- The connector failed to retrieve source for all six Edge Functions with an internal protocol error. Treat their implementation as unreviewed; do not redeploy or enable direct order intake until source is available and independently reviewed.
- The database has two overlapping BEFORE INSERT/UPDATE triggers on `rawaa_store.orders` (`orders_set_closed_at` and `orders_track_closure`) that both maintain `closed_at`. Current behavior appears to be defensive/redundant, not a proven defect; reconcile their migration history before considering removal. No orders exist and no trigger changes were made.
- The `commerce.orders` schema still defaults to USD and has unit/courier/refusal cost defaults that are not owner-approved for this SYP storefront. Keep it isolated; do not populate costs or connect it to the live owner dashboard by assumption.
- Supabase's current changelog notes the 2026-10-30 Data API exposure change (new public-schema tables are not automatically exposed by default) and the 2026-11-10 TLS CBC cipher retirement. No observed project issue requires a migration from this read-only audit.


## Cloudflare custom-domain read-back — 2026-11-15 06:25 UTC

- Cloudflare zone `rawaa.eu.org` exists in the Raawaa account but its zone status is `pending`.
- Its DNS zone contains a proxied CNAME `rawaa.eu.org -> raawaa-store.pages.dev`; the Pages project also lists `rawaa.eu.org` as a custom domain with HTTP validation still `pending`.
- The blocker is zone activation / registrar nameserver delegation, not a missing CNAME inside the Cloudflare zone. Do not change registrar nameservers, DNS records, or Pages bindings without confirming the owner controls the domain and intends it for this store.


## Repository archive closure — 2026-11-15

- Verified tag `archive/branches/2026-11-15/maintenance/pr112-branch-hygiene-inventory-2026-11-15` points to exact preserved commit `80e320e4b95138685ad10099c6087050d66b2b62`; the original branch was deleted only after exact-SHA verification.
- The one-time archive allowlist is cleared after successful archival. This PR's branch is listed in the exact merged-head cleanup allowlist.
- No production site, DNS, Supabase schema/data, customer/order data, secrets, prices, or delivery rules changed in this maintenance closure.
