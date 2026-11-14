# RAWAA Store — recovery record

## Confirmed deployment evidence
- Cloudflare Pages project: `raawaa-store`.
- Production: `10b28454-da98-4bb7-9172-ee947a93a9e3` at 2026-11-08T06:18:43.549584Z; branch `main`; commit `f466dbb5aa1d7a7cc156fac52eb9746c70d572ec`; 199 deployed files.
- Latest inspected preview: `10b8ef21-037c-43a9-adf8-37ac7874dcdd` at 2026-11-14T05:32:31.762155Z; branch `pr-208`; commit `fa6df14c1a58efee3e93ab106e5cfc0ccc821529`; 200 deployed files.
- Both deployment records say `uses_functions: false`. Pages serves a static site; the published inventory includes HTML, CSS, JavaScript modules, images, fonts, videos, PWA files, and owner-panel files.
- The deployment inventory is preserved in `cloudflare-deployment-manifest.json`.
- Recovered and committed the published HTML for `/`, `/serum`, `/hama`, and `/privacy` into this recovery branch. These are deployed copies, not the original pre-build source files.

## Arena provenance
The production deployment commit message includes `ARENA-ORDER-BACKEND-001 (6717979189)`, showing Arena-associated work in the recorded project history. The connected tools in this ChatGPT workspace do not expose an Arena execution/session connector. The original GitHub repository `ghith93/Raawaa-store` currently returns HTTP 403: “Sorry. Your account was suspended”, so its issues, PRs, and Arena task comments cannot currently be inspected here.

## Backend evidence (read-only inspection)
- Supabase project `oyoyozdugicmnkfhjovo` is ACTIVE_HEALTHY and contains a `rawaa_store` schema with store-specific tables; six active Edge Functions are listed, including owner orders, Telegram pairing/testing, outbox, retention, and commerce API. Several are explicitly named Staging, so do not assume they are production services.
- Separate Supabase project `xuwtuhfqjjwszxqkmivj` (`raawaa-engine-fallback`) is ACTIVE_HEALTHY. It contains `commerce` order/event/rate-limit tables and `engine_fallback` task/audit/dispatch/heartbeat tables, plus an active `engine-fallback` function and a `commerce-api` function. This is a separate fallback/staging architecture, not evidence that the public Pages deployment runs these services.
- No database writes, migrations, function deployments, or secrets were changed/read during this recovery pass.

## Recovered site pages
- `index.html` — 10,381 bytes
- `serum.html` — 36,722 bytes
- `hama.html` — 13,037 bytes
- `privacy.html` — 8,096 bytes

## Recovery safeguards
- Production Pages project was not modified.
- Production and preview manifests are kept separate.
- Do not infer source code, backend behavior, secrets, or database state from static deployment metadata.
- The original repository remains the preferred recovery source if GitHub restores account access or an authorized Arena/local export is obtained.
- If reconstructing from the deployed site, verify downloaded file bytes against the recorded hashes before committing them.

## Next actions
1. Retrieve remaining deployed assets (CSS, JS, JSON, SVG, fonts, images, media, and owner-panel files) from their public Pages URLs and compare bytes with the recorded hashes.
2. Reconstruct the original repository structure and dependencies from the recovered files; inspect Arena provenance for any source export or task artifacts if available.
3. Validate the frontend against the two Supabase projects and verify customer/owner workflows without changing production.
4. Deploy only to an isolated preview after tests pass.
