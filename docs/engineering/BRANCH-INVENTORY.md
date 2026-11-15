# RAWAA Store branch inventory

**Snapshot:** 2026-11-15, before PR #70 cleanup automation  
**Canonical base:** main at 6ac353d0fa11f1042259f00ea1b8df36cee3573c  
**Initial branch refs:** 79 including main  
**Initial PR inventory:** 68 closed PRs; 56 merged PRs; 12 closed-unmerged PR entries; no open PRs before this maintenance PR.

## Cleanup policy

The automated policy in scripts/branch-cleanup-policy.cjs is authoritative and tested by tests/unit/branch-cleanup-policy.test.cjs.

- Delete a branch head when a same-repository PR merged, unless it is in backup/* or recovery/*.
- Preserve main, protected refs, all backup/* and recovery/* refs, and every open-PR head.
- A closed-unmerged branch is retained unless its exact name is in the reviewed superseded list below.
- Only the four exact no-PR preview/deploy refs listed below may be deleted.
- No recovery snapshots, files, customer data, secrets, DNS, Cloudflare resources, Supabase projects, or Notion pages are deleted.

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
| 27 | qa/visual-audit-2026-11-15 | Reused branch; its visual audit workflow/script are superseded by the current Chromium+WebKit implementation on main |
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
- Any future open-PR head or protected branch.

## Expected cleanup

The initial review found 53 merged-PR branch refs; all 53 are retained by default. The only automatic cleanup candidates are the 11 exact superseded closed-unmerged refs and four exact stale no-PR refs (15 unique refs total), and each is deleted only if its current head is proven fully contained in main. The actual deletion count may be lower.

The post-run section below must be completed from the actual GitHub Actions run and a fresh branch listing; never infer success from the workflow file alone.

## Verified post-run result

Pending GitHub Actions execution after PR #70 merges. Record exact deleted names, remaining branch names, run URL, and any failures here.
