# RAWAA Store branch inventory and cleanup policy

**Snapshot:** 2026-11-15 UTC — refreshed after PR #72  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main`  
**Active cleanup PR:** #70 — https://github.com/raawaa93/Raawaa/pull/70

## Snapshot counts

- **29** branch refs currently present.
- **72** repository PRs: 60 merged, 12 closed without merge, 0 open.
- **56** merged-PR refs individually reviewed for cleanup.
- **11** closed-unmerged refs individually reviewed for cleanup.
- **4** temporary no-PR refs individually reviewed for cleanup.
- **4** backup refs and **3** recovery refs are protected.

## Non-negotiable retention rules

1. Keep `main`, protected refs, every `backup/*` branch, every `recovery/*` branch, and every open-PR head.
2. Keep merged-PR heads by default. Delete only exact reviewed merged refs in the allowlist below. If a reviewed branch moved after merge, require GitHub comparison `ahead_by = 0`.
3. A closed-unmerged branch is eligible only if explicitly reviewed below and GitHub confirms `ahead_by = 0`. Reused branches require ancestry proof.
4. A no-PR branch is eligible only if it is one of the four reviewed temporary refs below and `ahead_by = 0`.
5. Unknown refs, comparison failures, and any branch with unmerged commits are retained.
6. No force-delete, branch rewrite, file deletion, or change to main history.

## Reviewed merged-PR allowlist (56)

- `automation/agent-guidance-2026-11-15`
- `fix/visual-audit-webkit-csp-2026-11-15`
- `preview-deploy/visual-qa-after-csp-fix-2026-11-15`
- `automation/ai-memory-graph-performance`
- `automation/graphify-lighthouse-baseline-2026-11-15`
- `automation/validated-auto-production-release`
- `chore/google-search-console-verification`
- `chore/indexnow-key`
- `chore/lockfile-npm-ci-2026-11-15`
- `ci/allow-doc-only-main-updates`
- `ci/automatic-production-release`
- `ci/avoid-duplicate-main-checks-2026-11-15`
- `ci/restore-release-boundaries-v2-2026-11-15`
- `dependabot/github_actions/actions/setup-python-7`
- `dependabot/github_actions/actions/upload-artifact-7`
- `docs/branch-inventory-cleanup-2026-11-14`
- `docs/integration-audit-2026-11-15`
- `docs/owner-currency-alignment-2026-11-14`
- `docs/preview-gate-and-legacy-cleanup-2026-11-14`
- `docs/record-free-tooling-and-indexing-audit-2026-11-15`
- `docs/refresh-project-memory-2026-11-15`
- `docs/release-readiness-backend-audit-2026-11-14`
- `docs/update-live-deployment-memory-2026-11-15`
- `docs/update-project-memory-2026-11-15`
- `feature/campaign-nitro-offer-2026-11-14-v2`
- `fix/campaign-canonical-2026-11-15`
- `fix/cart-dialog-mobile-2026-11-15`
- `fix/owner-currency-syp-2026-11-14`
- `fix/owner-pricing-safe-config-parse-2026-11-15`
- `fix/preview-copy-consistency-2026-11-15`
- `fix/product-structured-data`
- `fix/serum-cart-estimate-sync-2026-11-15`
- `fix/serum-estimate-copy-2026-11-15`
- `maintenance/canonical-source-of-truth-2026-11-14`
- `maintenance/policy-regression-guard-2026-11-14`
- `ops/add-production-deploy-workflow-2026-11-15`
- `ops/fix-production-release-guard-2026-11-15`
- `ops/production-release-manual-gate-2026-11-15`
- `ops/update-actions-node24-2026-11-15`
- `polish/home-motion-accessibility-2026-11-15`
- `preview-deploy/visual-qa-current-2026-11-15`
- `qa/checkout-whatsapp-flow-2026-11-15`
- `qa/visual-audit-2026-11-15`
- `qa/visual-audit-preview-2026-11-15`
- `qa/visual-audit-trigger-fix-2026-11-15`
- `qa/visual-audit-webkit-guard`
- `release/clean-pages-payload-2026-11-14`
- `restore/integrated-store-2026-11-14`
- `security/dependabot-weekly-2026-11-15`
- `security/owner-pages-response-headers-2026-11-15`
- `seo/link-privacy-from-home`
- `seo/noindex-sitemap-cleanup-20261115`
- `seo/refresh-sitemap-lastmod`
- `tooling/design-skills-playwright-2026-11-15`
- `tooling/playwright-webkit-iphone-2026-11-15`
- `work/mobile-ux-audit-2026-11-14`

## Reviewed closed-unmerged allowlist (11)

