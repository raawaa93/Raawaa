# RAWAA Store branch inventory and cleanup record

**Verified:** 2026-11-15 04:29 UTC  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main`  
**Cleanup PR:** #70 — https://github.com/raawaa93/Raawaa/pull/70  
**Follow-up cleanup PR:** #73 — https://github.com/raawaa93/Raawaa/pull/73  
**First cleanup run:** https://github.com/raawaa93/Raawaa/actions/runs/43676889692

## Verified result

- Initial refs inspected by the workflow: **84**.
- Policy-approved deletion candidates: **55**.
- Branch refs successfully deleted: **55**.
- Deletion failures: **0**.
- Workflow result: **success**.
- Branch refs immediately after the run: **29**.
- Current branch refs after subsequent PR merges and new/recurring refs: **33**.
- Pull request history: **73 total; 60 merged; 12 closed-unmerged; 1 open**.
- Preserved backup refs: **4**.
- Preserved recovery refs: **3**.

The cleanup run removed only reviewed merged refs, plus reviewed closed-unmerged or temporary refs whose commit history was proven fully contained in `main`. The complete deletion log is recorded below.

## Non-negotiable retention rules

1. Never delete `main`, protected refs, any `backup/*`, any `recovery/*`, or an open-PR head.
2. Merged PR refs are deleted only when explicitly listed in the reviewed allowlist. If their head moved after merge, require GitHub comparison `ahead_by = 0`.
3. Closed-unmerged refs require explicit review and `ahead_by = 0`; if a ref was reused by merged and unmerged PRs, ancestry proof is mandatory.
4. No-PR refs require an explicit reviewed allowlist entry and `ahead_by = 0`.
5. Unknown refs, failed comparisons, and refs with commits ahead of main are retained.
6. No force deletion, branch rewrite, file deletion, or changes to main history.

## Current branch-by-branch inventory

| Branch | PR / state | Decision |
|---|---|---|
| `automation/generate-lockfile-2026-11-15` | Closed unmerged #60 | Retain; unresolved commits or ancestry not proven contained |
| `automation/graphify-and-lighthouse-2026-11-15` | Closed unmerged #34 | Retain; unresolved commits or ancestry not proven contained |
| `automation/graphify-daily-refresh-2026-11-15` | Closed unmerged #33 | Retain; unresolved commits or ancestry not proven contained |
| `backup/continuity-hardening-2026-11-15` | Backup archive | Keep permanently |
| `backup/site-2026-11-14-post-mobile-audit` | Backup archive | Keep permanently |
| `backup/site-2026-11-14-restored-main` | Backup archive | Keep permanently |
| `backup/site-2026-11-15-preproduction` | Backup archive | Keep permanently |
| `chore/google-site-verification` | Closed unmerged #47 | Retain; unresolved commits or ancestry not proven contained |
| `ci/restore-release-boundaries-2026-11-15-rebased` | Closed unmerged #66 | Retain; unresolved commits or ancestry not proven contained |
| `ci/restore-release-boundaries-2026-11-15` | Closed unmerged #63 | Retain; unresolved commits or ancestry not proven contained |
| `deploy/10-percent-2026-11-14` | No PR reference | Retain; not proven disposable |
| `deploy/10-percent-site-only` | No PR reference | Retain; not proven disposable |
| `docs/project-tooling-and-branch-inventory-2026-11-15` | No PR reference | Delete next run (ahead_by=0 verified) |
| `feature/campaign-nitro-offer-2026-11-14` | Closed unmerged #6 | Retain; unresolved commits or ancestry not proven contained |
| `fix/manual-only-production-release` | Closed unmerged #61 | Retain; unresolved commits or ancestry not proven contained |
| `fix/visual-audit-webkit-csp-2026-11-15` | Merged PR #71 | Delete in next successful cleanup run |
| `main` | Canonical | Keep |
| `maintenance/branch-hygiene-followup-2026-11-15` | Open PR | Keep until merged or closed |
| `maintenance/repository-hygiene-2026-11-15` | Merged PR #70 | Delete in next successful cleanup run |
| `preview-deploy/visual-qa-after-csp-fix-2026-11-15` | Merged PR #72 | Delete in next successful cleanup run |
| `preview-deploy/visual-qa-current-2026-11-15` | Merged PR #69 | Delete in next successful cleanup run |
| `preview-deploy/2026-11-14` | No PR reference | Retain; not proven disposable |
| `preview-deploy/2026-11-15-main-78ece71` | No PR reference | Retain; not proven disposable |
| `production-deploy/release-2026-11-15` | No PR reference | Retain; not proven disposable |
| `qa/visual-audit-2026-11-15` | Merged + closed-unmerged ref | Retain until explicit ancestry review |
| `recovery/archive-store-supabase-migrations-2026-11-15` | Recovery archive | Keep permanently |
| `recovery/cloudflare-manifest-2026-11-14` | Recovery archive | Keep permanently |
| `recovery/inspect-edge-functions-2026-11-15` | Recovery archive | Keep permanently |
| `release/clean-pages-payload-2026-11-14` | Merged PR #12 | Delete in next successful cleanup run |
| `restore/integrated-store-2026-11-14` | Merged PR #2 | Delete in next successful cleanup run |
| `seo/noindex-campaign-sitemap-2026-11-15` | Closed unmerged #38 | Retain; unresolved commits or ancestry not proven contained |
| `seo/remove-noindex-campaign-from-sitemap-2026-11-15` | Closed unmerged #35 | Retain; unresolved commits or ancestry not proven contained |
| `seo/sitemap-noindex-policy-2026-11-15` | Closed unmerged #39 | Retain; unresolved commits or ancestry not proven contained |

## Deleted branch refs — first successful cleanup run

- `automation/agent-guidance-2026-11-15`
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
- `preview-deploy/visual-qa-2026-11-15`
- `preview-deploy/visual-qa-current-2026-11-15`
- `preview-deploy/2026-11-15-post-fix`
- `qa/checkout-whatsapp-flow-2026-11-15`
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

## Follow-up cleanup

PR #73 adds the newly merged heads from PRs #70–#72 to the reviewed allowlist and adds the generated docs-only ref after GitHub confirmed `ahead_by = 0`. It also includes its own maintenance branch so it can be retired after the follow-up merge. The next cleanup run will verify all refs again; it will not delete any branch with an open PR or unmerged commits.

## Automation and verification

- Policy: `scripts/branch-cleanup-policy.cjs`
- Tests: `tests/unit/branch-cleanup-policy.test.cjs`
- Workflow: `.github/workflows/cleanup-merged-branches.yml`
- Store checks run `node --test tests/unit/*.test.cjs`.
- Cleanup runs on pushes to main, weekly, or manually.
- Workflow comparison errors retain refs; any deletion failure fails the workflow.
- Maintenance-only changes are excluded from production release triggers.
