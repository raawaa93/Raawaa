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
- If ProjectMem MCP is connected, it may record issues, attempts, fixes, and decisions. Never assume it is installed or connected.
- Do not record secrets, API keys, customer names, phone numbers, addresses, order payloads, or private commercial data in memory tools.
- ProjectMem's local event store should remain untracked and ignored. Do not install its git hooks, background watcher, global cross-project memory, or automatic git-history backfill for this repository without a separate review.
- Graphify is a regenerable code-structure index, not the authoritative business-policy memory. Use code-only mode in CI; do not send repository files to a hosted LLM as part of automated indexing.
- If optional tools are unavailable, this file, `AGENTS.md`, Git history, tests, and preserved recovery checkpoints remain the fallback.

## Updating this memory

Update only when a verified, durable fact changes (for example: owner-approved policy, architecture, deployment boundary, or validated recovery decision). Include a date and evidence link for material changes. Do not treat a proposal or an unverified assumption as an established fact.
