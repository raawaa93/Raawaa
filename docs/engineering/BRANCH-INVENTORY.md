# RAWAA Store branch inventory and cleanup record

**Verified:** 2026-11-15 04:57 UTC  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main`

## Current snapshot

- Branch refs: **42**.
- Pull requests: **88** total — **68 merged**, **16 closed-unmerged**, **4 open**.
- Backup refs: **4**.
- Recovery refs: **3**.
- Open PRs: #88 fix: enforce top-of-page visual QA captures; #87 chore: finalize branch hygiene and visual QA checks; #86 fix: finalize store automation and visual QA hygiene; #84 fix: finalize visual QA and push-only release policy.

## Cleanup execution history

1. Run [#43676889692](https://github.com/raawaa93/Raawaa/actions/runs/43676889692) inspected 84 refs and deleted **55** reviewed refs with zero failures.
2. Run #43677232271 exposed a policy gap and deleted three operational refs; the original restore/release checkpoints were recreated at exact merged-PR head commits, and active preview refs were restored.
3. PR #74 added permanent namespace protection for `restore/*`, `release/*`, `production-deploy/*`, all backup/recovery refs, and active preview/deploy refs.
4. Run [#43677406307](https://github.com/raawaa93/Raawaa/actions/runs/43677406307) completed with zero candidates and zero failures.
5. Run [#43678179625](https://github.com/raawaa93/Raawaa/actions/runs/43678179625) deleted **5** additional reviewed merged refs with zero failures.
6. Run #43678312538 completed with zero candidates and zero failures.
7. Run #43678671596 inspected the updated repository with zero candidates and zero failures.
8. PR #73 and several superseded maintenance PRs were closed unmerged; their branches remain retained unless the exact commit tree is proven contained in main.
9. Current PR #86 consolidates push-only release checks, the top-of-page visual screenshot assertion, and the final branch allowlist. Do not close it until Store checks and Graphify pass.

## Current branch-by-branch inventory

| Branch | Classification | Decision |
|---|---|---|
| `automation/generate-lockfile-2026-11-15` | Closed-unmerged #60 | Retain; unique commits not proven obsolete |
| `automation/graphify-and-lighthouse-2026-11-15` | Closed-unmerged #34 | Retain; unique commits not proven obsolete |
| `automation/graphify-daily-refresh-2026-11-15` | Closed-unmerged #33 | Retain; unique commits not proven obsolete |
| `backup/continuity-hardening-2026-11-15` | Backup | Keep permanently |
| `backup/site-2026-11-14-post-mobile-audit` | Backup | Keep permanently |
| `backup/site-2026-11-14-restored-main` | Backup | Keep permanently |
| `backup/site-2026-11-15-preproduction` | Backup | Keep permanently |
| `chore/google-site-verification` | Closed-unmerged #47 | Retain; unique commits not proven obsolete |
| `ci/restore-release-boundaries-2026-11-15-rebased` | Closed-unmerged #66 | Retain; unique commits not proven obsolete |
| `ci/restore-release-boundaries-2026-11-15` | Closed-unmerged #63 | Retain; unique commits not proven obsolete |
| `deploy/10-percent-2026-11-14` | No PR | Retain until individually reviewed |
| `deploy/10-percent-site-only` | No PR | Retain until individually reviewed |
| `feature/campaign-nitro-offer-2026-11-14` | Closed-unmerged #6 | Retain; unique commits not proven obsolete |
| `fix/branch-hygiene-protect-operational-refs-2026-11-15` | Merged #74 | Delete only if exact allowlisted and namespace permits |
| `fix/final-visual-and-release-policy-2026-11-15` | Open PR #84 | Keep until merged/closed |
| `fix/final-visual-release-policy-consolidated-2026-11-15` | Open PR #86 | Keep until merged/closed |
| `fix/manual-only-production-release` | Closed-unmerged #61 | Retain; unique commits not proven obsolete |
| `fix/production-policy-site-check-2026-11-15` | Closed-unmerged #82 | Retain; unique commits not proven obsolete |
| `fix/production-release-push-only-2026-11-15` | Merged #81 | Delete only if exact allowlisted and namespace permits |
| `fix/raawaa-final-qa-release-policy-2026-11-15` | No PR | Retain until individually reviewed |
| `fix/visual-audit-top-viewport-2026-11-15` | Open PR #88 | Keep until merged/closed |
| `fix/visual-qa-webkit-csp-regression-2026-11-15` | Merged #78 | Delete only if exact allowlisted and namespace permits |
| `main` | Canonical | Keep |
| `maintenance/branch-cleanup-consolidated-2026-11-15` | Merged #80 | Delete only if exact allowlisted and namespace permits |
| `maintenance/branch-hygiene-followup-2026-11-15` | Closed-unmerged #73 | Retain; unique commits not proven obsolete |
| `maintenance/finalize-branch-cleanup-2026-11-15` | Open PR #87 | Keep until merged/closed |
| `maintenance/finish-branch-cleanup-2026-11-15` | Closed-unmerged #77 | Retain; unique commits not proven obsolete |
| `maintenance/repository-hygiene-2026-11-15` | Merged #70 | Delete only if exact allowlisted and namespace permits |
| `preview-deploy/visual-qa-after-csp-fix-2026-11-15` | Merged #72 | Delete only if exact allowlisted and namespace permits |
| `preview-deploy/visual-qa-current-2026-11-15` | Merged #69 | Delete only if exact allowlisted and namespace permits |
| `preview-deploy/2026-11-14` | No PR | Retain until individually reviewed |
| `preview-deploy/2026-11-15-main-78ece71` | No PR | Retain until individually reviewed |
| `production-deploy/release-2026-11-15` | Operational/recovery | Keep permanently |
| `qa/visual-audit-2026-11-15` | Merged + closed-unmerged reuse | Retain until explicit ancestry proof |
| `recovery/archive-store-supabase-migrations-2026-11-15` | Operational/recovery | Keep permanently |
| `recovery/cloudflare-manifest-2026-11-14` | Operational/recovery | Keep permanently |
| `recovery/inspect-edge-functions-2026-11-15` | Operational/recovery | Keep permanently |
| `release/clean-pages-payload-2026-11-14` | Operational/recovery | Keep permanently |
| `restore/integrated-store-2026-11-14` | Operational/recovery | Keep permanently |
| `seo/noindex-campaign-sitemap-2026-11-15` | Closed-unmerged #38 | Retain; unique commits not proven obsolete |
| `seo/remove-noindex-campaign-from-sitemap-2026-11-15` | Closed-unmerged #35 | Retain; unique commits not proven obsolete |
| `seo/sitemap-noindex-policy-2026-11-15` | Closed-unmerged #39 | Retain; unique commits not proven obsolete |

## Deletion rules

- Never delete `main`, protected refs, `backup/*`, `recovery/*`, `restore/*`, `release/*`, or `production-deploy/*`.
- Preserve all `deploy/*` refs and active `preview-deploy/*` refs. Only exact reviewed stale preview refs may be considered.
- Merged PR heads require exact allowlisting; moved heads require `ahead_by = 0`.
- Closed-unmerged refs require explicit superseded allowlisting and `ahead_by = 0`.
- No-PR refs require exact allowlisting and `ahead_by = 0`.
- Unknown refs, comparison failures, and all unique unmerged work are retained.

## Automation

- Policy: `scripts/branch-cleanup-policy.cjs`
- Tests: `tests/unit/branch-cleanup-policy.test.cjs`
- Workflow: `.github/workflows/cleanup-merged-branches.yml`
- Store checks run `node --test tests/unit/*.test.cjs`.
- Cleanup runs on main pushes, weekly, or manually; errors retain refs and deletion failures fail the workflow.

