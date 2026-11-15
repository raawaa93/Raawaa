# RAWAA Store branch inventory and cleanup record

**Snapshot:** 2026-11-15 UTC, after PR #100 and archive run #43680881436  
**Repository:** `raawaa93/Raawaa`  
**Canonical branch:** `main` — `edc49efe9b98f961fccef4554a2969a02d239b0e`  
**Cleanup workflow:** `.github/workflows/cleanup-merged-branches.yml`  
**Archive policy:** `scripts/branch-archive-policy.cjs`  
**Archive manifest:** `docs/engineering/BRANCH-ARCHIVE-MANIFEST.md`  
**Recovery index:** `docs/engineering/ARCHIVED-BRANCHES.md`

## Current snapshot

- Branch refs at this snapshot: **21** (20 immediately after archive run, plus this active maintenance branch).
- Pull requests: **100** total — **72 merged**, **28 closed-unmerged**, **0 open** before opening the current hygiene PR.
- Annotated recovery tags created by the first archive run: **29**.
- Backups: **4**; recovery refs: **3**.
- Operational namespaces retained: **2 deploy**, **4 preview-deploy**, **1 production-deploy**, **1 release**, **1 restore**.
- Three remaining inactive refs are pinned for the next recovery-tag archive batch: `docs/workspace-hygiene-2026-11-15`, `fix/visual-audit-top-viewport-clean-2026-11-15`, and `maintenance/archive-inactive-branches-final-2026-11-15`.
- `maintenance/final-workspace-hygiene-2026-11-15` is the active branch for this follow-up PR.

## Completed cleanup

- PR #70 introduced the ancestry-safe branch-pruning policy and passed CI.
- PR #74 protected operational namespaces and recovery refs.
- PR #100 introduced a second archival stage that creates an annotated recovery tag for an exact SHA, verifies the tag target, re-reads the branch head, and only then deletes the branch ref.
- [Run #43680881436](https://github.com/raawaa93/Raawaa/actions/runs/43680881436) succeeded:
  - Inspected 50 branches and 100 PRs.
  - Prune stage deleted one reviewed merged ref: `maintenance/archive-inactive-branches-2026-11-15`.
  - Archive stage created **29 verified annotated tags** and removed the corresponding branch refs.
  - Zero failures.
  - 20 branch refs remained immediately after the run.
- The 29 archived tags and their exact original SHAs are listed in `docs/engineering/ARCHIVED-BRANCHES.md` and `docs/engineering/BRANCH-ARCHIVE-MANIFEST.md`.

## Current branch-by-branch inventory

| Branch | Head SHA | Classification | Action |
|---|---|---|---|
| `backup/continuity-hardening-2026-11-15` | `d45bf1461c70cae07208f32dd09c7d66aefdab35` | Backup | Keep |
| `backup/site-2026-11-14-post-mobile-audit` | `e86b349e6da63733ceb6f9849033a29dd71c0eb4` | Backup | Keep |
| `backup/site-2026-11-14-restored-main` | `306865da8e168cf5847a68ea8bdb3fa448df8a9a` | Backup | Keep |
| `backup/site-2026-11-15-preproduction` | `30ee1bbeda771c194fddc83c066d873ac02f1d81` | Backup | Keep |
| `deploy/10-percent-2026-11-14` | `fb7a128a78b950c80a835162a178004fb7fbcf46` | Deployment checkpoint | Keep |
| `deploy/10-percent-site-only` | `064815e643c25c4f2cfa707ecd032088a5f6e282` | Deployment checkpoint | Keep |
| `docs/workspace-hygiene-2026-11-15` | `c11d94ec1ebd49ebfd8d9e508022859e34cbe7d9` | Closed PR #99; source changes salvaged into this follow-up | Archive with pinned recovery tag after merge |
| `fix/visual-audit-top-viewport-clean-2026-11-15` | `c0ccb2db0657d414885e68f16b8b79c9f73b4531` | Merged PR #98; post-merge commits remain outside main ancestry | Archive with pinned recovery tag |
| `main` | `edc49efe9b98f961fccef4554a2969a02d239b0e` | Canonical | Keep |
| `maintenance/archive-inactive-branches-final-2026-11-15` | `ad3aaa80e47f2a4d823d85123f30c27726fb206d` | PR #100 merged; seven branch-only commits remain | Archive with pinned recovery tag |
| `maintenance/final-workspace-hygiene-2026-11-15` | `98503e87022cbaa86392ef95b53a2b8db90d21cb` | Active follow-up implementation | Keep until PR resolves |
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

## Safety rules

1. Never delete `main`, protected refs, backups, recovery refs, restore/release/deploy checkpoints, production-deploy refs, active preview refs, or open-PR heads.
2. Prune only reviewed merged/duplicate refs when ancestry or exact tree evidence proves the work is already in main.
3. For unique or closed-unmerged work, create and verify an annotated tag to the exact SHA before deleting the branch ref.
4. A changed branch head, open PR, missing ref, failed comparison, or mismatched tag target means retain the branch.
5. Keep archive tags permanently unless the owner explicitly authorizes archive retention changes.
6. No force deletion, history rewriting, DNS changes, billing changes, or customer-data changes.

## Next verification

- Merge the current follow-up only after Store checks, Playwright, Graphify, and mobile performance checks pass.
- Run branch hygiene again; it should archive the three pinned inactive refs once the PR is closed and merged.
- Verify the resulting branch count, tag count, and run summary before marking the repository fully clean.
