# RAWAA Store branch inventory and cleanup record

**Verified:** 2026-11-15 04:35 UTC  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main`  
**Primary cleanup PR:** #70 — https://github.com/raawaa93/Raawaa/pull/70  
**Safety hardening PR:** #74 — https://github.com/raawaa93/Raawaa/pull/74  
**Visual screenshot CSP fix:** #75 — https://github.com/raawaa93/Raawaa/pull/75  
**First cleanup run:** https://github.com/raawaa93/Raawaa/actions/runs/43676889692  
**Safety-policy verification run:** https://github.com/raawaa93/Raawaa/actions/runs/43677406307

## Current snapshot

- Branch refs: **36**.
- Pull requests: **75** total — **62 merged**, **13 closed without merge**, **0 open**.
- Backup refs: **4**.
- Recovery refs: **3**.
- No open PRs at this snapshot.

## Cleanup execution and correction history

1. First cleanup run #43676889692 inspected 84 refs and deleted **55** reviewed refs with **zero failures**.
2. The subsequent run #43677232271 exposed an important policy gap: it deleted three operational refs (`preview-deploy/visual-qa-current-2026-11-15`, `release/clean-pages-payload-2026-11-14`, and `restore/integrated-store-2026-11-14`). The two historical checkpoints were restored to their exact original PR head commits. All three refs are now protected from routine cleanup.
3. PR #74 expanded permanent protection to `restore/*`, `release/*`, and `production-deploy/*`, and protects active `preview-deploy/*` and `deploy/*` refs. It also removed the operational checkpoints from the deletion allowlist and added regression tests.
4. Safety verification run #43677406307 completed successfully with **zero deletion candidates** and **zero failures**. It inspected 35 refs and retained all current operational and recovery checkpoints.
5. PR #73 was closed without merge by the repository owner. Its proposed allowlist expansion was not applied. The corresponding merged refs remain retained rather than being deleted without that review.

## Current branch-by-branch inventory

| Branch | Classification | Decision |
|---|---|---|
| `automation/generate-lockfile-2026-11-15` | Closed-unmerged #60 | Retain; do not delete unmerged work |
| `automation/graphify-and-lighthouse-2026-11-15` | Closed-unmerged #34 | Retain; do not delete unmerged work |
| `automation/graphify-daily-refresh-2026-11-15` | Closed-unmerged #33 | Retain; do not delete unmerged work |
| `backup/continuity-hardening-2026-11-15` | Backup | Keep permanently |
| `backup/site-2026-11-14-post-mobile-audit` | Backup | Keep permanently |
| `backup/site-2026-11-14-restored-main` | Backup | Keep permanently |
| `backup/site-2026-11-15-preproduction` | Backup | Keep permanently |
| `chore/google-site-verification` | Closed-unmerged #47 | Retain; do not delete unmerged work |
| `ci/restore-release-boundaries-2026-11-15-rebased` | Closed-unmerged #66 | Retain; do not delete unmerged work |
| `ci/restore-release-boundaries-2026-11-15` | Closed-unmerged #63 | Retain; do not delete unmerged work |
| `deploy/10-percent-2026-11-14` | No PR | Retain unless individually reviewed and ahead_by = 0 |
| `deploy/10-percent-site-only` | No PR | Retain unless individually reviewed and ahead_by = 0 |
| `docs/project-tooling-and-branch-inventory-2026-11-15` | No PR | Retain unless individually reviewed and ahead_by = 0 |
| `docs/visual-qa-and-inventory-finalization-2026-11-15` | No PR | Retain unless individually reviewed and ahead_by = 0 |
| `feature/campaign-nitro-offer-2026-11-14` | Closed-unmerged #6 | Retain; do not delete unmerged work |
| `fix/branch-hygiene-protect-operational-refs-2026-11-15` | Merged #74 | Retain unless added to reviewed deletion allowlist |
| `fix/manual-only-production-release` | Closed-unmerged #61 | Retain; do not delete unmerged work |
| `fix/visual-audit-csp-screenshots-2026-11-15` | Merged #75 | Retain unless added to reviewed deletion allowlist |
| `fix/visual-audit-webkit-csp-2026-11-15` | Merged #71 | Retain unless added to reviewed deletion allowlist |
| `main` | Canonical | Keep |
| `maintenance/branch-hygiene-followup-2026-11-15` | Closed-unmerged #73 | Retain; do not delete unmerged work |
| `maintenance/repository-hygiene-2026-11-15` | Merged #70 | Retain unless added to reviewed deletion allowlist |
| `preview-deploy/visual-qa-after-csp-fix-2026-11-15` | Merged #72 | Retain unless added to reviewed deletion allowlist |
| `preview-deploy/visual-qa-current-2026-11-15` | Merged #69 | Retain unless added to reviewed deletion allowlist |
| `preview-deploy/2026-11-14` | No PR | Retain unless individually reviewed and ahead_by = 0 |
| `preview-deploy/2026-11-15-main-78ece71` | No PR | Retain unless individually reviewed and ahead_by = 0 |
| `production-deploy/release-2026-11-15` | Operational/recovery checkpoint | Keep permanently |
| `qa/visual-audit-2026-11-15` | Merged and closed-unmerged PR reuse | Retain until explicit ancestry review |
| `recovery/archive-store-supabase-migrations-2026-11-15` | Operational/recovery checkpoint | Keep permanently |
| `recovery/cloudflare-manifest-2026-11-14` | Operational/recovery checkpoint | Keep permanently |
| `recovery/inspect-edge-functions-2026-11-15` | Operational/recovery checkpoint | Keep permanently |
| `release/clean-pages-payload-2026-11-14` | Operational/recovery checkpoint | Keep permanently |
| `restore/integrated-store-2026-11-14` | Operational/recovery checkpoint | Keep permanently |
| `seo/noindex-campaign-sitemap-2026-11-15` | Closed-unmerged #38 | Retain; do not delete unmerged work |
| `seo/remove-noindex-campaign-from-sitemap-2026-11-15` | Closed-unmerged #35 | Retain; do not delete unmerged work |
| `seo/sitemap-noindex-policy-2026-11-15` | Closed-unmerged #39 | Retain; do not delete unmerged work |

## Deletion and retention rules

1. Never delete `main`, protected refs, `backup/*`, `recovery/*`, `restore/*`, `release/*`, or `production-deploy/*`.
2. Preserve active `preview-deploy/*` and `deploy/*` refs. Only exact stale temporary refs explicitly listed in the policy may be considered, and only after GitHub confirms `ahead_by = 0`.
3. Merged PR heads are deleted only when explicitly allowlisted. Moved heads require `ahead_by = 0`.
4. Closed-unmerged refs require explicit review and `ahead_by = 0`; reused refs require the same proof.
5. Unknown refs, unreviewed branches, and comparison failures are retained.
6. No force deletion, branch rewrite, file deletion, or change to main history.

## Automation and tests

- Policy: `scripts/branch-cleanup-policy.cjs`
- Tests: `tests/unit/branch-cleanup-policy.test.cjs`
- Workflow: `.github/workflows/cleanup-merged-branches.yml`
- Store checks run `node --test tests/unit/*.test.cjs`.
- Cleanup runs on main pushes, weekly, or manually; errors retain refs and deletion failures fail the workflow.
- The visual QA workflow now audits production after successful production releases and previews after successful preview deployments; see the visual QA automation PR.

