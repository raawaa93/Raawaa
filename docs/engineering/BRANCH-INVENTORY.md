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


## Follow-up after inventory correction — 2026-11-15 05:56 UTC

- This documentation correction is committed directly to canonical `main` as `74762017ceea2c0344dd4273319f1ecd4115a89c`; that commit supersedes the immediately preceding main SHA `97706b02e2a42e01ae9ca1054d35430a4b873fe2` recorded in the preceding snapshot.
- The latest branch enumeration still returns exactly the same 17 durable refs. Latest open-PR query returned zero. No branches or recovery tags were deleted or modified during this follow-up.
- Cloudflare Pages `raawaa-store` still reports production deployment `b2923438-ad03-4c5a-816d-240fa6b5bbfd` as latest, built from `db1e0b131f596208b10e2e9c951d1f22c9beb916`; deployment stage is success. Later commits were documentation/maintenance only and did not trigger a new production release.
- Cloudflare Pages custom domain `rawaa.eu.org` remains `pending`: CNAME record not set. No DNS change was attempted.
- The current combined status query for the latest main commit had no status entries; treat CI as unverified, not passed.


## Live state refresh — 2026-11-15 06:19 UTC

- Canonical `main` is `c54c053faf9f1a2a76234dfa7d9c28f7e880bbe3` after the documentation-only PR #112 merge.
- Live branch enumeration returned **17 refs**: the 17 durable operational/recovery refs listed above plus `docs/correct-production-release-trigger-2026-11-15`, the exact head of merged PR #112. No other unexpected working branch was found.
- Open pull requests: **0**.
- PR #112 passed the Store checks workflow. Its merge triggered successful disaster-recovery backup and branch-hygiene workflows. The merged PR branch is now added to the exact merged-branch cleanup allowlist in a follow-up maintenance PR; the automated cleanup will retire only that exact merged head after the policy update merges.
- The production release workflow on commit `adbc74f31801afa92a37c83dcb1c7698e1248c3e` completed both validation and deployment successfully; the deploy job also passed the live security-header verification step. The documentation-only PR #112 did not trigger a production deployment.
- Visual QA run `43684775744` is in progress; do not mark visual/mobile QA complete until its report is inspected.
- GitHub API access for this connected integration returns 403 on the branch-protection endpoint and an empty rulesets collection. No rulesets were configured. Branch protection remains an unresolved account-administration task; do not claim it is enabled.
- Cloudflare Pages custom domain `rawaa.eu.org` remains pending in the latest repository audit; CNAME setup is still outstanding. No DNS changes were made.


## Final maintenance-ref closure — 2026-11-15 06:21 UTC

- Canonical `main`: `a1ccb3c58dd0988f70172bf4693ba7b809a049e5`.
- Branch hygiene workflow run `43684964173` succeeded and removed the exact merged PR #112 branch after its reviewed allowlist entry was merged.
- The live branch list at the time of this closure snapshot contained **17 refs**: the 17 durable operational/recovery refs above plus the merged PR #113 maintenance branch `maintenance/pr112-branch-hygiene-inventory-2026-11-15`. The new PR #114 adds its own temporary branch, so the current live count is **19 refs with 1 open PR (#114)**. After PR #114 merges and the exact-head cleanup runs, the expected stable state is 17 durable refs and 0 open PRs.
- This final closure PR adds the exact PR #113 maintenance branch and its own exact branch to the merged-branch cleanup allowlist. After merge, the same ancestry-safe cleanup workflow should remove only the PR #113 and PR #114 temporary refs and return the repository to the 17 durable refs, without touching any backup, deployment, preview, recovery, release, or restore checkpoint.
- Latest production deployment remains `44ff2ce7-0379-4311-86aa-43be465fdb75` from `adbc74f31801afa92a37c83dcb1c7698e1248c3e`; no production files changed in PRs #112–#113.
- Visual QA run `43684775744` completed successfully: 16 route/engine/viewport combinations, zero reported issues, and 58 report/screenshot files saved in artifact `14149818943`.
- Post-merge backup run `43684964177` completed successfully.


