# RAWAA Store branch inventory — final cleanup state

**Snapshot:** 2026-11-15 05:42 UTC, after PR #101 and final archive run #43682035975  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main` — `db1e0b131f596208b10e2e9c951d1f22c9beb916`  
**Branch cleanup workflow:** `.github/workflows/cleanup-merged-branches.yml`  
**Archive workflow:** `.github/workflows/cleanup-merged-branches.yml`  
**Recovery index:** `docs/engineering/ARCHIVED-BRANCHES.md`

## Final snapshot

- **17 branch refs remain** after the final cleanup run.
- **103 pull requests** after PR #103 merges: **75 merged**, **28 closed-unmerged**, **0 open**.
- **32 annotated recovery tags** preserve the 32 retired branch heads.
- **0 inactive non-operational branch refs** remain.
- The archive allowlist is cleared; future runs will not attempt to archive already-retired refs.
- The two temporary documentation refs are both explicitly allowlisted: the old inventory ref points exactly to main and the PR #103 branch is removed after its exact merged head is confirmed.

## Completed cleanup

- PR #70 introduced ancestry-safe merged-branch pruning.
- PR #74 protected operational namespaces and recovery refs.
- PR #100 introduced exact-SHA archival before branch deletion.
- PR #101 finalized workspace tooling/Skills inventory, Google Search Console verification, and the final three archive refs.
- [First archive run #43680881436](https://github.com/raawaa93/Raawaa/actions/runs/43680881436): 29 exact-SHA tags verified and 29 branch refs removed; one fully merged branch ref was pruned separately.
- [Final archive run #43682035975](https://github.com/raawaa93/Raawaa/actions/runs/43682035975): 3 exact-SHA tags verified and 3 branch refs removed.
- Both archive/prune runs succeeded with zero failures.
- All 32 tag names and their original commit SHAs are recorded in `docs/engineering/ARCHIVED-BRANCHES.md`.

## Remaining branch refs

| Branch | Head SHA | Classification | Action |
|---|---|---|---|
| `backup/continuity-hardening-2026-11-15` | `d45bf1461c70cae07208f32dd09c7d66aefdab35` | Backup | Keep |
| `backup/site-2026-11-14-post-mobile-audit` | `e86b349e6da63733ceb6f9849033a29dd71c0eb4` | Backup | Keep |
| `backup/site-2026-11-14-restored-main` | `306865da8e168cf5847a68ea8bdb3fa448df8a9a` | Backup | Keep |
| `backup/site-2026-11-15-preproduction` | `30ee1bbeda771c194fddc83c066d873ac02f1d81` | Backup | Keep |
| `deploy/10-percent-2026-11-14` | `fb7a128a78b950c80a835162a178004fb7fbcf46` | Deployment checkpoint | Keep |
| `deploy/10-percent-site-only` | `064815e643c25c4f2cfa707ecd032088a5f6e282` | Deployment checkpoint | Keep |
| `main` | `db1e0b131f596208b10e2e9c951d1f22c9beb916` | Canonical | Keep |
| `preview-deploy/visual-qa-after-csp-fix-2026-11-15` | `2757a76415bd21cdd00fe7a256dfc52321f96b02` | Preview checkpoint | Keep |
| `preview-deploy/visual-qa-current-2026-11-15` | `7ca62ffaaf2be5fd337255d66679621be399ddae` | Preview checkpoint | Keep |
| `preview-deploy/2026-11-14` | `342eb994547f255bfc5226bc071d03719b4f8303` | Preview checkpoint | Keep |
| `preview-deploy/2026-11-15-main-78ece71` | `2a01516e0c6256251a84f5a1c0e7a78f4ce2dec9` | Preview checkpoint | Keep |
| `production-deploy/release-2026-11-15` | `cd71478c7ca3d4cb9b38a5afc5f226de57e5503a` | Production release checkpoint | Keep |
| `recovery/archive-store-supabase-migrations-2026-11-15` | `fc963b9e559323bcd4cfca9d4ab26128fb844c52` | Recovery archive | Keep |
| `recovery/cloudflare-manifest-2026-11-14` | `36d64f2b9ade7d7e7831c9a9bd756fdfa888c72a` | Recovery archive | Keep |
| `recovery/inspect-edge-functions-2026-11-15` | `770a8beeef093dadd5f78fff0f7f157d050fe0c9` | Recovery archive | Keep |
| `release/clean-pages-payload-2026-11-14` | `8cba6b94ce39282999d3c4c86ca2a60845c805a2` | Release checkpoint | Keep |
| `restore/integrated-store-2026-11-14` | `b74fcf3dadecf52c0c40ce848ef67b104d7f73ec` | Restore checkpoint | Keep |

## Branch policy

1. Never delete `main`, backups, recovery refs, restore/release/deploy checkpoints, production-deploy refs, or active preview refs.
2. Prune a merged PR branch only when it is individually reviewed and GitHub proves the exact head is merged or its current tip has `ahead_by = 0`.
3. Closed-unmerged or no-PR refs are not pruned by the merged-branch policy.
4. Archive a unique inactive ref only by first creating an annotated tag to the exact captured SHA, verifying that tag target, re-reading the branch head, and only then deleting the ref.
5. Unknown, changed, open-PR, or failed-comparison refs are retained.
6. Archive tags are durable recovery points and are not routine cleanup targets.

## Post-merge cleanup

- This documentation-only branch is included in the reviewed merged-branch allowlist.
- After this PR merges, the normal branch-hygiene workflow removes its branch ref.
- Expected steady state: **17 refs, 32 recovery tags, 0 open PRs**.

## Final closure check — 2026-11-15 05:50 UTC

- Canonical main: `0791e380d70cd34ea212ccdc1dc2b9289610a004`.
- Branch refs at this check: **19** — 17 durable operational/recovery refs plus two temporary maintenance refs.
- PR history before this final closure PR: 104 total, 75 merged, 29 closed-unmerged, zero open.
- Recovery tags: **32**.
- `maintenance/retire-last-stale-refs-2026-11-15` points to `88404f1c02dcc3db3768ab615d4a175f836d398c`, which GitHub confirms is an ancestor of main (`ahead_by=0`, `behind_by=1)); no tag is needed.
- `maintenance/final-archive-closure-2026-11-15` is the active final cleanup PR branch and is allowlisted for pruning after merge.
- The final cleanup run must leave exactly the 17 durable refs listed above, keep all 32 tags, and leave no open PRs.


## Final verified state — 2026-11-15 05:52 UTC

- Canonical main: `41a37816b3e491cfa38bf8f8c81af9092f3b586a`.
- [Final branch hygiene run #43682885648](https://github.com/raawaa93/Raawaa/actions/runs/43682885648) succeeded.
- **17 branch refs remain**, exactly the 17 durable backup/recovery/deploy/preview/production/release/restore refs listed above plus `main`.
- **33 annotated recovery tags** are verified and retained.
- **105 PRs total:** 76 merged, 29 closed-unmerged, zero open.
- The final two temporary maintenance refs were retired: the active final cleanup branch after merge, and the superseded maintenance pointer after its exact-SHA recovery tag was verified.
- The archive allowlist and no-PR prune allowlist are empty; no inactive working branch refs remain.
- This final inventory documentation branch is allowlisted for pruning after its own merge.



## Superseding authoritative snapshot — 2026-11-15 05:54 UTC

This section supersedes every earlier "current", "final", and "expected" count above. The older sections are retained as historical audit trail only.

- Canonical repository: `raawaa93/Raawaa`; default branch: `main`.
- Latest verified main commit after PR #106: `97706b02e2a42e01ae9ca1054d35430a4b873fe2`.
- Live branch enumeration: **17 refs**, matching the durable operational set below; no temporary documentation/maintenance branch remains in the live list.
- Recovery archive: **33 annotated exact-SHA tags**, including the final maintenance archive recorded above. Preserve all archive tags.
- Pull request state: **105 total, 76 merged, 29 closed-unmerged, 0 open** (latest open-PR query returned an empty list).
- Inactive non-operational working refs: **0**. Archive and no-PR prune allowlists are empty.
- Branch protection remains a security gap: `main.protected=false`, no repository rulesets were reported in the latest recorded audit, and the connected GitHub app previously received HTTP 403 when attempting to configure protection. Configure required checks and branch protection through an authorized GitHub settings session; do not treat empty commit statuses as passing CI.
- Latest combined commit-status query for `97706b0` returned no status entries. This is **not** proof that CI passed. The production release and browser/mobile checks recorded in the tooling/project audit refer to their explicitly recorded source commit and deployment, not automatically to this documentation-only merge.
- Production baseline recorded after PR #101: Cloudflare Pages deployment `b2923438-ad03-4c5a-816d-240fa6b5bbfd`, source `db1e0b131f596208b10e2e9c951d1f22c9beb916`, URL `https://b2923438.raawaa-store.pages.dev`. No production code, DNS, customer/order data, pricing, discounts, shipping, Supabase data, secrets, or billing changes were made by PRs #102–#106.
- Live refs (17):
  - `main`
  - `backup/continuity-hardening-2026-11-15`
  - `backup/site-2026-11-14-post-mobile-audit`
  - `backup/site-2026-11-14-restored-main`
  - `backup/site-2026-11-15-preproduction`
  - `deploy/10-percent-2026-11-14`
  - `deploy/10-percent-site-only`
  - `preview-deploy/visual-qa-after-csp-fix-2026-11-15`
  - `preview-deploy/visual-qa-current-2026-11-15`
  - `preview-deploy/2026-11-14`
  - `preview-deploy/2026-11-15-main-78ece71`
  - `production-deploy/release-2026-11-15`
  - `recovery/archive-store-supabase-migrations-2026-11-15`
  - `recovery/cloudflare-manifest-2026-11-14`
  - `recovery/inspect-edge-functions-2026-11-15`
  - `release/clean-pages-payload-2026-11-14`
  - `restore/integrated-store-2026-11-14`

Do not delete or consolidate any of these 17 refs without a new individual review proving they are obsolete and a verified recovery point. The current cleanup task is closed; future work should focus on production validation, security controls, and unresolved integrations rather than further branch deletion.
