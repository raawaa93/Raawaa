# RAWAA Store branch inventory and cleanup record

**Snapshot:** 2026-11-15 05:26 UTC  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main` — `edc49efe9b98f961fccef4554a2969a02d239b0e`  
**Branch refs:** 21  
**Pull requests:** 100 total — 72 merged, 28 closed-unmerged, 0 open  
**Only open PR:** [#99 — Search Console verification and workspace inventory](https://github.com/raawaa93/Raawaa/pull/99)

## Executed cleanup

- PR #100 merged the exact-SHA branch archive workflow and recovery runbook.
- [Run #43680881436](https://github.com/raawaa93/Raawaa/actions/runs/43680881436) completed successfully:
  - inspected 49 branch refs and 100 PRs;
  - pruned the merged archive-workflow branch;
  - archived **29 reviewed branch refs** into 29 annotated tags;
  - verified each tag target matched the original branch SHA;
  - zero retained/skipped archive candidates and zero failures.
- The archive tags and commit SHAs are indexed in `docs/engineering/ARCHIVED-BRANCHES.md`.

## Protected refs

The following 17 refs are deliberately retained:

- `main`
- four `backup/*` refs
- three `recovery/*` refs
- one `restore/*` ref
- one `release/*` ref
- one `production-deploy/*` ref
- two `deploy/*` refs
- four `preview-deploy/*` refs

These are rollback, recovery, release, or preview references, not stale work branches.

## Remaining cleanup

- `docs/workspace-hygiene-2026-11-15` is the only open PR head (#99). After it merges, its complete tree should match `main`; the duplicate-tree policy will then retire it.
- `fix/visual-audit-top-viewport-clean-2026-11-15` has merged visual-QA work but its tree differs from current main after maintenance changes. It is pinned for archive by exact SHA `c0ccb2db0657d414885e68f16b8b79c9f73b4531`.
- `maintenance/archive-inactive-branches-final-2026-11-15` is a superseded no-PR workflow draft. It is pinned for archive by exact SHA `ad3aaa80e47f2a4d823d85123f30c27726fb206d`.
- Once PR #99 merges and the next cleanup run succeeds, the expected result is **17 protected refs only**. This is an expected outcome, not yet a completed result.

## Full branch-by-branch inventory

| Branch | Head SHA | PR history | Class | Decision |
|---|---|---|---|---|
| `backup/continuity-hardening-2026-11-15` | `d45bf1461c` | #22 merged | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `backup/site-2026-11-14-post-mobile-audit` | `e86b349e6d` | — | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `backup/site-2026-11-14-restored-main` | `306865da8e` | — | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `backup/site-2026-11-15-preproduction` | `30ee1bbeda` | — | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `deploy/10-percent-2026-11-14` | `fb7a128a78` | — | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `deploy/10-percent-site-only` | `064815e643` | — | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `docs/workspace-hygiene-2026-11-15` | `PR #99 head` | #99 closed-unmerged; #96 closed-unmerged | Working / pending cleanup | PR #99 open; retain until merged, then prune after tree equality |
| `fix/visual-audit-top-viewport-clean-2026-11-15` | `c0ccb2db06` | #98 merged; #97 closed-unmerged; #85 merged | Working / pending cleanup | Archive next run using pinned SHA; previous tree no longer equals main |
| `main` | `edc49efe9b` | — | Canonical | Canonical; never delete |
| `maintenance/archive-inactive-branches-final-2026-11-15` | `ad3aaa80e4` | — | Working / pending cleanup | Archive next run using pinned SHA; superseded no-PR draft |
| `maintenance/final-workspace-hygiene-2026-11-15` | `98503e8702` | — | Working / pending cleanup | Review individually; never delete without exact SHA/tree proof or recovery tag |
| `preview-deploy/2026-11-14` | `342eb99454` | — | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `preview-deploy/2026-11-15-main-78ece71` | `2a01516e0c` | — | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `preview-deploy/visual-qa-after-csp-fix-2026-11-15` | `2757a76415` | #72 merged | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `preview-deploy/visual-qa-current-2026-11-15` | `7ca62ffaaf` | #69 merged | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `production-deploy/release-2026-11-15` | `cd71478c7c` | — | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `recovery/archive-store-supabase-migrations-2026-11-15` | `fc963b9e55` | #56 merged | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `recovery/cloudflare-manifest-2026-11-14` | `36d64f2b9a` | #1 merged | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `recovery/inspect-edge-functions-2026-11-15` | `770a8beeef` | — | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `release/clean-pages-payload-2026-11-14` | `8cba6b94ce` | #12 merged | Protected operational | Keep as rollback, recovery, release, or preview reference |
| `restore/integrated-store-2026-11-14` | `b74fcf3dad` | #2 merged | Protected operational | Keep as rollback, recovery, release, or preview reference |

## Safety rules

1. Never delete `main`, protected refs, or operational namespaces.
2. Never delete a branch referenced by an open PR.
3. Merged heads require the exact reviewed allowlist; moved heads require ancestry proof or exact Git-tree equality.
4. Closed-unmerged work remains until reviewed; archived refs must be pinned to exact SHA and tagged before deletion.
5. Unknown refs, changed heads, failed comparisons, tag mismatches, or missing refs are retained.
6. No force deletion and no branch history rewriting.