## Exact-SHA archive of the diverged PR #113 maintenance ref — 2026-11-15 06:25 UTC

- After PR #114 merged, the branch-hygiene run removed its own exact merged branch and preserved all protected operational refs. The remaining PR #113 maintenance branch did not qualify for ancestry-safe deletion: GitHub comparison showed it diverged from main by 8 commits and 3 commits behind.
- Re-read the exact branch ref: `maintenance/pr112-branch-hygiene-inventory-2026-11-15` points to `80e320e4b95138685ad10099c6087050d66b2b62`. The five changed files are historical documentation and branch-policy/test files; the current main already has newer versions. Because the ref is not an ancestor of main, do not delete it via the merged-branch cleanup path.
- Added this exact branch/SHA pair to the separate archive allowlist. The archive workflow will create an annotated recovery tag, resolve and verify the tag target against the captured SHA, re-read the live branch head, and only then delete the branch. Any mismatch or open PR retains the branch.
- PR #115's own maintenance branch is added to the exact merged-head cleanup allowlist so it can be pruned after its checks pass and it merges.
- Cloudflare read-back: zone `rawaa.eu.org` exists but remains `pending`; it contains a proxied CNAME to `raawaa-store.pages.dev`. Pages domain validation is also pending. The outstanding issue is zone/registrar activation or nameserver delegation, not absence of a CNAME in the zone. No DNS or nameserver changes were made.
- Visual QA is complete (16 cases, zero issues); the latest backup workflow succeeded. Production remains on deployment `44ff2ce7-0379-4311-86aa-43be465fdb75` from source `adbc74f31801afa92a37c83dcb1c7698e1248c3e`.


## Final post-cleanup read-back — 2026-11-15 06:25 UTC

- Live GitHub enumeration: **17 branches, 34 tags, 0 open pull requests**.
- Branch-hygiene workflow `43685324709` completed successfully.
- The moved PR #113 maintenance ref was preserved as an annotated tag at exact SHA `80e320e4b95138685ad10099c6087050d66b2b62`, tag `archive/branches/2026-11-15/maintenance/pr112-branch-hygiene-inventory-2026-11-15`; the tag target was read back and matched before the branch ref was retired.
- The remaining 17 branches are the purpose-specific main, backup, deploy, preview, production-deploy, recovery, release, and restore refs. No temporary work branch remains.


## Archive index confirmation — 2026-11-15

- The post-merge PR #113 maintenance head was preserved as annotated tag `archive/branches/2026-11-15/maintenance/pr112-branch-hygiene-inventory-2026-11-15` at exact commit `80e320e4b95138685ad10099c6087050d66b2b62`.
- Archive workflow `43685324709` verified the tag target and retired the branch ref.
- Current inventory remains **17 branches, 34 tags, 0 open PRs**.


## Final archive-follow-up cleanup — 2026-11-15 06:29 UTC

- The second exact-SHA archive tag is `archive/branches/2026-11-15/maintenance/record-pr113-archive-2026-11-15`, targeting `1415d8dcac9ca2113626659d4454b2450b42b423`.
- Two generated archive-finalization refs remain temporarily: `maintenance/finalize-archive-index-2026-11-15` and `maintenance/finalize-pr113-archive-2026-11-15`. Their documentation/policy changes are superseded by canonical main. Both are allowlisted only as no-PR refs and will be deleted only after their heads are fast-forwarded to main and GitHub confirms `ahead_by=0`.
- Current read-back: **19 branches, 35 tags, 0 open PRs**. Expected stable state after the exact-head cleanup: **17 branches, 35 tags, 0 open PRs**.


### Superseded archive-finalization refs reviewed — 2026-11-15

