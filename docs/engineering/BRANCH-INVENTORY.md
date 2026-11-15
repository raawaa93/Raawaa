# RAWAA Store branch inventory and cleanup record

**Verified:** 2026-11-15 UTC, after PR #76  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main`  
**Current cleanup PR:** #79 — https://github.com/raawaa93/Raawaa/pull/79  
**Previous cleanup PR:** #70 merged  
**Operational namespace protection:** #74 merged  
**Visual QA fixes:** #71, #72, #75, #76 merged

## Current snapshot

- Branch refs: **40**.
- Pull requests: **79** total — **64 merged**, **13 closed-unmerged**, **2 open.
- Backup refs: **4**.
- Recovery refs: **3**.
- Reviewed merged-PR allowlist: **57** names.
- Reviewed closed-unmerged allowlist: **11** names.
- Reviewed no-PR temporary allowlist: **4** names.

## Cleanup execution history

1. Run [#43676889692](https://github.com/raawaa93/Raawaa/actions/runs/43676889692) inspected 84 refs and deleted **55** with zero failures: **53 merged-PR heads plus two stale preview refs**. No closed-unmerged PR branch was deleted.
2. That run also removed three operational merged refs: `restore/integrated-store-2026-11-14`, `release/clean-pages-payload-2026-11-14`, and `preview-deploy/visual-qa-current-2026-11-15`. They were restored to their exact original PR head commits: `b74fcf3dadecf52c0c40ce848ef67b104d7f73ec`, `8cba6b94ce39282999d3c4c86ca2a60845c805a2`, and `7ca62ffaaf2be5fd337255d66679621be399ddae`.
3. Run [#43676951048](https://github.com/raawaa93/Raawaa/actions/runs/43676951048) inspected the remaining refs and deleted zero.
4. Run [#43677232271](https://github.com/raawaa93/Raawaa/actions/runs/43677232271) exposed the missing operational namespace protection and deleted the same three refs again. They were restored to the same exact original PR head commits.
5. PR #74 added protection for `restore/*`, `release/*`, `production-deploy/*`, all `deploy/*`, active `preview-deploy/*`, and all backup/recovery namespaces.
6. Run [#43677406307](https://github.com/raawaa93/Raawaa/actions/runs/43677406307) completed with **zero deletion candidates and zero failures** after the safety fix.
7. Run [#43677570136](https://github.com/raawaa93/Raawaa/actions/runs/43677570136) inspected 37 refs and also completed with **zero deletion candidates and zero failures**.
8. PR #79 tightens one more gap: every closed-unmerged branch on the superseded allowlist must also be proven contained in `main` (`ahead_by = 0`) before deletion. The earlier implementation did not enforce this consistently.

## Retention rules

1. Keep `main`, every protected ref, `backup/*`, `recovery/*`, `restore/*`, `release/*`, `production-deploy/*`, and every `deploy/*` branch.
2. Keep every active `preview-deploy/*` branch. Only exact temporary preview refs listed in the stale allowlist are eligible for cleanup, and only after `ahead_by = 0`.
3. Keep every open-PR head.
4. Merged PR heads are deleted only when the exact branch name is on the reviewed allowlist and the current head matches the merged PR head. If moved, require `ahead_by = 0`.
5. Closed-unmerged refs require exact allowlist membership **and** `ahead_by = 0`. Reused refs also require ancestry proof.
6. No-PR refs require exact stale allowlist membership and `ahead_by = 0`.
7. Unknown refs, comparison failures, and any branch with unique commits ahead of main are retained.
8. The workflow deletes Git refs only; it never deletes Git objects manually, repository files, recovery snapshots, deployments, DNS, secrets, external projects, or customer data.

## Current full branch inventory

| Branch | PR history | Classification | Decision |
|---|---|---|---|
| `automation/generate-lockfile-2026-11-15` | #60 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by = 0 |
| `automation/graphify-and-lighthouse-2026-11-15` | #34 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by = 0 |
| `automation/graphify-daily-refresh-2026-11-15` | #33 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by = 0 |
| `backup/continuity-hardening-2026-11-15` | #22 merged | OPERATIONAL / BACKUP | Keep permanently |
| `backup/site-2026-11-14-post-mobile-audit` | — | OPERATIONAL / BACKUP | Keep permanently |
| `backup/site-2026-11-14-restored-main` | — | OPERATIONAL / BACKUP | Keep permanently |
| `backup/site-2026-11-15-preproduction` | — | OPERATIONAL / BACKUP | Keep permanently |
| `chore/google-site-verification` | #47 closed | CLOSED-UNMERGED | Retain |
| `ci/restore-release-boundaries-2026-11-15` | #63 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by = 0 |
| `ci/restore-release-boundaries-2026-11-15-rebased` | #66 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by = 0 |
| `deploy/10-percent-2026-11-14` | — | OPERATIONAL / BACKUP | Keep permanently |
| `deploy/10-percent-site-only` | — | OPERATIONAL / BACKUP | Keep permanently |
| `docs/project-tooling-and-branch-inventory-2026-11-15` | — | REVIEWED TEMP / NO PR | Delete only if ahead_by = 0 |
| `docs/visual-qa-and-inventory-finalization-2026-11-15` | #76 merged | REVIEWED MERGED | Delete exact merged head; moved head requires ahead_by = 0 |
| `feature/campaign-nitro-offer-2026-11-14` | #6 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by = 0 |
| `fix/branch-hygiene-protect-operational-refs-2026-11-15` | #74 merged | REVIEWED MERGED | Delete exact merged head; moved head requires ahead_by = 0 |
| `fix/manual-only-production-release` | #61 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by = 0 |
| `fix/visual-audit-csp-screenshots-2026-11-15` | #75 merged | REVIEWED MERGED | Delete exact merged head; moved head requires ahead_by = 0 |
| `fix/visual-audit-webkit-csp-2026-11-15` | #71 merged | REVIEWED MERGED | Delete exact merged head; moved head requires ahead_by = 0 |
| `fix/visual-qa-webkit-csp-regression-2026-11-15` | #78 merged | REVIEWED MERGED | Delete exact merged head; moved head requires ahead_by = 0 |
| `main` | — | CANONICAL | Keep |
| `maintenance/branch-cleanup-consolidated-2026-11-15` | — | NO PR / RETAIN | Retain pending review |
| `maintenance/branch-cleanup-final-2026-11-15` | #79 open | OPEN PR | Keep until PR resolves |
| `maintenance/branch-hygiene-followup-2026-11-15` | #73 closed | CLOSED-UNMERGED | Retain |
| `maintenance/finish-branch-cleanup-2026-11-15` | #77 open | OPEN PR | Keep until PR resolves |
| `maintenance/repository-hygiene-2026-11-15` | #70 merged | MERGED / NOT ALLOWLISTED | Retain |
| `preview-deploy/2026-11-14` | — | ACTIVE / HISTORICAL PREVIEW | Keep |
| `preview-deploy/2026-11-15-main-78ece71` | — | REVIEWED TEMP / NO PR | Delete only if ahead_by = 0 |
| `preview-deploy/visual-qa-after-csp-fix-2026-11-15` | #72 merged | ACTIVE / HISTORICAL PREVIEW | Keep |
| `preview-deploy/visual-qa-current-2026-11-15` | #69 merged | ACTIVE / HISTORICAL PREVIEW | Keep |
| `production-deploy/release-2026-11-15` | — | OPERATIONAL / BACKUP | Keep permanently |
| `qa/visual-audit-2026-11-15` | #27 closed, #26 merged | REUSED MERGED + UNMERGED | Require ancestry proof; retain if ahead_by > 0 |
| `recovery/archive-store-supabase-migrations-2026-11-15` | #56 merged | OPERATIONAL / BACKUP | Keep permanently |
| `recovery/cloudflare-manifest-2026-11-14` | #1 merged | OPERATIONAL / BACKUP | Keep permanently |
| `recovery/inspect-edge-functions-2026-11-15` | — | OPERATIONAL / BACKUP | Keep permanently |
| `release/clean-pages-payload-2026-11-14` | #12 merged | OPERATIONAL / BACKUP | Keep permanently |
| `restore/integrated-store-2026-11-14` | #2 merged | OPERATIONAL / BACKUP | Keep permanently |
| `seo/noindex-campaign-sitemap-2026-11-15` | #38 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by = 0 |
| `seo/remove-noindex-campaign-from-sitemap-2026-11-15` | #35 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by = 0 |
| `seo/sitemap-noindex-policy-2026-11-15` | #39 closed | REVIEWED CLOSED-UNMERGED | Delete only if ahead_by = 0 |

## Reviewed allowlists

### Merged PR refs (57)
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
- `qa/checkout-whatsapp-flow-2026-11-15`
- `qa/visual-audit-2026-11-15`
- `qa/visual-audit-preview-2026-11-15`
- `qa/visual-audit-trigger-fix-2026-11-15`
- `qa/visual-audit-webkit-guard`
- `security/dependabot-weekly-2026-11-15`
- `security/owner-pages-response-headers-2026-11-15`
- `seo/link-privacy-from-home`
- `seo/noindex-sitemap-cleanup-20261115`
- `seo/refresh-sitemap-lastmod`
- `tooling/design-skills-playwright-2026-11-15`
- `tooling/playwright-webkit-iphone-2026-11-15`
- `work/mobile-ux-audit-2026-11-14`
- `fix/branch-hygiene-protect-operational-refs-2026-11-15`
- `fix/visual-audit-csp-screenshots-2026-11-15`
- `fix/visual-audit-webkit-csp-2026-11-15`
- `docs/visual-qa-and-inventory-finalization-2026-11-15`
- `maintenance/branch-cleanup-final-2026-11-15`
- `fix/visual-qa-webkit-csp-regression-2026-11-15`

### Closed-unmerged refs (11)
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

### Temporary no-PR refs (4)
- `preview-deploy/visual-qa-2026-11-15`
- `preview-deploy/2026-11-15-post-fix`
- `preview-deploy/2026-11-15-main-78ece71`
- `docs/project-tooling-and-branch-inventory-2026-11-15`

## Operational checkpoint notes

- The three refs deleted by the first and third cleanup runs are restored at the original PR head SHAs listed above.
- `deploy/10-percent-site-only` remains protected under `deploy/*`; it is not in the stale allowlist.
- `preview-deploy/2026-11-15-main-78ece71` remains one commit ahead and is not deleted.
- `chore/google-site-verification` remains as an unmerged Search Console verification fallback.
- `maintenance/repository-hygiene-2026-11-15` and `maintenance/branch-hygiene-followup-2026-11-15` retain post-merge/unmerged changes and are not in deletion allowlists.
- `docs/project-tooling-and-branch-inventory-2026-11-15` is behind main with `ahead_by = 0`; PR #79 adds it to the reviewed stale list for safe removal.

## Next verification

- Wait for PR #79 Store checks and Graphify to pass.
- Merge only after the complete check set is green.
- Verify the next cleanup run's deleted list, remaining branch count, and zero failures.
- Resolve or close superseded PR #77 after PR #79 is merged; do not force-delete its branch without exact-head verification.
