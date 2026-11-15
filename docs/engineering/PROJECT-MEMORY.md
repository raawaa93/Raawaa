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
- OpenSEO project has 500 credits remaining. No Google Search Console accounts or GA4 properties are connected; connection is still an owner-side OAuth step. No GSC performance data is available until connection.
- `package.json` declares `@playwright/test` as a version range and `package-lock.json` is absent. Reproducible dependency lock and OSV lockfile scan remain outstanding; do not claim vulnerability scanning complete.
