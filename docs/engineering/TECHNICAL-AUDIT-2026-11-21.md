# RAWAA Store — Technical Audit & Execution Record

**Audit date:** 2026-11-21  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main`  
**Audit baseline:** `48fa6d2dba4edd3ae9350e61362de680aa288754`  
**Production release:** Cloudflare Pages deployment `7ea90c29-002b-403a-9b89-18d220544781`  
**Scope:** repository, CI/CD, Pages, storefront behavior, Supabase, Search Console/SEO, integrations and operational blockers.

> This is an evidence snapshot, not a claim that every external service or user-facing flow has been independently exercised. Each section distinguishes verified state from blocked or owner-dependent work. Secrets, customer identifiers, auth tokens, and private configuration values are intentionally excluded.

## 1. Executive state

- The active storefront is a static/PWA Cloudflare Pages site. The storefront cart prepares a reviewable WhatsApp handoff; it does not submit orders to a central API.
- The owner dashboard is a separate Supabase-backed surface. Its configured Supabase project is shared staging/test infrastructure, not a dedicated production order database.
- The latest main production pipeline passed all validation stages and deployed the validated main commit.
- The Pages custom domain `rawaa.eu.org` remains pending because Cloudflare reports `CNAME record not set`. No DNS or nameserver change was made.
- Google Search Console is connected to the URL-prefix property. In the last 28-day window the property returned one impression, zero clicks, and one query row (`rowaa`, average position 73). Only the homepage is currently reported indexed; the other inspected URLs are not yet recognized by Google.
- Google Analytics 4 is not connected to the OpenSEO project.
- Deployed Edge Function source could not be retrieved through the available Supabase connector. JWT-off functions therefore remain unreviewed at implementation level.
- GitHub main has no branch protection and no rulesets. The connected GitHub integration receives HTTP 403 from the branch-protection endpoint.
- No paid services, billing, customer/order records, production database schema, prices, discount rules, delivery rules, secrets, or DNS records were changed.

## 2. Repository and release evidence

### Canonical state

- Main commit: `48fa6d2dba4edd3ae9350e61362de680aa288754`.
- Tree enumeration: 335 paths; no path matching the retired microsite name remains in the current main tree.
- Open pull requests: zero after PR #146 merged.
- Branch enumeration immediately after PR #146: 18 refs. The additional merged working branch is `fix/remove-retired-route-build-guard-2026-11-21`; its retirement policy is being added separately. Do not treat the previous 17-ref snapshot as current until that cleanup completes.
- Archive-tag enumeration: 40 archive refs. Retain all recovery tags unless individually reviewed.

### PR #146 and the release failure

- PR #146 removed obsolete route-specific deployment-builder exclusions/assertions from `scripts/build-deploy.mjs` and corrected the stale README inventory.
- The prior production run `44838646326` passed browser regression, site policy checks, and 56 unit tests, then failed because the builder still required a retired-route robots directive that had already been removed.
- PR #146 checks all passed: Store checks, offline Graphify, and mobile performance baseline.
- PR #146 merged as `48fa6d2dba4edd3ae9350e61362de680aa288754`.

### Production pipeline and deployment

- Production run `44840290249`: success.
- Successful validation steps: locked dependency install, high-severity dependency audit, Chromium/WebKit installation, HTTPS browser regression, site/policy integrity, unit/release-policy tests, clean Pages payload build, and source-cleanliness check.
- Automatic deployment job succeeded and published the exact validated main commit.
- Cloudflare deployment: `7ea90c29-002b-403a-9b89-18d220544781`, URL `https://7ea90c29.raawaa-store.pages.dev`, source SHA `48fa6d2dba4edd3ae9350e61362de680aa288754`, stage `success`.
- Post-deploy security-header verification passed.
- Live-production Visual QA run `44840577452` completed successfully against `https://raawaa-store.pages.dev`: 16 captures (home, serum, campaign, privacy × Chromium/WebKit × iPhone 13/desktop), all HTTP 200, zero automated issues, zero console/CSP/page errors, zero failed/bad requests, zero broken or incomplete visible images, zero horizontal overflow, and no viewport/document-width mismatch. The 58-file screenshot/report artifact was downloaded and inspected; mobile screenshots for all four routes and both browser engines were reviewed.
- Direct HTTP access from this audit runtime itself failed at DNS resolution for Cloudflare Pages. The GitHub Action runner did reach the live production alias and captured the 16 successful cases; this is the source of the live QA evidence.