- `ci/restore-release-boundaries-2026-11-15-rebased`
- `ci/restore-release-boundaries-2026-11-15`
- `fix/manual-only-production-release`
- `automation/generate-lockfile-2026-11-15`
- `seo/sitemap-noindex-policy-2026-11-15`
- `seo/noindex-campaign-sitemap-2026-11-15`
- `seo/remove-noindex-campaign-from-sitemap-2026-11-15`
- `automation/graphify-and-lighthouse-2026-11-15`
- `automation/graphify-daily-refresh-2026-11-15`
- `qa/visual-audit-2026-11-15`
- `feature/campaign-nitro-offer-2026-11-14`

## Reviewed temporary no-PR allowlist (4)

- `preview-deploy/visual-qa-2026-11-15`
- `preview-deploy/2026-11-15-post-fix`
- `preview-deploy/2026-11-15-main-78ece71`
- `deploy/10-percent-site-only`

## Full branch-by-branch inventory

| Branch | PR history | Classification | Action |
|---|---|---|---|
| `automation/generate-lockfile-2026-11-15` | #60 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by=0 |
| `automation/graphify-and-lighthouse-2026-11-15` | #34 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by=0 |
| `automation/graphify-daily-refresh-2026-11-15` | #33 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by=0 |
| `backup/continuity-hardening-2026-11-15` | #22 merged | PROTECTED ARCHIVE | Keep permanently |
| `backup/site-2026-11-14-post-mobile-audit` | — | PROTECTED ARCHIVE | Keep permanently |
| `backup/site-2026-11-14-restored-main` | — | PROTECTED ARCHIVE | Keep permanently |
| `backup/site-2026-11-15-preproduction` | — | PROTECTED ARCHIVE | Keep permanently |
| `chore/google-site-verification` | #47 closed | CLOSED-UNMERGED | Keep |
| `ci/restore-release-boundaries-2026-11-15` | #63 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by=0 |
| `ci/restore-release-boundaries-2026-11-15-rebased` | #66 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by=0 |
| `deploy/10-percent-2026-11-14` | — | NO PR / RETAIN | Keep |
| `deploy/10-percent-site-only` | — | REVIEWED TEMP REF | Delete only if ahead_by=0 |
| `docs/project-tooling-and-branch-inventory-2026-11-15` | — | NO PR / RETAIN | Keep |
| `feature/campaign-nitro-offer-2026-11-14` | #6 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by=0 |
| `fix/manual-only-production-release` | #61 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by=0 |
| `fix/visual-audit-webkit-csp-2026-11-15` | #71 merged | REVIEWED MERGED | Delete if exact merged head or moved head ahead_by=0 |
| `main` | — | CANONICAL | Keep |
| `maintenance/repository-hygiene-2026-11-15` | #70 merged | MERGED NOT ALLOWLISTED | Keep |
| `preview-deploy/2026-11-14` | — | NO PR / RETAIN | Keep |
| `preview-deploy/2026-11-15-main-78ece71` | — | REVIEWED TEMP REF | Delete only if ahead_by=0 |
| `preview-deploy/visual-qa-after-csp-fix-2026-11-15` | #72 merged | REVIEWED MERGED | Delete if exact merged head or moved head ahead_by=0 |
| `production-deploy/release-2026-11-15` | — | NO PR / RETAIN | Keep |
| `qa/visual-audit-2026-11-15` | #27 closed, #26 merged | REUSED MERGED + CLOSED | Compare; delete only if reviewed and ahead_by=0 |
| `recovery/archive-store-supabase-migrations-2026-11-15` | #56 merged | PROTECTED ARCHIVE | Keep permanently |
| `recovery/cloudflare-manifest-2026-11-14` | #1 merged | PROTECTED ARCHIVE | Keep permanently |
| `recovery/inspect-edge-functions-2026-11-15` | — | PROTECTED ARCHIVE | Keep permanently |
| `seo/noindex-campaign-sitemap-2026-11-15` | #38 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by=0 |
| `seo/remove-noindex-campaign-from-sitemap-2026-11-15` | #35 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by=0 |
| `seo/sitemap-noindex-policy-2026-11-15` | #39 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by=0 |

## Automation and verification

- Policy: `scripts/branch-cleanup-policy.cjs`
- Tests: `tests/unit/branch-cleanup-policy.test.cjs`
- Workflow: `.github/workflows/cleanup-merged-branches.yml`
- Store checks run `node --test tests/unit/*.test.cjs`.
- Cleanup runs on main pushes, weekly, or manually. Comparison failures retain refs; deletion failures fail the run and are reported.
- `production-cicd.yml` excludes branch-policy and visual-audit scripts so maintenance-only changes do not trigger a storefront deployment.
- PR #70's own branch is deliberately not in the merged-branch allowlist; after PR #70 merges and the cleanup workflow runs, remove its now-merged ref separately after verifying the PR merge.

## Post-cleanup result

Pending PR #70 merge and first successful cleanup run. Append the run URL, exact deleted names, exact retained names, and any errors from GitHub Actions. Do not infer completion from the workflow definition alone.
