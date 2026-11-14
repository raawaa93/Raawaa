# Raawaa Store — PR and recovery reconciliation (2026-11-14)

## Scope separation
- This report concerns **Raawaa Store** only.
- The original development repository recorded in the prior work is `ghith93/Raawaa-store`.
- The separate **Raawaa Autonomous Engine** is a different project and must not be used as the Store source.
- The accessible recovery repository is `raawaa93/Raawaa`; its recovery branch is `recovery/cloudflare-manifest-2026-11-14`.
- This recovery repository was reconstructed from Pages deployments; it is not a clone/export of the original Git repository and does not contain the original commit history.

## Production baseline
- Cloudflare Pages project: `raawaa-store`.
- Production branch configured in Pages: `main`.
- Production deployment: `10b28454-da98-4bb7-9172-ee947a93a9e3`, created 2026-11-08.
- Production deployment source commit recorded by Cloudflare: `f466dbb5aa1d7a7cc156fac52eb9746c70d572ec`.
- The Pages project is Direct Upload (no Git source configured); inspected deployments report `uses_functions: false`.
- No production deployment was performed as part of this reconciliation.

## Prior development and preview evidence
The following evidence comes from the user's prior work context and the Cloudflare Pages deployment records. Preview success is not equivalent to a production release or a merged PR.

| Store PR / branch | Evidence | Current interpretation |
|---|---|---|
| #188 / `pr-188` | Preview succeeded for commits `4806aacb23d89151b03ad2c6911526c898298806` and `28621fd4b63552a822e0e28e11c2942418beebcd`; latest noted preview alias `https://pr-188.raawaa-store.pages.dev` | Design/brand and disclosure work; Draft/unmerged in prior check |
| #194 | Prior context records a Draft PR adding brand story/positioning and removing a packaging disclaimer | Original GitHub PR details currently inaccessible |
| #196 / `pr-196` | Preview succeeded at `6d4201c49496c7d659b232f440e9b2dea6cffa7f`; alias `https://pr-196.raawaa-store.pages.dev` | Campaign redesign; prior checks recorded 424/424 functional and 80/80 campaign tests passing; Draft/unmerged in prior check |
| #197 / `pr-197` | Preview succeeded at `67cd9186ddf99fc54bb4bcd69cb0bdbbc08ace2f`; alias `https://pr-197.raawaa-store.pages.dev` | Separate follow-on work; PR metadata not re-readable now |
| #204 / `pr-204` | Preview succeeded at `16c66889cfe0cfcb0eb342fb3118e32b1ef8541b`; alias `https://pr-204.raawaa-store.pages.dev`. Earlier commit `79fda3bdd4634d43b617b966e8f7e43a4e68cf73` also had a successful preview | Prior work records removal of old Hama campaign assets and legacy Luxury project, preservation of redirects, and deployment/build protections; Draft/unmerged in prior check |
| #205 / `pr-205` | Preview succeeded at `334c2cf860ebc3ec7c8e175efd4a129ad7ef623e`; alias `https://pr-205.raawaa-store.pages.dev` | Preview evidence only |
| #206 / `pr-206` | Cloudflare recorded commit `037a01bffeb8514e5c39d0d3075056fdc22693d6`; latest deployment failed. Earlier commit `4b11860c8752ee032c3db66f07fdd47262a779cd` remained active without a stable alias | Latest preview failure is at Pages publish stage: `Failed to publish your Function. Got error: Unknown internal error occurred.`. This is not evidence that the source code itself is invalid. Retry/diagnose in isolation before considering merge |
| #208 / recovery preview | Preview succeeded at `fa6df14c1a58efee3e93ab106e5cfc0ccc821529`; alias `https://pr-208.raawaa-store.pages.dev` | This is the recovery-copy preview, not the original PR development head |

## Per-file manifest comparison against the 2026-11-08 production snapshot
Cloudflare deployment manifests were compared by path and asset hash. These are deployment inventories, not a substitute for source diffs, but they establish which previews contain distinct deployed files.

| Preview checkpoint | Files | Added vs production | Removed vs production | Changed vs production |
|---|---:|---:|---:|---:|
| PR #188 | 201 | 2 | 0 | 29 |
| PR #196 | 177 | 8 | 30 | 26 |
| PR #197 | 200 | 1 | 0 | 5 |
| PR #204 | 179 | 1 | 21 | 4 |
| PR #205 | 200 | 1 | 0 | 1 |
| PR #206 latest failed deployment | 200 | 1 | 0 | 1 |

Key findings:
- PR #205 is the closest successful preview to production by manifest: it adds only `/elyra/index.html` and changes `/sw.js`.
- PR #206 has the same file paths as PR #205 and differs from it only in `/sw.js`. Its latest deployment fails at the Pages publish stage, so PR #205 is the closest successful checkpoint for this small change set.
- PR #197 differs from PR #205 in `/index.html`, `/js/config.js`, `/serum.html`, `/sitemap.xml`, and `/sw.js`.
- PR #188 is a much broader design/content checkpoint: it adds `/css/rawaa-design-system.css` and `/elyra/index.html`, and changes 29 deployed files compared with production.
- PR #196 is a divergent campaign/editorial variant: it adds real-bottle product images and serum editorial assets, but removes 30 production files including Hama campaign media.
- PR #204 is another divergent variant: it removes 21 production files, including `/hama.html`, `/css/hama.css`, Hama imagery, captions, and both Hama MP4 files.
- PR #188, #197, #205, and #206 manifests contain both Hama MP4 files. PR #196 and #204 do not.
- These branches are not one simple linear upgrade chain. Do not combine them by blindly choosing the highest PR number or copying one deployment over another; reconcile the product/campaign intent and source diffs first.