### Mobile Lighthouse baseline

- GitHub mobile performance run `44840290194` passed on the same production source commit.
- Median mobile Performance scores: home 99 (one 75 outlier), serum 87, campaign 96, privacy 100.
- Accessibility and Best Practices scored 100 across all four pages. Campaign SEO 69 is intentional because the page is `noindex,follow`.
- Serum is the primary performance target: median LCP 3.8s, render-blocking CSS savings estimate 670–730ms, image delivery savings estimate 74 KiB, cache-lifetime savings estimate 405 KiB, unused JavaScript 42 KiB, and unused CSS 41 KiB.
- The current serum hero loads the 86 KB `rawaa-olive.jpg`; responsive AVIF/WebP variants exist in the repository but the per-product image arrays are empty and the hero `picture` lacks its dynamic source elements. This is a concrete, low-risk optimization candidate; it has not yet been changed.
- The homepage's single 75 outlier had 1,290ms TBT and 2.9s main-thread work; the other two samples scored 99. Investigate the outlier before making broad JS changes.

## 3. Storefront architecture and commercial behavior

- Public pages: home, serum/product, campaign, privacy, and 404. Owner-facing pages are under `owner/`.
- Front end: static HTML/CSS/JavaScript, PWA service worker, local cart state, WhatsApp handoff.
- The cart flow opens a reviewable WhatsApp message. The UI explicitly states the site does not send the message automatically.
- No direct Supabase or `commerce-api` request was found in `js/cart.js`.
- Product catalog: three formulas; each formula offers 30 ml, 50 ml, and 100 ml sizes.
- Currency: SYP. Existing prices are owner-approved and must not be changed by routine engineering work.
- Sham Cash discount: 10% only for eligible orders paid using Sham Cash. COD and other payment methods receive no discount.
- Delivery: free across configured delivery zones and payment methods.
- Product images are identified in the site as conceptual/design visuals, not genuine stock photography. Do not present them as real inventory photography.
- No unapproved fragrance/oil customization options are exposed in the active configuration.
- Campaign page is intentionally `noindex,follow` and absent from the sitemap. Its lower SEO score is intentional; do not make it indexable as a performance fix.
- The current cart-to-WhatsApp flow is not a central order ingestion system. `rawaa_store.orders` was empty at inspection; no verified path from WhatsApp handoff to that table was established.

## 4. Supabase architecture and security

### Project identity

- Canonical `owner/settings.mjs` points the owner dashboard to project `Ghaiooth-core` (`oyoyozdugicmnkfhjovo`).
- This is a shared staging/test project used by the separate council/control-plane system. It is not a dedicated production Store database.
- `raawaa-engine-fallback` (`xuwtuhfqjjwszxqkmivj`) is not referenced by the storefront owner settings.
- Do not redirect checkout to either project or run migrations against the shared project as a routine task.

### Schema snapshot

- `rawaa_store.orders`: 0 rows.
- `rawaa_store.notification_outbox`: 0 rows.
- `rawaa_store.order_rate_limit`: 0 rows.
- `rawaa_store.marketing_preference_events`: 0 rows.
- Telegram recipient and pairing singleton tables: one row each; values were not read.
- `commerce.orders`, `commerce.order_events`, and `commerce.rate_limits`: 0 rows each.
- All inspected Store/commerce tables have RLS enabled.
- `rawaa_store` is service-role-only: `anon` and `authenticated` have no schema/table access or policies. Preserve that model; Edge Functions must authenticate the owner and enforce authorization before using the service role.
- `commerce` has RLS enabled but no policies and no grants, including to `service_role`. Its currency/cost assumptions are not aligned with the SYP Store. Keep it staged and disconnected.

### Deployed Edge Functions

