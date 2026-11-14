# RAWAA Store — recovered Cloudflare Pages copy

This branch contains a recovery copy of the **published RAWAA Store site**, reconstructed from the files served by Cloudflare Pages. It is not the original Git repository export.

## Recovery status

- Cloudflare Pages project: `raawaa-store`
- Production URL: https://raawaa-store.pages.dev
- Production deployment: `10b28454-da98-4bb7-9172-ee947a93a9e3` (2026-11-08)
- Latest inspected preview: `10b8ef21-037c-43a9-adf8-37ac7874dcdd` (2026-11-14)
- Recovered: **197 of 199 deployed files** (all HTML, CSS, JS/MJS, SVG, JSON, text, captions, images, icons and fonts).
- Remaining: two Hama MP4 videos. Until those are copied, `hama.html` references the original public Pages URLs for those two videos; captions are included locally.
- All 10 recovered HTML pages passed a local-reference check against the deployment manifest.

## What is included

- Storefront pages: home, serum, Hama campaign, campaign landing page, privacy, setup, check, 404.
- Owner pages: owner dashboard and pricing editor.
- Front-end code: CSS, JavaScript and ES modules.
- Static assets: product and campaign images, brand marks, icons, fonts, PWA manifest, service worker and captions.
- `recovery/cloudflare-deployment-manifest.json`: production/preview file inventory and Cloudflare asset hashes.
- `recovery/RECOVERY-STATUS.md`: evidence, limitations and next steps.

## Important boundaries

- Cloudflare Pages reports `uses_functions: false` for the inspected deployments: the deployed Pages layer is static.
- A separate Supabase project contains owner-panel endpoints and staging-named order/Telegram functions. Their presence does **not** prove the public checkout currently uses that backend. The deployed privacy page describes WhatsApp-based order enquiries and no online payment/order database.
- No production deployment, DNS change, database write, migration, secret rotation or destructive action was performed during this recovery.
- The original repository `ghith93/Raawaa-store` remains the authoritative source for its Git history and any files not included in the published deployment. It is currently inaccessible through the connected GitHub account because the old account is suspended.
- A Cloudflare deployment copy cannot restore original commit history, unpublished source files, build tooling, or any secrets that were never part of the public deployment.

## Next steps

1. Retrieve the two MP4 files or keep their current external fallback.
2. Compare recovered file bytes against Cloudflare's recorded hashes.
3. Run functional checks on an isolated preview, including the owner panel and all customer paths.
4. Only after validation, decide whether to connect this repository to a new Pages preview. Do not point production at this branch until the source and backend boundaries are understood.
