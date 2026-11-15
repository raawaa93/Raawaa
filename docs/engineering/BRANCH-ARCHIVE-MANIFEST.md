# Inactive branch archive manifest

**Snapshot:** 2026-11-15 UTC  
**Repository:** `raawaa93/Raawaa`  
**Policy:** `scripts/branch-archive-policy.cjs`  
**Automation:** `.github/workflows/cleanup-merged-branches.yml`

## Purpose

Remove stale branch clutter without destroying unmerged work. Every reviewed inactive branch is first preserved by an annotated Git tag under `archive/branches/2026-11-15/`; only after the tag target is verified and the branch head is rechecked is the original branch ref deleted.

No commits or file contents are deleted by this process. The original branch tip and its complete ancestor history remain reachable through the archive tag.

## Safety rules

- The existing ancestry-safe prune job runs first and may delete branches whose work is already fully contained in `main`.
- The archive job processes only the explicit allowlist below. It does not discover or delete arbitrary branches.
- `main`, protected branches, `backup/*`, `recovery/*`, `restore/*`, `release/*`, `production-deploy/*`, `deploy/*`, and `preview-deploy/*` are never archived.
- Any branch referenced by an open same-repository PR is retained.
- For the reviewed refs below, the current branch SHA must match the reviewed SHA. If it changed, the branch is retained.
- The workflow creates or verifies the annotated tag, confirms its target equals the captured SHA, then re-reads the branch and deletes only if its SHA is unchanged.
- If a ref was already removed by the ancestry-safe prune job, no archive tag is needed because the commit is already in `main`.
- The archive job writes the exact archived names, commit SHAs, and tag names to the GitHub Actions run summary.

## Reviewed archive refs

