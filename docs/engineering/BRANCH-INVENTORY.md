# RAWAA Store branch inventory and cleanup record

**Verified:** 2026-11-15 04:42 UTC  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main`  
**Cleanup PR:** #70 merged  
**Operational safety PR:** #74 merged  
**Visual QA workflow PR:** #76 merged  
**WebKit CSP false-positive handling PR:** #78 merged  
**Current branch-cleanup PR:** #77 open

## Current snapshot

- Branch refs: **39**.
- Pull requests: **78** — **64 merged**, **13 closed-unmerged**, **1 open**.
- Backup refs: **4**.
- Recovery refs: **3**.

## Cleanup history

1. Run #43676889692 inspected 84 refs and deleted 55 reviewed refs with zero failures.
2. Run #43677232271 deleted three operational refs before namespace protection was fixed. The original restore/release checkpoint refs were recreated at their exact merged-PR head commits; the active preview ref was also restored.
3. PR #74 permanently protected `restore/*`, `release/*`, `production-deploy/*`, all backup/recovery refs, and active preview/deploy refs. Run #43677406307 completed with zero deletion candidates and zero failures.
4. PR #73 was closed unmerged by the repository owner; its proposed allowlist changes were not applied.
5. PR #77 completes the reviewed allowlist for merged refs #70, #71, #74, #75, #76 and itself, plus the docs-only no-PR branch after GitHub confirmed `ahead_by = 0`, `behind_by = 3`. It retains all operational namespaces and unmerged work.

## Current branch-by-branch inventory

| Branch | Classification | Decision |
|---|---|---|
| `automation/generate-lockfile-2026-11-15` | Closed unmerged #60 | Retain; unresolved work not proven obsolete |
| `automation/graphify-and-lighthouse-2026-11-15` | Closed unmerged #34 | Retain; unresolved work not proven obsolete |
| `automation/graphify-daily-refresh-2026-11-15` | Closed unmerged #33 | Retain; unresolved work not proven obsolete |
| `backup/continuity-hardening-2026-11-15` | Backup archive | Keep permanently |
| `backup/site-2026-11-14-post-mobile-audit` | Backup archive | Keep permanently |
| `backup/site-2026-11-14-restored-main` | Backup archive | Keep permanently |
| `backup/site-2026-11-15-preproduction` | Backup archive | Keep permanently |
| `chore/google-site-verification` | Closed unmerged #47 | Retain; unresolved work not proven obsolete |
| `ci/restore-release-boundaries-2026-11-15-rebased` | Closed unmerged #66 | Retain; unresolved work not proven obsolete |
| `ci/restore-release-boundaries-2026-11-15` | Closed unmerged #63 | Retain; unresolved work not proven obsolete |
| `deploy/10-percent-2026-11-14` | No PR | Retain until individual review and ahead_by=0 proof |
| `deploy/10-percent-site-only` | No PR | Retain until individual review and ahead_by=0 proof |
| `docs/project-tooling-and-branch-inventory-2026-11-15` | No PR | Retain until individual review and ahead_by=0 proof |
| `docs/visual-qa-and-inventory-finalization-2026-11-15` | Merged #76 | Delete only if explicitly allowlisted and namespace policy permits |
| `feature/campaign-nitro-offer-2026-11-14` | Closed unmerged #6 | Retain; unresolved work not proven obsolete |
| `fix/branch-hygiene-protect-operational-refs-2026-11-15` | Merged #74 | Delete only if explicitly allowlisted and namespace policy permits |
| `fix/manual-only-production-release` | Closed unmerged #61 | Retain; unresolved work not proven obsolete |
| `fix/visual-audit-csp-screenshots-2026-11-15` | Merged #75 | Delete only if explicitly allowlisted and namespace policy permits |
| `fix/visual-audit-webkit-csp-2026-11-15` | Merged #71 | Delete only if explicitly allowlisted and namespace policy permits |
| `fix/visual-qa-webkit-csp-regression-2026-11-15` | Merged #78 | Delete only if explicitly allowlisted and namespace policy permits |
| `main` | Canonical | Keep |
| `maintenance/branch-cleanup-final-2026-11-15` | No PR | Retain until individual review and ahead_by=0 proof |
| `maintenance/branch-hygiene-followup-2026-11-15` | Closed unmerged #73 | Retain; unresolved work not proven obsolete |
| `maintenance/finish-branch-cleanup-2026-11-15` | Open PR #77 | Keep until resolved |
| `maintenance/repository-hygiene-2026-11-15` | Merged #70 | Delete only if explicitly allowlisted and namespace policy permits |
| `preview-deploy/visual-qa-after-csp-fix-2026-11-15` | Merged #72 | Delete only if explicitly allowlisted and namespace policy permits |
| `preview-deploy/visual-qa-current-2026-11-15` | Merged #69 | Delete only if explicitly allowlisted and namespace policy permits |
| `preview-deploy/2026-11-14` | No PR | Retain until individual review and ahead_by=0 proof |
| `preview-deploy/2026-11-15-main-78ece71` | No PR | Retain until individual review and ahead_by=0 proof |
| `production-deploy/release-2026-11-15` | Operational/recovery checkpoint | Keep permanently |
| `qa/visual-audit-2026-11-15` | Merged + closed-unmerged reuse | Retain unless exact reviewed ancestry proof permits cleanup |
| `recovery/archive-store-supabase-migrations-2026-11-15` | Operational/recovery checkpoint | Keep permanently |
| `recovery/cloudflare-manifest-2026-11-14` | Operational/recovery checkpoint | Keep permanently |
| `recovery/inspect-edge-functions-2026-11-15` | Operational/recovery checkpoint | Keep permanently |
| `release/clean-pages-payload-2026-11-14` | Operational/recovery checkpoint | Keep permanently |
| `restore/integrated-store-2026-11-14` | Operational/recovery checkpoint | Keep permanently |
| `seo/noindex-campaign-sitemap-2026-11-15` | Closed unmerged #38 | Retain; unresolved work not proven obsolete |
| `seo/remove-noindex-campaign-from-sitemap-2026-11-15` | Closed unmerged #35 | Retain; unresolved work not proven obsolete |
| `seo/sitemap-noindex-policy-2026-11-15` | Closed unmerged #39 | Retain; unresolved work not proven obsolete |

## Deletion policy

- Never delete `main`, protected refs, `backup/*`, `recovery/*`, `restore/*`, `release/*`, or `production-deploy/*`.
- Preserve every `deploy/*` ref and active `preview-deploy/*` ref. Only exact reviewed stale preview refs may be considered.
- Merged PR heads require exact allowlisting; moved heads require `ahead_by = 0`.
- Closed-unmerged and reused refs require explicit review and `ahead_by = 0`.
- No-PR refs require exact allowlisting and `ahead_by = 0`.
- Unknown refs, comparison failures, and unmerged work are retained.

## Automation

- Policy: `scripts/branch-cleanup-policy.cjs`
- Tests: `tests/unit/branch-cleanup-policy.test.cjs`
- Workflow: `.github/workflows/cleanup-merged-branches.yml`
- Store checks execute `node --test tests/unit/*.test.cjs`.
- Cleanup runs on main pushes, weekly, or manually.

