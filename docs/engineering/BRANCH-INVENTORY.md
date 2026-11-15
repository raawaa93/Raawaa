# RAWAA Store — verified branch inventory

**Audit date:** 2026-11-15  
**Repository:** `raawaa93/Raawaa`  
**Main at audit start:** `db1e0b131f596208b10e2e9c951d1f22c9beb916` (PR #101 merged)  
**Branch hygiene run:** [#43682035975](https://github.com/raawaa93/Raawaa/actions/runs/43682035975) — success  
**Recovery index:** [ARCHIVED-BRANCHES.md](ARCHIVED-BRANCHES.md)

## Verified state

- **18 live branch refs** were observed after PR #101 merged, including the temporary branch used to prepare this inventory update.
- **17 durable refs** are intended to remain after this documentation PR merges and the cleanup workflow retires its own merged head.
- **32 archive tags** exist: 29 from the first archive batch and 3 from the final batch.
- The final three reviewed inactive refs were archived only after creating/verifying their exact-SHA recovery tags.
- No open pull requests were present at the time of this audit.
- The branch cleanup run completed both prune and archive jobs successfully.

## Durable branches to retain

| Branch | Head SHA at audit | Classification |
|---|---|---|
| `main` | `db1e0b131f596208b10e2e9c951d1f22c9beb916` | Canonical production source |
| `backup/continuity-hardening-2026-11-15` | `d45bf1461c70cae07208f32dd09c7d66aefdab35` | Backup |
| `backup/site-2026-11-14-post-mobile-audit` | `e86b349e6da63733ceb6f9849033a29dd71c0eb4` | Backup |
| `backup/site-2026-11-14-restored-main` | `306865da8e168cf5847a68ea8bdb3fa448df8a9a` | Backup |
| `backup/site-2026-11-15-preproduction` | `30ee1bbeda771c194fddc83c066d873ac02f1d81` | Backup |
| `deploy/10-percent-2026-11-14` | `fb7a128a78b950c80a835162a178004fb7fbcf46` | Deployment checkpoint |
| `deploy/10-percent-site-only` | `064815e643c25c4f2cfa707ecd032088a5f6e282` | Deployment checkpoint |
| `preview-deploy/visual-qa-after-csp-fix-2026-11-15` | `2757a76415bd21cdd00fe7a256dfc52321f96b02` | Preview checkpoint |
| `preview-deploy/visual-qa-current-2026-11-15` | `7ca62ffaaf2be5fd337255d66679621be399ddae` | Preview checkpoint |
| `preview-deploy/2026-11-14` | `342eb994547f255bfc5226bc071d03719b4f8303` | Preview checkpoint |
| `preview-deploy/2026-11-15-main-78ece71` | `2a01516e0c6256251a84f5a1c0e7a78f4ce2dec9` | Preview checkpoint |
| `production-deploy/release-2026-11-15` | `cd71478c7ca3d4cb9b38a5afc5f226de57e5503a` | Production release checkpoint |
| `recovery/archive-store-supabase-migrations-2026-11-15` | `fc963b9e559323bcd4cfca9d4ab26128fb844c52` | Recovery archive |
| `recovery/cloudflare-manifest-2026-11-14` | `36d64f2b9ade7d7e7831c9a9bd756fdfa888c72a` | Recovery archive |
| `recovery/inspect-edge-functions-2026-11-15` | `770a8beeef093dadd5f78fff0f7f157d050fe0c9` | Recovery archive |
| `release/clean-pages-payload-2026-11-14` | `8cba6b94ce39282999d3c4c86ca2a60845c805a2` | Release checkpoint |
| `restore/integrated-store-2026-11-14` | `b74fcf3dadecf52c0c40ce848ef67b104d7f73ec` | Restore checkpoint |

## Temporary inventory branch

`docs/final-branch-inventory-2026-11-15` is the documentation branch for this update. It is intentionally excluded from the durable list above and is added to the exact merged-branch cleanup allowlist so its ref can be retired after this PR merges.

## Archive and recovery policy

- Keep `main`, backups, recovery refs, restore/release/deploy checkpoints, production-deploy refs, and active preview refs.
- Prune merged branch refs only when the branch is explicitly allowlisted and the current head is verified safe to remove.
- For unique inactive work, create an annotated recovery tag pointing to the exact 40-character branch-head SHA, verify the tag target, re-read the live branch head, and only then remove the branch ref.
- Retain branches on changed heads, open PRs, failed comparisons, tag mismatches, or API errors.
- Never force-delete refs or rewrite Git history.
- Archive tags are durable recovery points and must not be removed by routine cleanup.

## Production release verification

PR #101 merged as commit `db1e0b131f596208b10e2e9c951d1f22c9beb916`. The automatic production workflow [#43682036128](https://github.com/raawaa93/Raawaa/actions/runs/43682036128) succeeded:
- Browser regression tests passed.
- Store policy and page-integrity checks passed.
- Clean Cloudflare Pages payload validated (188 files).
- Production deployment completed.
- Security headers verified on `/`, `/owner/`, and `/owner/pricing`.

Mobile Lighthouse [#43682035995](https://github.com/raawaa93/Raawaa/actions/runs/43682035995) completed successfully and uploaded 12 reports (3 runs each for home, serum, campaign, and privacy). Detailed findings are recorded in the project follow-up work; passing the workflow does not mean every Lighthouse advisory is resolved.
