# RAWAA Store tooling and skills registry

**Last verified:** 2026-11-15  
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

## Connected tool families available in this ChatGPT workspace

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

Other available skill/tool families include data analysis, user settings, and file-library operations. Availability in this workspace does not mean every service is connected to a RAWAA account.

## Free-tier balances observed on 2026-11-15

| Service | Observed allowance / remaining | Decision |
|---|---|---|
| Ahrefs API | Free subscription shows 200,000 API units; 0 used; reset 2026-12-04 | Public Domain Rating endpoint works; Keywords Explorer and location-management endpoints returned `Insufficient plan`; do not assume the displayed unit quota unlocks those endpoints |
| OpenSEO | 251 credits remaining after current audit and keyword research | Active RAWAA SEO project; prioritize high-value audits and regional keyword research |
| Firecrawl | 0 remaining of 1,000 plan credits; period ends 2026-11-29 | Pause Firecrawl calls until renewal |
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
- Branch hygiene PR #70 merged. Run #43676889692 inspected 84 refs and deleted 55: 53 merged-PR heads plus two stale preview refs. It also deleted three operational merged refs; all three were restored at their exact original PR head SHAs. No backup/recovery refs were deleted. PR #74 merged with regression tests and permanent protection for `backup/`, `recovery/`, `restore/`, `release/`, `production-deploy/`, `deploy/`, and active `preview-deploy/` refs.

## Skills available in the ChatGPT workspace

The current skill catalog lists 151 skills. Relevant installed/available skills include:

- Superpowers: brainstorming, writing-plans, executing-plans, test-driven-development, systematic-debugging, verification-before-completion, finishing-a-development-branch.
- OpenSEO: SEO audit, SEO project setup, keyword research, competitive landscape, competitor analysis, keyword clustering, AI visibility audit, SEO reporting.
- Firecrawl: web extraction and deep research; calls paused while its credit balance is zero.
- Design and engineering: website design-system extraction, read-docs, Figma workflows.
- Data: data quality, product/business analysis, market sizing, KPI design, reports, dashboards, and visualization.

The catalog being available in ChatGPT is not the same as vendoring a skill into the repository or activating it in Codex/Antigravity.

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
- Figma MCP is read-only with the current View seat.
- Supabase account exposes raawaa-engine-fallback and Ghaioooth-core only; neither is confirmed as the Store database.
- Notion search surfaced the recovery record, development history, operating model, and sales operating pages. Preserve these until a page-by-page consolidation proves a specific page redundant.
- TinyFish is explicitly prohibited; do not call, install, or reintroduce it.
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


## Verified cleanup and visual QA state — 2026-11-15

- Run #43676889692: 84 refs inspected; 55 deleted (53 merged-PR refs and two stale preview refs); zero deletion failures.
- The three operational refs accidentally deleted by that run were `restore/integrated-store-2026-11-14`, `release/clean-pages-payload-2026-11-14`, and `preview-deploy/visual-qa-current-2026-11-15`. They were restored at exact original PR head SHAs. Run #43677232271 repeated the deletion before the protection fix; the same three refs were restored again.
- PR #74 merged. The cleanup policy now protects `backup/*`, `recovery/*`, `restore/*`, `release/*`, `production-deploy/*`, all `deploy/*`, active `preview-deploy/*`, and all open-PR heads.
- Runs #43677406307 (35 refs) and #43677570136 (37 refs) completed with zero deletion candidates and zero failures.
- PR #79 finalizes the allowlists, adds the fully integrated docs-only branch only after GitHub proves `ahead_by = 0`, and requires `ahead_by = 0` for every closed-unmerged cleanup candidate.
- PR #77 is a duplicate cleanup PR and will be closed as superseded after PR #79 merges; its branch will remain until exact-head retirement is verified.
- PRs #71, #72, #75, #76, and #78 merged visual-QA improvements. The strict CSP policy remains unchanged.
- The latest Graphify and visual-QA artifacts remain in GitHub Actions; do not mark visual QA complete until the final screenshots and report are inspected.