| Function | JWT verification | Audit status |
|---|---:|---|
| `rawaa-owner-orders` | on | Source unavailable; inspect before modifying |
| `rawaa-telegram-pair` | on | Source unavailable; inspect before modifying |
| `rawaa-telegram-test` | on | Source unavailable; inspect before modifying |
| `rawaa-outbox` | off | Must verify own scheduler/request authentication |
| `rawaa-retention` | off | Must verify own scheduler/request authentication |
| `commerce-api` | off | Must remain disconnected from public checkout pending review |

- The supported connector's `get_edge_function` retrieval repeatedly failed with an internal protocol error. Stop retrying that same path. Obtain source through a supported Supabase export or dashboard/CLI route before changing or certifying these functions.
- Last-24-hour log aggregation returned Edge, Postgres, and PgBouncer logs, but this audit did not inspect customer payloads. No matching Store/commerce function request was demonstrated in the earlier filtered slice.
- Advisors: 17 informational RLS-enabled/no-policy findings, one warning that leaked-password protection is disabled, ten unused-index findings, and one duplicate-index warning. The RLS findings are consistent with the service-role-only model, not proof of public exposure.
- The duplicate `orders_closed_at_idx` / `orders_retention_idx` definitions must not be removed without a reviewed, versioned migration; the archived migration README says to retain them pending migration-history reconciliation.
- No schema, data, auth, index, function, or secret changes were made.

## 5. SEO, indexing and analytics

### Crawl

OpenSEO audit `55f9dc3b-93e4-406d-b937-59f07aaa0dad` completed with 7 crawled URLs:

- Homepage: HTTP 200, one H1, 351 words, no images missing alt text.
- `/serum`: HTTP 200, one H1, 529 words, no images missing alt text.
- `/privacy`: HTTP 200, one H1, 858 words, no images missing alt text.
- `/index.html`: HTTP 308 redirect to the canonical route.
- Three serum query-string variants: HTTP 200 and canonicalized to the clean serum URL. These are informational canonicalization results, not defects.
- No critical or warning SEO issues were returned; the only three issues were the expected canonicalized query variants.
- Lighthouse was not run by this OpenSEO crawl. The separate GitHub mobile Lighthouse baseline is the performance evidence.

### Search Console

- Selected property: `https://raawaa-store.pages.dev/`, permission `siteOwner`.
- The separate domain property `sc-domain:raawaa-store.pages.dev` is `siteUnverifiedUser`.
- Last 28-day data available in this audit: one impression, zero clicks, CTR 0%, average position 73, query `rowaa`.
- URL inspection: homepage is indexed and allowed; Google last crawled it on 2026-11-15 using mobile. `/serum`, `/privacy`, and `/campaign` were reported as URLs Google had not recognized yet. The sitemap and internal routes exist; indexing is not yet demonstrated.
- GA4 is not connected (`ga4_not_connected`). No sessions, engagement, conversion, checkout, or revenue analytics can currently be validated.
- Next steps: connect the correct GA4 property if one exists; request indexing for the canonical serum/privacy URLs through Search Console; keep the campaign noindex; recheck after Google recrawls. Do not claim indexation before inspection confirms it.

## 6. Cloudflare and domain

- Pages project: `raawaa-store`; production branch `main`; no Pages Functions.
- Active project domain returned by project metadata: `raawaa-store.pages.dev`.
- Custom-domain endpoint reports `rawaa.eu.org` as pending, verification error `CNAME record not set`.
- Do not change DNS, nameservers, registrar settings, or custom-domain bindings until the owner confirms the domain is controlled and intended for the Store.
- The user has not purchased the new domain; this does not block work on the existing Pages URL or other project tasks.

## 7. Workspace tools and constraints

