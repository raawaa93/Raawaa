# RAWAA Store branch inventory

**Snapshot:** 2026-11-15, refreshed before PR #70 merge  
**Canonical base:** main at fafe5c7d9ed21fd6597b7bf8964f8105fe91b99e  
**Branch refs:** 82 including main  
**Pull requests:** 71 total; 57 merged, 12 closed-unmerged, 2 open (PR #70 repository hygiene and PR #71 WebKit CSP visual-QA fix).

## Cleanup policy

The automated policy in scripts/branch-cleanup-policy.cjs is authoritative and tested by tests/unit/branch-cleanup-policy.test.cjs.

- Delete a same-repository merged PR head only when its current head still matches the merged PR head, or a later current head is proven contained in main, or the exact ref is in the reviewed superseded allowlist.
- Preserve main, protected refs, every backup/* and recovery/* ref, and every open-PR head.
- A closed-unmerged branch is retained unless its exact name is in the reviewed superseded list below or its commit history is proven contained in main.
- An unreferenced branch is retained unless it is one of the exact stale preview/deploy refs below or its commit history is proven contained in main.
- Comparison/API errors retain the branch; they never authorize deletion.
- No recovery snapshots, source files, customer data, secrets, DNS, Cloudflare resources, Supabase projects, or Notion pages are deleted.

## Closed-unmerged work reviewed as superseded

| PR | Branch | Why safe to retire |
|---:|---|---|
| 66 | ci/restore-release-boundaries-2026-11-15-rebased | Superseded by merged PR #65 and current release workflow |
| 63 | ci/restore-release-boundaries-2026-11-15 | Superseded by merged PR #65 |
| 61 | fix/manual-only-production-release | Superseded by merged automatic release PRs #62 and #65 |
| 60 | automation/generate-lockfile-2026-11-15 | Lockfile, OSV scan, and npm ci workflow already exist on main |
| 39 | seo/sitemap-noindex-policy-2026-11-15 | Superseded by merged sitemap cleanup PR #42 |
| 38 | seo/noindex-campaign-sitemap-2026-11-15 | Superseded by merged sitemap cleanup PR #42 |
| 35 | seo/remove-noindex-campaign-from-sitemap-2026-11-15 | Superseded by merged sitemap cleanup PR #42 |
| 34 | automation/graphify-and-lighthouse-2026-11-15 | Superseded by merged Graphify/Lighthouse workflow PR #36 |
| 33 | automation/graphify-daily-refresh-2026-11-15 | Superseded by merged Graphify/Lighthouse workflow PR #36 |
| 27 | qa/visual-audit-2026-11-15 | Reused branch; its older visual audit is superseded by the current Chromium+WebKit implementation on main |
| 6 | feature/campaign-nitro-offer-2026-11-14 | Superseded by merged campaign v2 PR #7 |

PR #47 branch chore/google-site-verification is deliberately retained as an alternative Google Search Console HTML verification fallback. The connected Search Console property works, but that unique file was not merged into main.

## Exact no-PR refs eligible for retirement

- preview-deploy/visual-qa-2026-11-15 — fully behind main.
- preview-deploy/2026-11-15-post-fix — fully behind main.
- preview-deploy/2026-11-15-main-78ece71 — temporary preview trigger marker.
- deploy/10-percent-site-only — old site-only snapshot removed recovery/validation material; production now deploys from canonical main.

## Retained refs

The following are intentionally preserved:

- main
- All backup/* refs, including the three site checkpoints and continuity-hardening backup.
- All recovery/* refs, including cloudflare-manifest, archived Store migrations, and the Edge Function inspection/recovery branch.
- deploy/10-percent-2026-11-14 — historical deployment manifest.
- preview-deploy/2026-11-14 — historical preview source with distinct code changes; retain until a separate recovery review.
- production-deploy/release-2026-11-15 — release checkpoint; retain until its purpose is independently verified.
- chore/google-site-verification — unmerged Google verification fallback.
- PR #71 branch fix/visual-audit-webkit-csp-2026-11-15 until its checks complete and it is merged or closed.
- PR #70 branch maintenance/repository-hygiene-2026-11-15 until the cleanup workflow is merged and executed; its branch is then eligible for deletion.
- Any future open-PR head or protected branch.

## Expected cleanup

The refreshed dry-run inventory found 68 safe deletion candidates before PR #70 merges:
- 53 merged-PR branch refs, excluding all backup/recovery namespaces.
- 10 additional closed-unmerged refs in the explicit superseded list (the reused visual-QA branch is already counted among merged heads).
- Four exact stale no-PR preview/deploy refs.

PR #70's branch is currently protected because its PR is open. After PR #70 merges, that one ref becomes eligible too: expected total 69 deletions. PR #71 remains protected while open. The expected retained set after PR #70 cleanup is 13 refs: main, all four backup refs, all three recovery refs, the Google verification fallback, the 10% deployment manifest, the older distinct preview source, the production release checkpoint, and the open PR #71 head.

## Verified post-run result

Pending GitHub Actions execution after PR #70 merges. Record exact deleted names, remaining branch names, run URL, and any failures here.
