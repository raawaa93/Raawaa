# RAWAA Store — durable project memory

This file is the repository-backed memory that survives AI sessions, client changes, and expired hosted quotas. Keep it concise, factual, and updated when a material decision changes. It contains no credentials, customer records, or private order data.

## Canonical project

- Repository: `raawaa93/Raawaa`; `main` is the only canonical website source.
- Cloudflare Pages project: `raawaa-store`; production URL: https://raawaa-store.pages.dev.
- Pages uses Direct Upload, not Git integration. A merge to `main` is **not** a production deployment.
- Production release is exclusively the existing `RAWAA production CI and release` workflow, manually dispatched from `main` with `confirm_production=yes`. It validates the exact current `main` SHA and refuses stale/dirty source.
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
- Keep the production workflow's manual approval gate. Never add an automatic production deploy to push/PR workflows.
- Do not change DNS, secrets, Cloudflare account settings, Supabase data/schema, customer/order records, or security permissions without a demonstrated need and explicit authorization.
- Do not confuse unrelated Supabase projects. Verify the project ID before any backend operation.

## AI/tooling memory policy

- Read this file and `AGENTS.md` before substantial repository work.
- Keep decisions and lessons here when they are durable and useful across tools. Keep transient debugging details out; use an optional local memory tool for those.
- **Primary optional event memory — [ProjectMem](https://github.com/riponcm/projectmem):** MIT, local-first, no cloud quota or API key. Pin the reviewed v0.3.5 rather than auto-upgrading. The project has one maintainer and its PyPI v0.3.5 artifacts did not show trusted-publishing provenance in the inspected release metadata; treat it as an opt-in trial, not a trusted dependency. Its changelog shows active bug fixing but also a young project with meaningful recent corrections.
- On a developer machine with a local clone and a compatible MCP client, install in an isolated Python environment and initialize conservatively:

  ```bash
  python3 -m venv ~/.venvs/rawaa-projectmem
  ~/.venvs/rawaa-projectmem/bin/python -m pip install 'projectmem==0.3.5'
  cd /path/to/Raawaa
  ~/.venvs/rawaa-projectmem/bin/pjm init --no-hooks --no-global --no-watch --no-backfill --no-claude-md --no-structure
  ```

  Then configure the MCP client using the configuration printed by `pjm init` and the official client-specific guide. This local MCP process is not automatically connected to ChatGPT's hosted environment. Keep `.projectmem/` untracked; this repository ignores it.
- ProjectMem's security policy documents that its event log is append-only, its git hooks execute code on commits, and its generated summaries/maps may be sent to the connected AI provider. The conservative init flags above avoid hooks, watcher, global memory, automatic history ingestion, and generated project-structure cache. Never record secrets, API keys, customer names, phone numbers, addresses, order payloads, or private commercial data.
- **Secondary local fallback — [MCP Memory Service](https://github.com/doobidoo/mcp-memory-service):** Apache-2.0; local SQLite-vec storage and local ONNX embeddings are documented, so semantic retrieval can work without a hosted embedding API. Requires Python 3.11+ and a persistent local service; it is semantic memory, not a replacement for ProjectMem's typed issue/attempt/fix history. Keep it as a separate fallback and do not run both stores until data ownership and duplicate-write behavior are tested.
- **Code-structure index — [Graphify](https://github.com/Graphify-Labs/graphify):** use the pinned, verified `graphifyy==0.9.108` CLI via the on-demand GitHub Actions workflow. The workflow indexes code only, explicitly disables model backends, and stores its generated graph as a 14-day artifact. The graph is regenerable and is not authoritative business-policy memory.
- **Performance measurement — Lighthouse CI:** mobile baseline for the homepage, serum, campaign, and privacy pages. Reports stay in GitHub Actions artifacts; no hosted upload. The initial run has no score gates. Establish a measured baseline before adding budgets.
- Promptfoo and Langfuse remain candidates for a later stage when there is a real model/agent pipeline to evaluate and observe. Sharp remains deferred until image references and visual equivalence are audited; do not batch-replace production imagery before that.
- If optional tools or free hosted quotas are unavailable, this file, `AGENTS.md`, Git history, tests, and preserved recovery checkpoints remain the fallback. ProjectMem and Graphify are local/self-run tools with no vendor free-tier quota; the graph workflow is reproducible and can be rerun.

## Updating this memory

Update only when a verified, durable fact changes (for example: owner-approved policy, architecture, deployment boundary, or validated recovery decision). Include a date and evidence link for material changes. Do not treat a proposal or an unverified assumption as an established fact.
