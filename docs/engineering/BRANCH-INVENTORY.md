# RAWAA Store branch inventory and cleanup policy

**Snapshot:** 2026-11-15 04:42 UTC  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main`  
**Branch cleanup:** PR #70 merged  
**Operational namespace protection:** PR #74 merged  
**Visual QA harness fix:** PR #75 merged  
**Visual QA/inventory documentation:** PR #76 merged  
**Current cleanup and tooling audit:** PR #77 open

## Current counts

- **37** branch refs and **77** pull requests: **63 merged**, **13 closed without merge**, **1 open** (#77).
- The initial cleanup run #43676889692 inspected 84 refs and deleted 55 reviewed refs.
- A later pre-fix run #43677232271 deleted three operational checkpoints; all three were restored at their exact original commit IDs.
- PR #74 protects `backup/*`, `recovery/*`, `restore/*`, `release/*`, `production-deploy/*`, `deploy/*`, and active `preview-deploy/*` namespaces.
- Post-PR #74 cleanup run #43677406307 inspected 35 refs, completed 12 ancestry comparisons, found zero deletion candidates, and succeeded.
- Current protected operational/archive refs: 4 backup, 3 recovery, 1 restore, 1 release, 1 production-deploy, 4 preview, and 2 deploy.
- PR #77 now reviews five current cleanup candidates: four exact merged PR heads (#71, #74, #75, #76) and one no-PR documentation ref proven `ahead_by=0`, `behind_by=3`.
- PR #77's own branch is also allowlisted for cleanup after merge, but the open-PR guard prevents deletion while it is open. This avoids leaving a merged maintenance branch behind.

## Retention rules

1. Keep `main`, protected refs, and all backup, recovery, restore, release, and production-deploy namespaces.
2. Keep every `deploy/*` ref and every active `preview-deploy/*` ref. Only exact reviewed stale names can be considered.
3. Keep all open-PR heads.
4. Delete merged PR heads only when the exact branch name is reviewed and the current SHA matches the merged PR head. Moved refs require GitHub ancestry proof.
5. Delete closed-unmerged refs only when individually reviewed AND GitHub proves `ahead_by=0`.
6. Delete no-PR refs only when individually reviewed AND GitHub proves `ahead_by=0`.
7. Any comparison failure retains the branch. Never force-delete or rewrite main history.

## Full current inventory

| Branch | PR history | Compare with main | Classification / action |
|---|---|---:|---|
| `automation/generate-lockfile-2026-11-15` | #60 closed unmerged | ahead 5 / behind 19 | Retain unique dependency/workflow commits |
| `automation/graphify-and-lighthouse-2026-11-15` | #34 closed unmerged | ahead 5 / behind 36 | Retain unique workflow/config commits |
| `automation/graphify-daily-refresh-2026-11-15` | #33 closed unmerged | ahead 6 / behind 36 | Retain unique workflow/config commits |
| `backup/continuity-hardening-2026-11-15` | #22 merged | protected | Keep rollback checkpoint |
| `backup/site-2026-11-14-post-mobile-audit` | none | not compared | Keep rollback checkpoint |
| `backup/site-2026-11-14-restored-main` | none | not compared | Keep rollback checkpoint |
| `backup/site-2026-11-15-preproduction` | none | not compared | Keep rollback checkpoint |
| `chore/google-site-verification` | #47 closed unmerged | ahead 1 / behind 27 | Retain unique verification file |
| `ci/restore-release-boundaries-2026-11-15-rebased` | #66 closed unmerged | ahead 4 / behind 10 | Retain unique release-boundary commits |
| `ci/restore-release-boundaries-2026-11-15` | #63 closed unmerged | ahead 9 / behind 15 | Retain unique release-boundary commits |
| `deploy/10-percent-2026-11-14` | none | not compared | Keep operational deployment checkpoint |
| `deploy/10-percent-site-only` | none | not compared | Keep operational deployment checkpoint |
| `docs/project-tooling-and-branch-inventory-2026-11-15` | none | ahead 0 / behind 3 | Reviewed no-PR cleanup candidate |
| `docs/visual-qa-and-inventory-finalization-2026-11-15` | #76 merged | exact merged head | Reviewed merged-ref cleanup candidate |
| `feature/campaign-nitro-offer-2026-11-14` | #6 closed unmerged | ahead 5 / behind 68 | Retain unique campaign work |
| `fix/branch-hygiene-protect-operational-refs-2026-11-15` | #74 merged | exact merged head | Reviewed merged-ref cleanup candidate |
| `fix/manual-only-production-release` | #61 closed unmerged | ahead 11 / behind 17 | Retain unique release-policy commits |
| `fix/visual-audit-csp-screenshots-2026-11-15` | #75 merged | exact merged head | Reviewed merged-ref cleanup candidate |
| `fix/visual-audit-webkit-csp-2026-11-15` | #71 merged | exact merged head | Reviewed merged-ref cleanup candidate |
| `main` | canonical | — | Sole source of truth |
| `maintenance/branch-hygiene-followup-2026-11-15` | #73 closed unmerged | ahead 5 / behind 2 | Retain unique cleanup follow-up work |
| `maintenance/finish-branch-cleanup-2026-11-15` | #77 open | — | Keep while PR is open; delete after merge |
| `maintenance/repository-hygiene-2026-11-15` | #70 merged | ahead 62 / behind 5 | Retain pending manual review; moved branch contains additional commits |
| `preview-deploy/visual-qa-after-csp-fix-2026-11-15` | operational preview | protected | Retain until visual evidence archived |
| `preview-deploy/visual-qa-current-2026-11-15` | operational preview | protected | Retain until visual evidence archived |
| `preview-deploy/2026-11-14` | operational preview | protected | Retain pending preview lifecycle review |
| `preview-deploy/2026-11-15-main-78ece71` | no PR | protected by active-prefix rule | Retain pending preview lifecycle review |
| `production-deploy/release-2026-11-15` | operational release | protected | Keep production deployment checkpoint |
| `qa/visual-audit-2026-11-15` | #26 merged + #27 closed unmerged | ahead 11 / behind 42 | Retain; reused branch still has unique unmerged commits |
| `recovery/archive-store-supabase-migrations-2026-11-15` | recovery archive | protected | Keep; migrations are not disposable |
| `recovery/cloudflare-manifest-2026-11-14` | recovery archive | protected | Keep |
| `recovery/inspect-edge-functions-2026-11-15` | recovery archive | protected | Keep |
| `release/clean-pages-payload-2026-11-14` | operational release | protected | Keep exact original commit |
| `restore/integrated-store-2026-11-14` | restore checkpoint | protected | Keep exact original commit |
| `seo/noindex-campaign-sitemap-2026-11-15` | #38 closed unmerged | ahead 3 / behind 34 | Retain unique SEO policy changes |
| `seo/remove-noindex-campaign-from-sitemap-2026-11-15` | #35 closed unmerged | ahead 3 / behind 36 | Retain unique SEO policy changes |
| `seo/sitemap-noindex-policy-2026-11-15` | #39 closed unmerged | ahead 3 / behind 34 | Retain unique SEO policy changes |

## Expected result after PR #77

After PR #77 merges, six refs are eligible for deletion: four exact merged PR heads, the verified no-PR docs ref, and PR #77's own merged head. If the workflow confirms those exact conditions and no comparison errors, the expected count is **31**. The actual post-run inventory is authoritative.

## Workflow and tests

- Policy: `scripts/branch-cleanup-policy.cjs`
- Tests: `tests/unit/branch-cleanup-policy.test.cjs`
- Workflow: `.github/workflows/cleanup-merged-branches.yml`
- Runs on main pushes, weekly, and manual dispatch.
- Store checks execute `node --test tests/unit/*.test.cjs`.
- Production release ignores cleanup policy and visual-audit scripts; maintenance-only changes must not deploy storefront source.
