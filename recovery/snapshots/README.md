# Raawaa Store preview snapshots

These are isolated source/page snapshots recovered from Cloudflare Pages previews. They are retained separately because the PRs are divergent checkpoints, not a single proven linear history.

## Snapshot map

| Preview | Preserved material | Completeness |
|---|---|---|
| PR #188 | Homepage, Serum route, config, design-system/campaign/home/Serum/global CSS, marketing/offers/pricing/campaign/Serum scripts, cart script | Cart script is incomplete: 72,000 / 90,326 characters |
| PR #196 | Homepage, Serum route, privacy page | HTML checkpoint only |
| PR #197 | Homepage, config | HTML/config checkpoint |
| PR #204 | Homepage, Serum route | HTML checkpoint |
| PR #205 | Homepage, Serum, privacy, campaign, Hama route, Elyra landing page; config, marketing, offers, pricing policy, cart, Serum views, campaign, PWA and page scripts; global/home/Serum/campaign/Hama/utilities/formula CSS | Recovered text sources are complete and read-back verified |

## Important rules

- Do not copy one snapshot wholesale over another or over the root site.
- PR #205 is the closest successful preview to the production manifest; it is a strong reconstruction baseline, not proof that every intended feature is approved.
- PR #188 carries a separate design and pricing variant, including a 10% Sham Cash discount versus 15% in PR #205. This comparison is historical only; the owner confirmed 10% as the sole active Sham Cash discount on 2026-11-14.
- PR #196 and PR #204 remove or omit different production assets; preserve them as alternate checkpoints.
- Binary images, fonts and videos are not all duplicated into these snapshot folders. The recovery branch's root production copy retains most production assets.
- PR #188 `js/cart.js` is partial and must never be treated as a complete deployable file.
- No snapshot has been promoted to the root production tree. No merge or production deployment has been performed.

## Detailed evidence

See [PR and recovery reconciliation](../PR-RECOVERY-2026-11-14.md) for deployment IDs, commit SHAs, manifest comparisons, access limitations and the Browser Rendering rate-limit hold.


## Snapshot inventory
The current recovery PR contains 45 files under the PR-specific snapshot directories, plus this index: PR #188 (15), PR #196 (3), PR #197 (2), PR #204 (2), and PR #205 (23). The PR #188 cart file is counted as a preserved partial artifact, not a complete source file.


## Active policy override (2026-11-14)

All snapshots remain read-only historical evidence. The 10% Sham Cash-only discount and free delivery to all Syrian governorates for every payment method are the active owner-approved policy. The 15% value preserved in PR #205 and older production captures is superseded and must never be copied into current site content or a deployment payload.