## Recovery findings
- The 2026-11-08 production snapshot is older than several successful previews created on 2026-11-13.
- Therefore the production snapshot alone is not an acceptable basis for claiming that the latest Store work has been recovered.
- Cloudflare deployment inventories show the two Hama MP4 files are present in production (2026-11-08), PR #188, PR #197, PR #205, and PR #206 (including its failed latest deployment), with stable asset hashes: `reel-50ml.mp4` = `a4a602e3a098e871f1ef96ba195f5306`; `reel-hama.mp4` = `37be589ca8e37bedd9f0cccbe83edd9c`. They are absent from the PR #196 and PR #204 deployment inventories. The recovery branch currently lacks local copies, but these assets are not missing from the known production/deployment evidence. Recover the bytes from an accessible published asset URL or another authorized source before declaring them unavailable.
- The failed PR #206 deployment log contains a generic Pages Function publish error. The deployment's metadata still reports `uses_functions: false`; investigate the Pages publish/runtime issue separately from source-code validation.
- PR #188, #197, #205 and #206 previews retain the two Hama MP4s in their deployment inventories; PR #196 and #204 do not. PR #196 and #204 remain useful checkpoints for their respective campaign/design changes. Compare the complete per-file inventories and hashes across these snapshots before consolidating.
- Do not merge PRs, overwrite the production deployment, or change commercial pricing/authentication settings as part of source recovery.

## Domain reconciliation — HOLD
- Cloudflare Pages currently lists `raawaa-store.pages.dev` as the project subdomain.
- Pages currently lists `rawaa.eu.org` as a custom domain in `pending` status, with verification error `CNAME record not set`.
- The only Cloudflare zone returned for this account is `rawaa.eu.org`, also in `pending` state.
- This proves that `rawaa.eu.org` was added to the current Cloudflare account/project configuration; it does **not** prove that this is the user's intended or historical Store domain.
- Do not change nameservers, DNS records, or Pages custom-domain settings until the intended production domain is established from historical configuration or explicit confirmation.

## Recovered source snapshots from successful preview deployments
Using Cloudflare Browser Rendering, actual HTML and text assets were retrieved from authorized public Pages preview URLs and committed into isolated snapshot directories on this recovery branch. The recovered files are snapshots, not a merged production candidate.

### PR #188
- `recovery/snapshots/pr-188/index.html`
- `recovery/snapshots/pr-188/serum.html`
- `recovery/snapshots/pr-188/hama-route.html` (the preview route redirected to the Serum page; this is recorded as a redirect result, not a standalone Hama source page)
- `recovery/snapshots/pr-188/js/config.js` (UTF-8 Arabic encoding was repaired and verified after Browser Rendering's plain-text wrapper exposed a Windows-1252 mojibake representation)

### PR #197
- `recovery/snapshots/pr-197/index.html`
- `recovery/snapshots/pr-197/js/config.js`

### PR #205
- `recovery/snapshots/pr-205/index.html`
- `recovery/snapshots/pr-205/serum`
- `recovery/snapshots/pr-205/privacy`
- `recovery/snapshots/pr-205/js/config.js`
- `recovery/snapshots/pr-205/js/marketing.js`
- `recovery/snapshots/pr-205/js/formula-cards.js`
- `recovery/snapshots/pr-205/js/index-inline.js`
- `recovery/snapshots/pr-205/css/home-inline.css`
- `recovery/snapshots/pr-205/css/utilities.css`
- `recovery/snapshots/pr-205/css/three-formulas.css`

Each committed file was read back from GitHub and compared byte-for-byte with the retrieved content. Binary media/fonts/images are not yet restored into these snapshot directories.

## Commercial configuration divergence — do not consolidate automatically
The recovered PR #188 `js/config.js` sets Sham Cash discount to **10%**. The recovered PR #205 `js/config.js` sets it to **15%**. Both contain the same displayed SYP product price ladder (2,000/2,400/2,800 for Rosemary-Caffeine and 1,800/2,200/2,600 for the other two formulas), but the discount changed between checkpoints. The PR #205 homepage copy also says 15%. This is a real version difference, not merely the stale comment already identified in the pricing policy. Preserve both snapshots and do not select a final commercial policy without reconciling the intended approved change.

## Access limitation
- The connected GitHub identity for `ghith93` currently receives HTTP 403 with GitHub's message that the account is suspended.
- The connected `raawaa93` identity can access `raawaa93/Raawaa`, but the original `ghith93/Raawaa-store` repository returns 404 from that identity.
- Do not infer that original source history is deleted. The current connector cannot read it.
- No credentials, tokens, or secrets should be pasted into chat.

## Next technical sequence
1. Recover the original Store repository access through GitHub's account recovery/appeal or an authorized repository transfer; do not attempt to bypass suspension.
2. In the meantime, preserve PR #196, #197, #204 and #206 preview checkpoints and collect their deployment manifests/hashes.
3. Compare PR #196 -> #204 -> #206 file inventories and identify the newest successful source checkpoint per file.
4. Recover the two Hama MP4s from a successful preview or another authorized asset source.
5. Reconstruct a consolidated branch in the recovery repository, preserving the original PR/commit references in this report.
6. Run functional, accessibility, security, and deployment checks on a fresh isolated preview.
7. Only after the source and target domain are confirmed, plan a controlled production release.

## Actions performed for this reconciliation
- Read the recovery branch README and open recovery PR #1.
- Queried Cloudflare Pages project metadata, custom-domain list, and deployment history.
- Retrieved detailed metadata and logs for the failed #206 preview and successful #196/#204/#188 preview checkpoints.
- Confirmed the failed #206 publish error and current pending custom-domain state.
- No production deployment, DNS change, Pages domain mutation, database mutation, or merge was performed.
