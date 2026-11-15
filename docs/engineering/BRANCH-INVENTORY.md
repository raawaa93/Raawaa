# RAWAA Store branch inventory and cleanup policy

**Snapshot:** 2026-11-15 UTC — post-cleanup and restoration, refreshed at 04:33Z  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main`  
**Cleanup PR:** #70 merged — https://github.com/raawaa93/Raawaa/pull/70  
**Visual QA docs PR:** #72 merged — https://github.com/raawaa93/Raawaa/pull/72  
**Safety follow-up PR:** #74 open — https://github.com/raawaa93/Raawaa/pull/74

## Snapshot counts

- Pre-cleanup run #43676889692 inspected **84** branch refs and **72** PRs (58 merged, 12 closed-unmerged, 2 open).
- Current repository snapshot: **35** branch refs and **75** PRs (61 merged, 13 closed-unmerged, 1 open — PR #74).
- The pre-cleanup inventory contained 54 merged-PR branch refs, 11 superseded closed-unmerged refs, and four stale no-PR refs.
- Cleanup run #43676889692 deleted **55** refs (54 merged-PR heads plus one closed-unmerged ref); three operational checkpoints were restored at their exact original PR head commits. Net refs retired: **52**.
- Follow-up cleanup run #43676951048 inspected the remaining refs and deleted **zero**.
- **4** backup refs and **3** recovery refs remained intact throughout.

## Non-negotiable retention rules

1. Keep `main`, protected refs, every `backup/*`, `recovery/*`, `restore/*`, `release/*`, and `production-deploy/*` branch, and every open-PR head.
2. Keep active `preview-deploy/*` and `deploy/*` refs; only the exact stale no-PR names below may be considered.
3. Keep merged-PR heads by default except exact names in the reviewed merged allowlist below. If a reviewed branch moved after merge, require GitHub comparison `ahead_by = 0`.
4. A closed-unmerged branch is eligible only if explicitly reviewed below and GitHub confirms `ahead_by = 0`. If a branch was reused by both merged and closed-unmerged PRs, it also requires ancestry proof.
5. A no-PR branch is eligible only if it is one of the four reviewed temporary refs below and `ahead_by = 0`.
6. Unknown refs, comparison failures, and any branch with unmerged commits are retained.
7. No force-delete, branch rewrite, file deletion, or change to main history.

## Reviewed merged-PR allowlist (54; 51 deleted, three restored/protected)

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

- `automation/generate-lockfile-2026-11-15`
- `automation/graphify-and-lighthouse-2026-11-15`
- `automation/graphify-daily-refresh-2026-11-15`
- `ci/restore-release-boundaries-2026-11-15`
- `ci/restore-release-boundaries-2026-11-15-rebased`
- `feature/campaign-nitro-offer-2026-11-14`
- `fix/manual-only-production-release`
- `qa/visual-audit-2026-11-15`
- `seo/noindex-campaign-sitemap-2026-11-15`
- `seo/remove-noindex-campaign-from-sitemap-2026-11-15`
- `seo/sitemap-noindex-policy-2026-11-15`

## Reviewed temporary no-PR allowlist (4)

- `deploy/10-percent-site-only`
- `preview-deploy/2026-11-15-main-78ece71`
- `preview-deploy/2026-11-15-post-fix`
- `preview-deploy/visual-qa-2026-11-15`

## Full branch-by-branch inventory

| Branch | PR history | Classification | Action |
|---|---|---|---|
| `automation/agent-guidance-2026-11-15` | #43 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `automation/ai-memory-graph-performance` | #32 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `automation/generate-lockfile-2026-11-15` | #60 closed | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `automation/graphify-and-lighthouse-2026-11-15` | #34 closed | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `automation/graphify-daily-refresh-2026-11-15` | #33 closed | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `automation/graphify-lighthouse-baseline-2026-11-15` | #36 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `automation/validated-auto-production-release` | #45 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `backup/continuity-hardening-2026-11-15` | #22 merged | PROTECTED ARCHIVE | Keep permanently |
| `backup/site-2026-11-14-post-mobile-audit` | — | PROTECTED ARCHIVE | Keep permanently |
| `backup/site-2026-11-14-restored-main` | — | PROTECTED ARCHIVE | Keep permanently |
| `backup/site-2026-11-15-preproduction` | — | PROTECTED ARCHIVE | Keep permanently |
| `chore/google-search-console-verification` | #48 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `chore/google-site-verification` | #47 closed | CLOSED-UNMERGED | Keep |
| `chore/indexnow-key` | #49 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `chore/lockfile-npm-ci-2026-11-15` | #59 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `ci/allow-doc-only-main-updates` | #64 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `ci/automatic-production-release` | #62 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `ci/avoid-duplicate-main-checks-2026-11-15` | #57 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `ci/restore-release-boundaries-2026-11-15` | #63 closed | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `ci/restore-release-boundaries-2026-11-15-rebased` | #66 closed | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `ci/restore-release-boundaries-v2-2026-11-15` | #65 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `dependabot/github_actions/actions/setup-python-7` | #40 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `dependabot/github_actions/actions/upload-artifact-7` | #41 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `deploy/10-percent-2026-11-14` | — | NO PR / RETAIN | Keep unless future reviewed |
| `deploy/10-percent-site-only` | — | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `docs/branch-inventory-cleanup-2026-11-14` | #11 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `docs/integration-audit-2026-11-15` | #53 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `docs/owner-currency-alignment-2026-11-14` | #10 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `docs/preview-gate-and-legacy-cleanup-2026-11-14` | #13 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `docs/record-free-tooling-and-indexing-audit-2026-11-15` | #68 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `docs/refresh-project-memory-2026-11-15` | #44 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `docs/release-readiness-backend-audit-2026-11-14` | #8 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `docs/update-live-deployment-memory-2026-11-15` | #46 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `docs/update-project-memory-2026-11-15` | #67 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `feature/campaign-nitro-offer-2026-11-14` | #6 closed | DELETED 2026-11-15 | GitHub comparison proved ahead_by=0; code already in main |
| `feature/campaign-nitro-offer-2026-11-14-v2` | #7 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `fix/campaign-canonical-2026-11-15` | #16 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `fix/cart-dialog-mobile-2026-11-15` | #17 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `fix/manual-only-production-release` | #61 closed | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `fix/owner-currency-syp-2026-11-14` | #9 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `fix/owner-pricing-safe-config-parse-2026-11-15` | #54 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `fix/preview-copy-consistency-2026-11-15` | #14 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `fix/product-structured-data` | #51 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `fix/serum-cart-estimate-sync-2026-11-15` | #23 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `fix/serum-estimate-copy-2026-11-15` | #15 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `fix/visual-audit-webkit-csp-2026-11-15` | #71 merged | MERGED NOT ALLOWLISTED | Keep |
| `main` | — | CANONICAL | Keep |
| `maintenance/canonical-source-of-truth-2026-11-14` | #4 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `maintenance/policy-regression-guard-2026-11-14` | #5 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `maintenance/repository-hygiene-2026-11-15` | #70 open | OPEN PR | Keep until PR resolves |
| `ops/add-production-deploy-workflow-2026-11-15` | #18 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `ops/fix-production-release-guard-2026-11-15` | #19 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `ops/production-release-manual-gate-2026-11-15` | #24 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `ops/update-actions-node24-2026-11-15` | #25 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `polish/home-motion-accessibility-2026-11-15` | #58 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `preview-deploy/2026-11-14` | — | NO PR / RETAIN | Keep unless future reviewed |
| `preview-deploy/2026-11-15-main-78ece71` | — | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `preview-deploy/2026-11-15-post-fix` | — | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `preview-deploy/visual-qa-2026-11-15` | — | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `preview-deploy/visual-qa-after-csp-fix-2026-11-15` | #72 merged | MERGED / RETAINED | Active preview checkpoint; protected namespace |
| `preview-deploy/visual-qa-current-2026-11-15` | #69 merged | RESTORED 2026-11-15 | Recreated at exact original PR head; protected namespace |
| `production-deploy/release-2026-11-15` | — | NO PR / RETAIN | Keep unless future reviewed |
| `qa/checkout-whatsapp-flow-2026-11-15` | #31 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `qa/visual-audit-2026-11-15` | #27 closed, #26 merged | REUSED MERGED + CLOSED | Compare with main; delete only if approved and ahead_by=0 |
| `qa/visual-audit-preview-2026-11-15` | #30 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `qa/visual-audit-trigger-fix-2026-11-15` | #28 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `qa/visual-audit-webkit-guard` | #29 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `recovery/archive-store-supabase-migrations-2026-11-15` | #56 merged | PROTECTED ARCHIVE | Keep permanently |
| `recovery/cloudflare-manifest-2026-11-14` | #1 merged | PROTECTED ARCHIVE | Keep permanently |
| `recovery/inspect-edge-functions-2026-11-15` | — | PROTECTED ARCHIVE | Keep permanently |
| `release/clean-pages-payload-2026-11-14` | #12 merged | RESTORED 2026-11-15 | Recreated at exact original PR head; protected namespace |
| `restore/integrated-store-2026-11-14` | #2 merged | RESTORED 2026-11-15 | Recreated at exact original PR head; protected namespace |
| `security/dependabot-weekly-2026-11-15` | #37 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `security/owner-pages-response-headers-2026-11-15` | #55 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `seo/link-privacy-from-home` | #50 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `seo/noindex-campaign-sitemap-2026-11-15` | #38 closed | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `seo/noindex-sitemap-cleanup-20261115` | #42 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `seo/refresh-sitemap-lastmod` | #52 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `seo/remove-noindex-campaign-from-sitemap-2026-11-15` | #35 closed | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `seo/sitemap-noindex-policy-2026-11-15` | #39 closed | RETAINED 2026-11-15 | GitHub comparison showed ahead_by > 0; unique commits preserved |
| `tooling/design-skills-playwright-2026-11-15` | #20 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `tooling/playwright-webkit-iphone-2026-11-15` | #21 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |
| `work/mobile-ux-audit-2026-11-14` | #3 merged | DELETED 2026-11-15 | Branch ref deleted by run #43676889692; merged commit and PR remain in GitHub history |

## Automation and verification

- Policy: `scripts/branch-cleanup-policy.cjs`
- Tests: `tests/unit/branch-cleanup-policy.test.cjs`
- Workflow: `.github/workflows/cleanup-merged-branches.yml`
- Store checks run `node --test tests/unit/*.test.cjs`.
- Cleanup runs on main pushes, weekly, or manually. Comparison failures retain refs; deletion failures fail the run and are reported.
- `production-cicd.yml` excludes the branch policy and visual-audit scripts so maintenance-only changes do not trigger a storefront deployment.

## Post-cleanup result

- PR #70 merged at 04:28 UTC. Cleanup run [#43676889692](https://github.com/raawaa93/Raawaa/actions/runs/43676889692) inspected 84 branches and 72 PRs, completed 15 ancestry comparisons, deleted 55 refs, and reported zero failures.
- The 55 deletions were 54 exact merged-PR branch heads plus `feature/campaign-nitro-offer-2026-11-14`, whose closed-unmerged head was proven contained in main. The corresponding PR records and commits remain in GitHub/main.
- Three operational checkpoints were unintentionally included in the merged allowlist and immediately recreated at their exact original PR head commits: `restore/integrated-store-2026-11-14` (#2), `release/clean-pages-payload-2026-11-14` (#12), and `preview-deploy/visual-qa-current-2026-11-15` (#69). These prefixes are now explicitly protected by the follow-up policy.
- No `backup/*` or `recovery/*` branch was deleted. Four backup and three recovery refs remain.
- Follow-up run [#43676951048](https://github.com/raawaa93/Raawaa/actions/runs/43676951048) inspected 29 branches, completed 13 comparisons, and deleted zero refs.
- Ten other closed-unmerged refs and all four stale no-PR refs were retained because GitHub comparison showed `ahead_by > 0`; their unique commits remain.
- Net branch refs retired after restoration: 52. Current snapshot: 35 branch refs, 75 PRs (61 merged, 13 closed-unmerged, one open PR #74).
- PR #74 adds regression tests for `restore/*`, `release/*`, `production-deploy/*`, and active preview/deploy protection, and excludes maintenance scripts from production release triggers. Do not run another cleanup pass until PR #74 is merged and its workflow passes.