- `maintenance/finalize-archive-index-2026-11-15`, prior head `7035569abb0dcd626347170f3df288af10602eab`: its archive allowlist still referenced the already-retired PR116 head and is superseded by the canonical empty archive policy.
- `maintenance/finalize-pr113-archive-2026-11-15`, prior head `c91f134ffc24b5f29366fb071175734a872d5524`: its archive index, domain audit, and final branch state are now present in canonical main.
- Both are no-PR maintenance refs. Their content has been reconciled into main; they are fast-forwarded to the current main SHA and eligible for deletion only after GitHub confirms `ahead_by=0`.


## Final live inventory — 2026-11-15 06:44 UTC

- Latest verified GitHub read-back: **17 branch refs**, **35 annotated recovery tags**, **0 open pull requests**.
- Branch-hygiene run [#43686773498](https://github.com/raawaa93/Raawaa/actions/runs/43686773498) succeeded. It removed the exact merged maintenance refs `maintenance/fix-merged-head-cleanup-logic-2026-11-15` and `maintenance/retire-last-closed-ref-2026-11-15` after the merged-head allowlist and exact-head checks passed.
- The 17 retained refs are the purpose-specific `main`, backup, deploy, preview, production-deploy, recovery, release, and restore refs. No temporary maintenance branch remains in the live enumeration.
- The 35 archive tags remain intact; no backup, recovery, release, preview, deployment, or restore ref was removed.
- The earlier 19-branch / two-temporary-ref note above is a historical checkpoint and is superseded by this final live read-back.


## Live state refresh after PR #133 — 2026-11-15 08:02 UTC

This is the latest live read-back and supersedes the earlier 06:44 snapshot above.

- Canonical `main`: `fd0e469e54ebea4732088fdd686ae4da6061e335`.
- Live GitHub enumeration: **17 branch refs**; the exact 17 durable backup, deploy, preview, production-deploy, recovery, release, restore, and main refs remain. The stale merged mobile-header work branch and the PR #133 maintenance branch are absent.
- Open pull requests: **0**.
- Recovery tags: **36 recorded** — the prior 35 verified tags plus the new exact-SHA archive tag for the merged mobile-header fix. Its target was read back and matched the original branch head.
- PR #132 mobile/header corrections are merged. Store checks, Playwright browser checks, mobile Lighthouse, Graphify, and 16-case Chromium/WebKit visual QA all passed. The visual report recorded zero issues, no broken images, no console/page/CSP errors, no failed requests, and no horizontal overflow.
- PR #133 added the exact-SHA archive allowlist and regression tests; its Store checks and Graphify workflows passed. The archive was verified before the branch was retired.
- This refresh is documentation-only. It does not establish a new production deployment or change DNS, branch protection, pricing, delivery, payment, backend, customer data, or secrets.

### Retained branch policy

Keep the 17 operational/recovery refs. Continue to retire only individually reviewed merged branches or archive inactive refs after exact-SHA tag creation, tag-target read-back, and a fresh branch-head read. Never force-delete diverged refs or remove recovery tags during routine cleanup.


## Live branch reconciliation after PR #142 — 2026-11-15 09:16 UTC

This snapshot supersedes the earlier 08:02 inventory for current branch and pull-request state. Historical snapshots above are retained as an audit trail.

- Canonical `main`: `dbfcd63271c2ce10de0f8eaf3a4da142edf8babe` after merged PR #142.
- Live branch enumeration: **21 refs**. The 17 durable operational refs remain unchanged: 4 backup, 2 deploy checkpoints, main, 4 preview checkpoints, 1 production-deploy checkpoint, 3 recovery refs, 1 release checkpoint, and 1 restore checkpoint.
- Four temporary refs were separately identified: merged PR #137 (`fix/require-explicit-production-release-approval-2026-11-15`), merged PR #141 (`maintenance/allowlist-verified-doc-branches-2026-11-15`), merged PR #142 (`fix/exclude-dev-files-from-pages-payload-rebased-2026-11-15`), and the closed-unmerged superseded PR #136 branch (`fix/exclude-dev-files-from-pages-payload-2026-11-15`).
- PR #136 is closed without merge and its branch is deliberately retained. It is not eligible for merged-branch pruning; no branch deletion or archive-tag operation was performed for it.
- PR #142 is merged. Its fix excludes tests, generated reports, Playwright/Lighthouse PR config, and dependency manifests from the public Pages payload. Store checks, Graphify, and mobile Lighthouse passed on its PR merge commit. The mobile report artifact is `14154669356`; mobile scores: home 91, Serum 87, campaign 96, privacy 100. Campaign SEO 69 is expected because the page is intentionally noindex; Serum LCP is 3.8 s and remains a performance improvement target.
- PR #142 changed deployment tooling and audit documentation only; the explicit production workflow runs validation on main pushes but does not deploy without a manual `workflow_dispatch` approval input. No production deployment was requested or initiated by this merge.
- The follow-up branch-hygiene policy PR adds only the three exact merged branch names above plus its own exact head to the reviewed merged allowlist. Expected post-merge cleanup state: **17 refs** — the 17 durable operational refs plus the deliberately retained closed-unmerged PR #136 branch. This expectation must be verified by a fresh live enumeration after the workflow completes.
- Branch protection remains an administrative gap; do not claim it is enabled. Production DNS, customer/order data, pricing, payment configuration, secrets, and Supabase data were not changed.


## Live reconciliation — 2026-11-15 09:43 UTC

This read-back supersedes the 09:16 expected-state note above.

- Canonical `main`: `14ce2522ea9f6fffdd9bf665335e3341695c8421`.
- Live branch enumeration: **19 refs** — the 17 durable operational/recovery refs listed above, plus two closed-unmerged work refs:
  - `fix/exclude-dev-files-from-pages-payload-2026-11-15` — PR #136, closed without merge and retained because it diverged from current main.
- Open pull requests: **0**.
- No branch refs or recovery tags were deleted during this reconciliation.
- The three merged cleanup targets from PRs #137, #141, and #142 are absent from the live branch list.
- The 17 durable refs remain protected by policy. Do not delete either closed-unmerged ref without a separate exact-SHA archival review.

## Production reconciliation — 2026-11-15 09:43 UTC

- Cloudflare Pages latest successful production deployment remains `4b796357-63b2-47e1-8ad1-a2aad5c16626`, source commit `f2f091f0c19a2d0948c592b6aba538aa56e0d873`.
- Canonical main is seven commits ahead of that deployment. The intervening changes are deployment-payload hardening, validation/release policy, branch cleanup policy, and documentation; they do not change storefront product, pricing, payment, or delivery content.
- The production workflow now requires an explicit `workflow_dispatch` with `confirm_production=yes`. No production release was initiated in this reconciliation.
- The current source contains `sw.js`, but none of the active storefront HTML or JavaScript files references or registers it. Do not treat service-worker caching as the confirmed cause of the live alias response.
- Next release must first resolve the production-alias mismatch and pass the release validation pipeline. Production remains gated by explicit owner confirmation.

## Live correction — 2026-11-21

This addendum supersedes the 17-ref count in the 2026-11-15 snapshot above. A fresh live enumeration of GitHub refs returned **20 branches**, not 17:

- The 17 durable operational/recovery refs listed in the prior snapshot remain present.
- Three additional working refs were discovered:
  - `docs/agency-agents-adoption-2026-11-15`
  - `fix/exclude-dev-files-from-pages-payload-2026-11-15`

### Review of the three additional refs against current main

Current main at review: `8687b0ed62f15c0aa533fedb5e3904706c9f6dec`.

| Branch | Compare with main | File-level finding | Disposition |
|---|---:|---|---|
| `docs/agency-agents-adoption-2026-11-15` | 7 ahead / 1 behind | Every changed file in its compare result is byte-identical to current main, including Agency Agents adoption docs, tooling registry, AGENTS.md, production workflow, site checks, and release-policy test. | No merge needed. Retain until exact-head archive and deletion can be performed safely. |
| `fix/exclude-dev-files-from-pages-payload-2026-11-15` | 3 ahead / 24 behind | `scripts/build-deploy.mjs` is byte-identical to current main. Its only remaining file-level difference is the historical recovery readiness document. | No builder fix needed. Retain the historical branch until its unique recovery-document revision is reconciled or archived. |

No branch was deleted, force-updated, or merged during this review. The connected GitHub actions available in this session do not expose a branch-delete operation. Do not simulate cleanup by overwriting refs or deleting recovery evidence. A safe retirement requires capturing each exact branch-head SHA, creating and verifying an annotated recovery tag where needed, re-reading the ref to detect movement, and then deleting only the reviewed ref through an authorized branch-management path.

The three extra refs are working refs, not additional durable backup checkpoints. Keep the 17 operational/recovery refs protected. The live count must be refreshed again before any future cleanup; this addendum is a dated snapshot, not a permanent branch count.

### Production-release policy correction — 2026-11-21

A stale sentence in the historical audit trail above says production is gated by explicit owner confirmation. That sentence is superseded by the live canonical workflow and the current project policy:

- `.github/workflows/production-cicd.yml` runs validation for qualifying pushes to `main`, then automatically deploys the exact validated commit after freshness and clean-checkout guards pass.
- The workflow has no `workflow_dispatch` or `confirm_production` input. Do not reintroduce a manual confirmation gate.
- The latest Cloudflare production deployment observed in this audit is `14abd47f-6d32-454a-a818-1abba6c71d4d`, created 2026-11-15 09:52 UTC, status `success`, source SHA `667db996286c9b3446f8d790df410861aa9e0b1f`.
- Current canonical main after the 2026-11-21 documentation corrections is `9780dd8827fdb10b2fcf9b1ac6c65a844d96bb7e`. The difference from the deployed SHA consists only of workflow/policy/documentation/test files; no storefront page, pricing, product, or browser asset changed in those commits. The 2026-11-21 branch-inventory and project-memory corrections are documentation-only and excluded from production deployment triggers.


## Branch archive completion — 2026-11-20 23:32 UTC

This live read-back supersedes the 2026-11-21 snapshot above for the two archived working refs.

- Canonical main at the start of this cleanup: `d0b83e6e846b84d947664e09edf4fab1534cf05e`.
- The branch-hygiene workflow completed successfully. It inspected 20 branches and archived exactly two reviewed refs. The workflow created annotated recovery tags, read each tag target back, compared it to the exact captured branch-head SHA, re-read the live branch head, and only then deleted the branch ref.
- Archived `docs/agency-agents-adoption-2026-11-15` at `0ae06ec6949034351d1a33d2de81180e99d11d83` to `archive/branches/2026-11-15/docs/agency-agents-adoption-2026-11-15`. PR #145 was merged; all five changed files on the archived branch were byte-identical to canonical main at review. No merge was needed.
- Archived `fix/exclude-dev-files-from-pages-payload-2026-11-15` at `a4c976966be6d2193ccc76d216b3f0be3b76f27a` to `archive/branches/2026-11-15/fix/exclude-dev-files-from-pages-payload-2026-11-15`. PR #136 was closed unmerged and superseded by PR #142. Its `scripts/build-deploy.mjs` was byte-identical to main; the only unique change was a historical recovery-readiness note, preserved in the annotated tag.
- Two exact-SHA archive tags were added and verified by the successful archive workflow. The archive workflow's full run is [44837503723](https://github.com/raawaa93/Raawaa/actions/runs/44837503723).
- The same commit's disaster-recovery backup and offline code graph workflows both completed successfully: [backup 44837503835](https://github.com/raawaa93/Raawaa/actions/runs/44837503835), [graph 44837503788](https://github.com/raawaa93/Raawaa/actions/runs/44837503788).
- The archive-policy commit itself did not run the full storefront/unit test suite; the branch-hygiene, backup, and graph checks are not substitutes for those tests. A targeted policy-validation workflow is added in the follow-up commit below.
- Repository release governance remains an open gap: the live branch API reports `main.protected=false`, and the repository rulesets endpoint returns an empty list. The connected integration cannot write repository administration settings. No claim of branch protection is made.

## Policy validation and final live read-back — 2026-11-20 23:34 UTC

- Canonical main: `c48da736b1fa41548a3a846e6ef683ec5972e0f8`.
- Added `.github/workflows/repository-policy-validation.yml` so changes to the exact-SHA archive allowlist run the focused Node test automatically on main pushes and PRs.
- The first focused test run exposed a test expectation that had not been expanded for the two newly reviewed archive candidates (4/5 tests passed). Corrected the expected candidate list in the next commit. The rerun passed all five tests.
- Final check suite for the latest main SHA: exact-SHA archive policy validation **success**, branch prune **success**, branch archive **success**, disaster-recovery backup **success**. The latest archive run found no additional candidates and made no further deletions.
- No production workflow or Cloudflare Pages deployment was triggered by these maintenance-only commits. No storefront source, customer data, prices, DNS, Supabase data, secrets, or billing configuration changed.
- Branch protection remains unresolved: GitHub reports `main.protected=false` and zero repository rulesets. The connected GitHub integration is read-only for this administrative setting; configure a ruleset/branch protection through repository Settings before relying on mandatory checks.


## Superseding live state — 2026-11-21 after PR #147 cleanup

This is the current live enumeration and supersedes all earlier expected/current counts above.

- Canonical `main`: `f8d4e945afbf693177444fc62f518a05bfefb322`.
- Live branch refs: **17**.
- Open pull requests: **0** (147 total PR records inspected by the cleanup workflow).
- Archive tag refs: **40**. Preserve all.
- [Branch hygiene run #44841319041](https://github.com/raawaa93/Raawaa/actions/runs/44841319041) succeeded. It inspected 19 refs and 147 PRs, approved exactly two merged refs, and deleted:
  - `fix/remove-retired-route-build-guard-2026-11-21`
  - `maintenance/retire-pr146-branches-2026-11-21`
- The deletion was limited to the exact merged-head allowlist. No backup, recovery, deployment, preview, production-deploy, release, or restore ref was deleted.
- Current retained refs:
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

The repository is back to its 17 durable operational/recovery refs with no temporary working branch and no open PR. Do not delete or consolidate any of these refs without an individual review and a verified recovery point.


## Superseding live state — 2026-11-21 after PR #148

This section supersedes the 17-ref snapshot above. The live GitHub API enumeration returned 18 refs before the current documentation PR was opened; this documentation branch is expected to be removed by the exact merged-head allowlist after merge.

- Canonical `main`: `51856e1f8329e9f30086a03e106d5b7abaaa126c`.
- Live refs before this documentation branch: **18** (17 durable operational/recovery refs plus one redundant branch pointing exactly to the same SHA as main).
- The redundant ref is `perf/serum-css-pruning-2026-11-21`; it has no open PR in the live open-PR query and its head equals main. It was retained rather than deleted without an archive tag; retire it only through the exact-SHA archive workflow.
- The 17 durable refs remain the exact set listed in the preceding superseding snapshot: main; four backup refs; two deploy refs; four preview-deploy refs; one production-deploy ref; three recovery refs; one release ref; and one restore ref.
- Current GitHub API reported `protected=false` for every branch and `GET /repos/{owner}/{repo}/rulesets` returned an empty array. Branch protection is not configured. Do not interpret CI success as protection against direct pushes or force-pushes.
- No backup, recovery, deployment, preview, production-deploy, release, or restore refs were deleted or rewritten during this audit.
- PR #148 merged successfully and the production deployment/Visual QA workflows succeeded. See the dated operational release record in `docs/engineering/TOOLING-REGISTRY.md`.

Required administrative follow-up: configure a `main` branch ruleset requiring pull requests and verified PR checks, block force-push and deletion, and narrow the GitHub App installation to the repository set actually needed. The available GitHub connector can inspect but cannot mutate these settings.
