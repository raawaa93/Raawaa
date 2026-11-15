# RAWAA Store agent guidance

## Source of truth
- Branch hygiene: retire unchanged same-repository merged PR heads, plus exact reviewed superseded closed-unmerged and stale no-PR refs. If a branch head moved after merge, require GitHub comparison to confirm `ahead_by = 0` unless the exact branch is in the reviewed superseded allowlist. Preserve `main`, all `backup/*`, `recovery/*`, `restore/*`, `release/*`, and `production-deploy/*` refs, active `preview-deploy/*` and `deploy/*` refs, protected refs, open-PR heads, and unreviewed work. Only exact stale no-PR refs in the reviewed allowlist may be considered after `ahead_by = 0`. See `docs/engineering/BRANCH-INVENTORY.md`.
- Do not delete global ChatGPT plugins or Skills as part of repository cleanup; they may be shared by other projects. Curate project relevance in `docs/engineering/TOOLING-REGISTRY.md`.
- Treat this repository's current main branch and owner-confirmed policy as authoritative.
- Read `docs/engineering/PROJECT-MEMORY.md` at the start of substantial work; update it only when a durable, verified decision changes.
- Preserve the existing static-site architecture unless a measured need justifies a change.
- Keep the 10% Sham Cash-only discount and free delivery for every payment method.
- Never invent product photography, customer reviews, testimonials, prices, or business credentials.
- Never publish production from a feature or recovery branch. Production releases are authorized automatically from canonical `main` only after the production workflow's complete validation succeeds. Feature branches use isolated previews for QA.

## Design and implementation skills
Use these upstream skills as specialist references when a Codex environment has them installed:
- Emil Kowalski design engineering: https://github.com/emilkowalski/skills (MIT). Install the upstream collection with `npx skills@latest add emilkowalski/skills -a codex`.
- Taste Skill: https://github.com/Leonxlnx/taste-skill (MIT). The upstream README documents the Codex plugin installation:
  `codex plugin marketplace add Leonxlnx/taste-skill`
  `codex plugin add taste-skill@taste-skill`
  Start a new Codex session after installation. The skill is named `design-taste-frontend`; do not refer to the older/unverified `gpt-tasteskill` name.
- Figma MCP is connected through the user's Figma integration. Inspect the actual file and available edit permissions before making changes.

These upstream skills are not vendored into this repository. Install them in the Codex workspace using the commands above; do not claim they are active merely because this file references them. Taste Skill's full checks expect its accompanying assets/scripts, Node 22+, and Chrome/Chromium. Do not copy only its SKILL.md and pretend the bundle is complete.

## Browser testing
- Install exactly the committed dependency tree with `npm ci --ignore-scripts --no-audit --no-fund`; do not use mutable `npm install` in CI.
- Run `npm audit --audit-level=high`; the OSV Scanner workflow also scans dependency PRs and runs weekly.
- Install browsers with `npx playwright install chromium webkit`.
- Run `npm run test:e2e` for route and responsive-overflow smoke tests in Chromium, desktop Safari (WebKit), and iPhone WebKit.
- Add tests for every user-visible critical journey before changing cart, pricing, or WhatsApp behavior.
- Prefer deterministic Playwright assertions over AI-driven browser automation for repeatable checks.
- Use Browser Use only for exploratory tasks that require agentic navigation; use Crawl4AI for public-page extraction. Neither replaces Playwright regression tests.

## Optional agent memory
- If ProjectMem MCP is explicitly connected in the active coding environment, use it for project issues, attempts, fixes, and decisions. Do not assume the server is installed or available.
- Never store API keys, credentials, customer names, phone numbers, addresses, order payloads, or private customer/commercial data in memory tools.
- Keep ProjectMem's `.projectmem/` directory local and untracked. Do not enable automatic git hooks, watcher, global cross-project memory, or git-history backfill for this repository without a separate review.
- Graphify is a regenerable code-structure index, not the source of truth for business rules. Use its offline code-only workflow; do not send repository source to a hosted model for automated indexing.
- If optional memory tools are unavailable, use `docs/engineering/PROJECT-MEMORY.md`, this file, Git history, tests, and preserved recovery checkpoints.


## Antigravity, Codex, and other compatible agents

