# RAWAA Store — live audit and source restoration reconciliation
Date: 2026-11-14 (UTC)

## Current source-recovery result

- The full recoverable website source is now merged into `raawaa93/Raawaa:main`.
- PR #2 integrated the PR #188 10% Sham Cash checkpoint with matching CSS/JS and the complete cart from PR #205. PR #1 merged the full recovered website and historical snapshots into `main`.
- Root website inventory: 199 files. Compared with the 199-file production manifest, the only missing paths are `assets/img/hama/reel-50ml.mp4` and `assets/img/hama/reel-hama.mp4`; the user confirmed these videos are not important and they are intentionally omitted.
- The two extra root paths compared with production are `README.md` and `css/rawaa-design-system.css`.
- Full site regression and JavaScript syntax checks passed in GitHub Actions on the restored source and again after the README update.
- Latest main documentation commit: `130930024121a8f0849d824bfb66413ba8e447b7`.
- This is a reconstruction from deployed and preview artifacts, not the original Git history or unpublished source.

## Public production website

- `https://raawaa-store.pages.dev/` was previously observed returning HTTP 200.
- The earlier crawl found HTTP 200 for the home page, `/serum`, `/hama`, `/privacy`, `/campaign`, `/check`, and `/setup`.
- WhatsApp destinations were skipped as external links. The crawler returned `unsupported_content_type` for MP4 URLs; that was not proof of missing videos.
- `/owner/` and `/owner/pricing` are disallowed by `robots.txt`. The owner page declares `noindex,nofollow`, contains a password-login form, and says direct website order intake is not enabled. Robots exclusion is not access control; the app's authentication is the relevant control.
- No production deployment has been made during the source restoration. The live site remains on its previously inspected Cloudflare deployment.

## Cloudflare Pages and DNS

- Pages project: `raawaa-store`.
- Last inspected production deployment: `10b28454-da98-4bb7-9172-ee947a93a9e3` (2026-11-08; 199 files).
- Latest inspected preview at the time of the audit: `10b8ef21-037c-43a9-adf8-37ac7874dcdd` from `pr-208` (2026-11-14; 200 files).
- Deployment metadata reports ad-hoc uploads, idle clone/build stages, no Git source configuration, and `uses_functions: false`. The current project is Direct Upload. A GitHub merge does not deploy it.
- Keep the existing `raawaa-store` project on Direct Upload. If repository-based automation is needed, use a controlled Wrangler workflow and an isolated preview; do not convert the production project to Git integration.
- Custom domain `rawaa.eu.org` remains `pending`. Cloudflare reports the zone as `pending` with activation failure `unresolvable`, and Pages reports `CNAME record not set`.
- The CNAME `rawaa.eu.org -> raawaa-store.pages.dev` exists inside the inactive zone. The remaining issue is at parent delegation: Cloudflare assigned `carl.ns.cloudflare.com` and `irma.ns.cloudflare.com`. Verify the intended domain and any stale DNSSEC/DS record before changing delegation. No DNS changes were made.

## Recovered source and current commercial-policy difference

### Source in GitHub main
- Homepage and Serum content/style/scripts use the PR #188 checkpoint.
- Sham Cash discount is 10% on eligible orders only; no discount applies to other payment methods.
- Delivery is free to every Syrian governorate for all payment methods.
- The Serum page states that current blends contain oils and fragrance.
- Customization is a preliminary request; availability and price are confirmed before acceptance.
- Packaging imagery is disclosed as conceptual.
- No unapproved Product Offer/AggregateOffer pricing schema is emitted on the Serum page.
- The full 88,132-character cart implementation from PR #205 is retained; the partial PR #188 cart was excluded.

### Public production checkpoint
- The last inspected production deployment predates this source restoration and was observed advertising 15% Sham Cash.
- Therefore live production and the recovered source currently encode different discount values (15% live vs. 10% in GitHub main). The recovered source deliberately follows the PR #188 policy. Confirm the canonical commercial decision before any deployment.
- The Hama campaign's SYP/USD messaging and campaign context should be reviewed as part of the next content pass; no prices were changed in this recovery.

## Supabase/backend boundary

- The inspected Pages deployments report `uses_functions: false`; the public site is a static Pages deployment.
- A separate Supabase project contains owner/order/Telegram functions and staging-named services. Their presence does not establish that the public checkout uses them.
- The prior read-only review found the `rawaa_store` tables RLS-enabled and no direct `anon` or `authenticated` grants/policies in the inspected schemas. Do not add broad policies to clear advisor notices.
- Three Edge Functions previously appeared with `verify_jwt=false`; inspect their endpoint-level authorization in source before exposing public order intake.
- No Supabase writes, migrations, function deployments, or secrets changes were made during recovery. Two function source retrievals previously failed with ProtocolError, so those function bodies were not verified.

## Next safe work

1. Run a functional mobile Safari/iPhone pass on an isolated preview: product selection, pricing, cart, WhatsApp message composition, privacy, and owner login.
2. Resolve the 10% vs. 15% discount difference before release; preserve free delivery unless the owner changes it.
3. Review Hama campaign prices and content against the intended current offer.
4. Verify asset bytes against Cloudflare hashes where practical.
5. Resolve the `rawaa.eu.org` parent delegation only after confirming it is the intended customer-facing domain.
6. Prepare an isolated Cloudflare Direct Upload preview with Wrangler. Promote to production only after review and explicit approval.
7. Review the three `verify_jwt=false` Edge Functions at source level before enabling any public order flow.

## Safety record

No production deployment, DNS mutation, database write, migration, secret rotation, or destructive action was performed during source restoration.