- Runtime catalog at audit time: **817 tool definitions across 24 integration families** and **152 Skills**.
- Verified project-connected tools used in this audit: GitHub, Cloudflare, Supabase, Notion, OpenSEO, and Ahrefs.
- Ahrefs free API-key allowance: 200,000 units with 0 used; workspace allowance: 0. Do not assume paid endpoints are available.
- Firecrawl: connected but quota was 0/1,000 until its recorded renewal on 2026-11-29; keep paused until quota is confirmed.
- OpenSEO Search Console is connected; GA4 is not.
- Other workspace catalog entries are not automatically project connections. Figma/Metricool/HubSpot/Lovable and other tools must be verified per account/workspace before use. Prior audit recorded Figma as View-only, Metricool without social networks connected, HubSpot not onboarded, and Lovable with no RAWAA project; those are historical connection notes, not proof of today's exact state.
- TinyFish is prohibited and must not be used. Arena is paused and must not receive work unless the owner explicitly resumes it.
- Do not purchase credits, subscribe, enable billing, launch ads, or incur paid usage without explicit authorization.

## 8. GitHub governance and recovery

- `main.protected=false`; repository rulesets endpoint returned an empty list.
- The GitHub integration receives HTTP 403 from the branch-protection endpoint. This integration cannot configure required checks or branch protection.
- User action required: open repository Settings → Rules → Rulesets (or Branch protection rules) and require PR review/status checks for `main`, including Store checks and production validation. A GitHub connection with repository administration scope is also acceptable.
- The repository contains 40 archive refs at this snapshot. Preserve backups, recovery refs, deployment checkpoints, and archive tags; no broad cleanup is justified.
- The branch hygiene workflow did not delete the just-merged PR #146 branch because it was not yet included in the reviewed exact-branch allowlist. A dedicated policy/test update is in progress; deletion should happen only after the workflow confirms the exact merged head and allowlist entry.

## 9. Owner-supplied inputs and external blockers

1. Export the six deployed Edge Function sources from Supabase or provide an authenticated supported source export. Needed to complete the security review.
2. Connect GA4 to the OpenSEO project if a GA4 property exists. Needed to measure traffic and conversion.
3. Verify genuine product photography and complete INCI/manufacturer/supplier documentation before making stronger product claims or representing the current concepts as stock.
4. Review and approve the privacy notice for the actual operating jurisdiction before treating it as final legal policy.
5. If central order records are required, decide the intended order intake and payment workflow. Current WhatsApp handoff and owner dashboard database are separate; do not connect the staged `commerce-api` by assumption.
6. Configure GitHub branch protection/rulesets with repository-admin access.
7. Domain setup remains owner-controlled and pending; no DNS action was taken.

## 10. Prioritized next work

1. Optimize serum responsive image delivery, then re-run mobile Lighthouse and production visual QA.
2. Finish exact-SHA retirement of the two merged PR working branches through the reviewed branch-cleanup policy.
3. Obtain and review deployed Edge Function sources, prioritizing the three JWT-off functions.
4. Establish a dedicated production order backend and an explicit, tested order intake path only if the owner chooses central order records.
5. Connect GA4 and correct the OpenSEO project market/language settings to match the actual sales market.
6. Improve Search Console discovery/indexing for canonical non-campaign pages and monitor real search demand.
7. Optimize mobile Lighthouse findings: cache lifetimes, render-blocking resources, unminified/unused CSS and JS, image delivery, document latency, and serum LCP. Keep accessibility/best-practice scores intact.
8. Add repository branch protection and required checks.
9. Only after evidence-backed readiness, consider new domain activation or any additional integrations.

## 11. Evidence links

- [PR #146](https://github.com/raawaa93/Raawaa/pull/146)
- [Production CI and release #44840290249](https://github.com/raawaa93/Raawaa/actions/runs/44840290249)
- [Mobile performance baseline #44840290194](https://github.com/raawaa93/Raawaa/actions/runs/44840290194)
- [Offline source graph #44840290192](https://github.com/raawaa93/Raawaa/actions/runs/44840290192)
- [Visual QA #44840577452](https://github.com/raawaa93/Raawaa/actions/runs/44840577452)
- [Cloudflare immutable deployment](https://7ea90c29.raawaa-store.pages.dev)
- [OpenSEO audit](https://app.openseo.so/p/8609bf87-b153-41f8-b10c-c716c36a5c4f/audit?auditId=55f9dc3b-93e4-406d-b937-59f07aaa0dad)