| Original branch | Reviewed commit | Recovery tag |
|---|---|---|
| `automation/generate-lockfile-2026-11-15` | `5e4aa75f96fe35c6eddf47389e5b4f548e765fc4` | `archive/branches/2026-11-15/automation/generate-lockfile-2026-11-15` |
| `automation/graphify-and-lighthouse-2026-11-15` | `5a4931894ff853cec65158b716c4bff5a132273b` | `archive/branches/2026-11-15/automation/graphify-and-lighthouse-2026-11-15` |
| `automation/graphify-daily-refresh-2026-11-15` | `ba595088521caaf26b2313a9d88664ae062feaad` | `archive/branches/2026-11-15/automation/graphify-daily-refresh-2026-11-15` |
| `chore/google-site-verification` | `8ccadd77bc66da908fc7d464119d69258842cc67` | `archive/branches/2026-11-15/chore/google-site-verification` |
| `ci/restore-release-boundaries-2026-11-15-rebased` | `2993d59f4f492c9929ffc0f05c81f2cc5082982c` | `archive/branches/2026-11-15/ci/restore-release-boundaries-2026-11-15-rebased` |
| `ci/restore-release-boundaries-2026-11-15` | `909fc4bfa337f353a069b87b68c51a0072127f05` | `archive/branches/2026-11-15/ci/restore-release-boundaries-2026-11-15` |
| `docs/workspace-hygiene-2026-11-15` | `48a14a44feec666d0ebb3cf31992a8e06c1c2024` | `archive/branches/2026-11-15/docs/workspace-hygiene-2026-11-15` |
| `feature/campaign-nitro-offer-2026-11-14` | `ce61d6ee2e0cb2912c11900d4bf371df2e9cdf3b` | `archive/branches/2026-11-15/feature/campaign-nitro-offer-2026-11-14` |
| `fix/branch-cleanup-allowlist-correction-2026-11-15` | `4aa2cca35bdabfe716fa432bd7433595c4a4754d` | `archive/branches/2026-11-15/fix/branch-cleanup-allowlist-correction-2026-11-15` |
| `fix/branch-cleanup-policy-current-state-2026-11-15` | `2fa31d3235987309962d094cb332d5e8924eadb8` | `archive/branches/2026-11-15/fix/branch-cleanup-policy-current-state-2026-11-15` |
| `fix/branch-cleanup-policy-final-2026-11-15` | `383bd07c6930b51343685fbbaed2a003fc9da209` | `archive/branches/2026-11-15/fix/branch-cleanup-policy-final-2026-11-15` |
| `fix/branch-cleanup-policy-final-rebased-2026-11-15` | `b5e41ca83bcc54aea4bf3f9c973563b62c608238` | `archive/branches/2026-11-15/fix/branch-cleanup-policy-final-rebased-2026-11-15` |
| `fix/branch-hygiene-protect-operational-refs-2026-11-15` | `b3b18f3484da39656c672a344ca1d9cae13c5bf1` | `archive/branches/2026-11-15/fix/branch-hygiene-protect-operational-refs-2026-11-15` |
| `fix/final-visual-and-release-policy-2026-11-15` | `7ca3855ac0a2030826a758baede212027f0b5fd6` | `archive/branches/2026-11-15/fix/final-visual-and-release-policy-2026-11-15` |
| `fix/final-visual-release-policy-consolidated-2026-11-15` | `50d1d8835f5da9abc6724311075f0d1b19140999` | `archive/branches/2026-11-15/fix/final-visual-release-policy-consolidated-2026-11-15` |
| `fix/manual-only-production-release` | `9843b4224c069981aacd575602073315a31d118b` | `archive/branches/2026-11-15/fix/manual-only-production-release` |
| `fix/production-policy-site-check-2026-11-15` | `0591b0e03f8f6b0be360b2336e42f75aca77b5b8` | `archive/branches/2026-11-15/fix/production-policy-site-check-2026-11-15` |
| `fix/production-release-push-only-2026-11-15` | `4d4ce839b8b4252b2a68ce856b9b83c34857bfbf` | `archive/branches/2026-11-15/fix/production-release-push-only-2026-11-15` |
| `fix/visual-audit-top-viewport-2026-11-15` | `5ec51f3adb148d75b1b1244f7f3bdd0105b4a083` | `archive/branches/2026-11-15/fix/visual-audit-top-viewport-2026-11-15` |
| `fix/visual-qa-webkit-csp-regression-2026-11-15` | `d512d7d07014e90b4d5e4fa25ed6fb8ae10aec1a` | `archive/branches/2026-11-15/fix/visual-qa-webkit-csp-regression-2026-11-15` |
| `maintenance/branch-cleanup-consolidated-2026-11-15` | `4f8286f99ae3be4407d0fb1c0a035453c027f793` | `archive/branches/2026-11-15/maintenance/branch-cleanup-consolidated-2026-11-15` |
| `maintenance/branch-hygiene-followup-2026-11-15` | `8f8d02444ac265980c34703d2a44046d2701dc62` | `archive/branches/2026-11-15/maintenance/branch-hygiene-followup-2026-11-15` |
| `maintenance/final-inventory-cleanup-2026-11-15` | `e1fff31f5a341f874867b646d1533ce3a002ef63` | `archive/branches/2026-11-15/maintenance/final-inventory-cleanup-2026-11-15` |
| `maintenance/finalize-branch-cleanup-2026-11-15` | `4f68dcffd3ab6d0794c163f1245fd935341f5f90` | `archive/branches/2026-11-15/maintenance/finalize-branch-cleanup-2026-11-15` |
| `maintenance/finish-branch-cleanup-2026-11-15` | `8a8c77c16f0b6d79423be42d7300363d1e6cd720` | `archive/branches/2026-11-15/maintenance/finish-branch-cleanup-2026-11-15` |
| `maintenance/repository-hygiene-2026-11-15` | `d001d7e8c346179a20c4ce3aab3717ad955945ef` | `archive/branches/2026-11-15/maintenance/repository-hygiene-2026-11-15` |
| `qa/visual-audit-2026-11-15` | `bb5c7fb5f7b5142df3fb301a958156a5390aebf5` | `archive/branches/2026-11-15/qa/visual-audit-2026-11-15` |
| `seo/noindex-campaign-sitemap-2026-11-15` | `9d9dddcc10ae0d487ff8f7efc443ec9be271beda` | `archive/branches/2026-11-15/seo/noindex-campaign-sitemap-2026-11-15` |
| `seo/remove-noindex-campaign-from-sitemap-2026-11-15` | `59057a487580be4b13b24a99f0812eb1fb936138` | `archive/branches/2026-11-15/seo/remove-noindex-campaign-from-sitemap-2026-11-15` |
| `seo/sitemap-noindex-policy-2026-11-15` | `e01e7be06307910bf2978888ef5837e7c6db4566` | `archive/branches/2026-11-15/seo/sitemap-noindex-policy-2026-11-15` |
| `fix/visual-audit-top-viewport-clean-2026-11-15` | `c0ccb2db0657d414885e68f16b8b79c9f73b4531` | `archive/branches/2026-11-15/fix/visual-audit-top-viewport-clean-2026-11-15` |
| `maintenance/archive-inactive-branches-2026-11-15` | Captured at archive time | `archive/branches/2026-11-15/maintenance/archive-inactive-branches-2026-11-15` |

## Restore an archived branch

Example for a branch named `fix/manual-only-production-release`:

```bash
git fetch origin 'refs/tags/archive/branches/2026-11-15/fix/manual-only-production-release'
git branch fix/manual-only-production-release FETCH_HEAD
```

The tag is a durable recovery pointer; do not delete archive tags as part of routine branch cleanup.