- This file is also an Antigravity workspace rule. Antigravity discovers root `AGENTS.md` and skills under `.agents/skills/<skill>/SKILL.md`.
- Use the existing `docs/engineering/PROJECT-MEMORY.md` as the durable project context; do not create a second competing memory source.
- Rules define invariants; Skills define reusable multi-step procedures. Add only reviewed, licensed, task-relevant skills. Do not bulk-import skill repositories or duplicate existing Playwright, Graphify, or design workflows.
- Jules is read-only after 2026-11-11 and is scheduled to wind down on 2026-12-31; do not use it for new work.
- Antigravity's individual tier is $0/month with basic weekly rate limits, but model availability and quotas can change. Never enable paid credits or paid API usage.

## SEO and performance invariants

- A page marked `noindex` must not appear in `sitemap.xml`. Keep intentional campaign landing pages available for paid traffic if required, but exclude them from search sitemaps.
- Product selection query variants that are UI states of `/serum` should canonicalize to `/serum`; do not create duplicate indexable product URLs without an explicit information-architecture decision.
- Do not use Google's Indexing API for ordinary storefront pages. It is restricted to JobPosting and livestreaming VideoObject content.
- Use the existing Lighthouse CI workflow. Current measured category gates: performance >=80, accessibility >=95, best practices >=95. SEO and intentional noindex states remain warnings. Do not turn off checks to obtain a green run.
- Graphify is pinned to `graphifyy==0.9.109`, runs daily offline, and must exclude `.github/workflows/`, dependencies, generated output, recovery archives, and secrets from its graph.

## Exact release boundary

- Cloudflare Pages project: `raawaa-store`; deployment mode: Direct Upload.
- A push to `main` that changes website source triggers full validation and then an automatic production deployment. Documentation-only and workflow-only pushes are excluded from production release. Production release is push-only; manual workflow dispatch is disabled and must not be reintroduced.
- The owner has granted standing authorization for routine validated production releases, repository changes, merges, and no-cost tooling. Never bypass exact-SHA validation, latest-main freshness, clean-source, Cloudflare credential, or successful technical validation gates. Do not spend money, link billing, expose secrets, or perform irreversible/destructive customer-data/database actions. DNS/domain ownership changes and destructive migrations require a specific recoverable plan and operation-specific confirmation.
- The isolated preview target must remain `raawaa-recovery-preview`; never use a preview as a production alias.
- Run `node scripts/check-site.mjs` and the build validator before release. For browser changes, run the Playwright suite. For SEO/performance changes, inspect Lighthouse artifacts. Merge after required checks pass; production deploy follows automatically only for website-source changes on `main`.

## Commercial policy remains immutable without owner instruction

- 10% Sham Cash discount only for eligible Sham Cash orders.
- Free delivery across all Syrian governorates for every payment method.
- Cash on delivery receives no Sham Cash discount.
- Current blends contain oils and fragrance; never claim fragrance-free.
- Do not invent reviews, testimonials, stock images, credentials, prices, or unsupported customizations.


## Repository and tooling hygiene

- Read docs/engineering/BRANCH-INVENTORY.md before retiring branches and docs/engineering/TOOLING-REGISTRY.md before adding or replacing integrations.
- The cleanup policy is implemented in scripts/branch-cleanup-policy.cjs and tested in tests/unit/branch-cleanup-policy.test.cjs.
- The cleanup workflow deletes same-repository merged PR heads only when the current branch head still matches the merged PR head; if the head moved, it requires `ahead_by = 0` or an exact reviewed superseded allowlist. It also deletes exact reviewed superseded closed-PR and stale no-PR refs. It always preserves main, protected branches, every backup/*, recovery/*, restore/*, release/*, and production-deploy/* branch, all active preview-deploy/* and deploy/* refs, and all open-PR heads.
- Never add a branch to a deletion allowlist without a separate inventory showing its replacement is already on main and no unresolved PR depends on it.
- Run node --test tests/unit/*.test.cjs when changing branch cleanup rules. Store checks runs this automatically on PRs.
- Record connected tools, skill status, and dated free-tier balances in docs/engineering/TOOLING-REGISTRY.md. A tool being available in ChatGPT does not mean it is connected to RAWAA or safe to mutate.
- Prefer free quotas and open-source tools. Never activate billing or paid API usage, and never use TinyFish.
- Keep Graphify as an offline code map and PROJECT-MEMORY.md as durable project context. Do not add overlapping memory services without a concrete persistence need.
- Do not uninstall integrations or delete external workspace content (Notion pages, Supabase projects, Figma files, or customer data) based on inactivity. Exact target and service-specific permission/authorization are required.
- Inactive branch cleanup must preserve history: never delete a branch with unique commits directly. Use the reviewed archival policy to create and verify an annotated `archive/branches/YYYY-MM-DD/<branch>` tag before deleting the original ref; retain open-PR, backup, recovery, deploy, release, and preview refs.
