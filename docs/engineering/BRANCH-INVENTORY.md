# RAWAA Store branch inventory and cleanup policy

**Snapshot:** 2026-11-15 UTC, 04:37Z  
**Repository:** raawaa93/Raawaa  
**Canonical branch:** main  
**Open cleanup PR:** #77 — https://github.com/raawaa93/Raawaa/pull/77  
**Previous safety PR:** #74 merged — https://github.com/raawaa93/Raawaa/pull/74

## Current snapshot

- 37 branch refs, including main and the open PR #77 head.
- 77 pull requests: 63 merged, 13 closed-unmerged, 1 open.
- First cleanup run #43676889692 inspected 84 refs and deleted 55; three operational refs were restored at their exact original PR head commits. Net retired: 52.
- Follow-up run #43676951048 completed successfully and deleted 0.
- Four backup refs and three recovery refs are retained.
- The first cleanup run exposed missing operational namespace protections. PR #74 added regression coverage and protects restore, release, production-deploy, deploy, and active preview-deploy refs.

## Deletion policy

The implementation is scripts/branch-cleanup-policy.cjs, tested by tests/unit/branch-cleanup-policy.test.cjs and run by .github/workflows/cleanup-merged-branches.yml.

1. Always retain main and protected refs.
2. Always retain backup/*, recovery/*, restore/*, release/*, production-deploy/*, and deploy/*.
3. Retain all preview-deploy/* refs except the exact stale preview refs listed below.
4. Delete merged PR heads only when the exact branch is in the reviewed merged allowlist. If the branch head moved after the merge, GitHub must prove ahead_by = 0.
5. Delete closed-unmerged refs only when the exact branch is in the reviewed superseded allowlist. A reused branch with both merged and closed-unmerged PRs requires ahead_by = 0.
6. Delete no-PR refs only when explicitly listed in the stale allowlist and GitHub proves ahead_by = 0.
7. Open-PR heads, unknown branches, comparison failures, and branches with unreviewed work are retained.
8. The action only deletes Git refs. It never deletes Git objects manually, repository files, recovery snapshots, deployments, DNS, secrets, external projects, or customer data.

## Reviewed merged PR refs (60)

The exact allowlist in the policy includes the previously reviewed merged branches plus the newly merged maintenance/visual-QA refs:
- maintenance/repository-hygiene-2026-11-15 (PR #70)
- fix/visual-audit-webkit-csp-2026-11-15 (PR #71)
- docs/visual-qa-and-inventory-finalization-2026-11-15 (PR #72)
- fix/branch-hygiene-protect-operational-refs-2026-11-15 (PR #74)
- fix/visual-audit-csp-screenshots-2026-11-15 (PR #75)
- maintenance/finish-branch-cleanup-2026-11-15 (PR #77, currently open; its head is protected until merge)

Merged branch refs are deleted only when their current head still matches the merged PR head. Moved heads require ancestry proof. Operational namespaces remain protected even if a merged branch name appears in the allowlist.

## Reviewed closed-unmerged refs (12)

These exact branches are semantically superseded by current merged implementations and are eligible for retirement:
- automation/generate-lockfile-2026-11-15 — lockfile, OSV scan, and npm ci are on main.
- automation/graphify-and-lighthouse-2026-11-15 — current Graphify/Lighthouse workflows are on main.
- automation/graphify-daily-refresh-2026-11-15 — current scheduled Graphify workflow is on main.
- ci/restore-release-boundaries-2026-11-15 — replaced by the merged validated release policy.
- ci/restore-release-boundaries-2026-11-15-rebased — replaced by the merged validated release policy.
- feature/campaign-nitro-offer-2026-11-14 — superseded by the merged campaign v2.
- fix/manual-only-production-release — superseded by the validated automatic production release.
- seo/sitemap-noindex-policy-2026-11-15 — current sitemap policy is on main.
- seo/noindex-campaign-sitemap-2026-11-15 — current sitemap policy is on main.
- seo/remove-noindex-campaign-from-sitemap-2026-11-15 — current sitemap policy is on main.
- qa/visual-audit-2026-11-15 — reused branch with a later closed PR; retain until ancestry proof shows no unique work remains.
- maintenance/branch-hygiene-followup-2026-11-15 — its useful allowlist/inventory updates are incorporated into PR #77.

The first ten listed non-reused branches and the superseded maintenance follow-up can be retired by exact allowlist. The reused QA branch still requires ancestry proof and is retained while it remains ahead of main.

## Reviewed no-PR refs (4)

- preview-deploy/visual-qa-2026-11-15 — stale preview ref; delete only after ahead_by = 0.
- preview-deploy/2026-11-15-post-fix — stale preview ref; delete only after ahead_by = 0.
- preview-deploy/2026-11-15-main-78ece71 — temporary preview marker; currently ahead of main, so retain.
- docs/project-tooling-and-branch-inventory-2026-11-15 — documentation branch; compare showed ahead_by = 0, so safe to retire.

## Operational refs that must remain

- main
- All four backup/* refs.
- All three recovery/* refs, including the Edge Function inspection branch.
- restore/integrated-store-2026-11-14 — restored after the first cleanup; required operational recovery checkpoint.
- release/clean-pages-payload-2026-11-14 — restored after the first cleanup; required release checkpoint.
- production-deploy/release-2026-11-15 — production release checkpoint.
- deploy/10-percent-2026-11-14 and deploy/10-percent-site-only — deployment/rollback records; keep both under deploy/*.
- preview-deploy/2026-11-14 — historical preview source.
- preview-deploy/visual-qa-current-2026-11-15 — active visual QA trigger.
- preview-deploy/visual-qa-after-csp-fix-2026-11-15 — current post-CSP visual QA preview.
- chore/google-site-verification — unmerged Google Search Console HTML verification fallback.
- qa/visual-audit-2026-11-15 — reused branch; retain until ancestry proof.
- preview-deploy/2026-11-15-main-78ece71 — one commit ahead; retained until separately reviewed.
- maintenance/finish-branch-cleanup-2026-11-15 — open PR #77 head; retained until merge.

## Expected next cleanup

After PR #77 merges, the workflow should remove six newly reviewed merged PR refs, ten superseded closed-unmerged refs plus the superseded PR #73 follow-up, and the one no-PR documentation ref whose history is already in main. The reused QA branch and all operational refs remain protected. Expected post-cleanup size: approximately 19 refs; verify against the live GitHub branch listing rather than assuming the count.

## Verified post-PR #74 safety result

PR #74 merged at 2026-11-15T04:35:02Z. Its Store checks and Graphify checks passed. The regression test protects restore, release, production, and active preview/deploy checkpoints even when a ref is in a merged-PR allowlist and its history is contained in main.

## Remaining verification

- PR #77 Store checks and Graphify must pass before merge.
- After merge, verify the cleanup run's deleted list, remaining branch list, and zero failures.
- Verify the visual QA run after the CSP fix completes successfully.
- Do not trigger a production deployment for documentation, branch-policy, or visual-audit-script-only changes.
