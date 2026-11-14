# RAWAA Store — live recovery audit
Date: 2026-11-14 (UTC)
Scope: read-only inspection of Cloudflare Pages, DNS, the recovered GitHub branch, and the linked Supabase project. No production deployment, DNS mutation, database write, migration, secret change, or destructive action was performed.

## Current public site
- `https://raawaa-store.pages.dev/` returned HTTP 200. Its canonical URL points to the same Pages hostname; no `X-Robots-Tag: noindex` header was present on the public alias.
- A Cloudflare crawl completed with 7 discovered URLs: the home page, `/serum`, `/hama`, and `/privacy` returned HTTP 200. WhatsApp destinations were skipped as external links. The two MP4 URLs returned crawler outcome `unsupported_content_type` (HTTP 415 from the crawler), which is not evidence that the video files are missing or broken.
- Additional direct path checks returned HTTP 200 for `/campaign`, `/check`, and `/setup`.
- `/owner/` and `/owner/pricing` are disallowed by `robots.txt`. The owner page itself declares `noindex,nofollow`, contains a password-login form, and explicitly states that direct website order intake is not enabled yet. Robots exclusion is not an access-control mechanism; the app's authentication is the relevant control.

## Cloudflare Pages and DNS
- Pages project `raawaa-store` remains present. Its canonical production deployment is `10b28454-da98-4bb7-9172-ee947a93a9e3` (2026-11-08; 199 files). The newest inspected preview is `10b8ef21-037c-43a9-adf8-37ac7874dcdd` from `pr-208` (2026-11-14; deploy stage succeeded; 200 files).
- Deployment metadata shows ad-hoc uploads with clone/build stages idle and no Git source configuration in the Pages project response. This appears to be a Direct Upload project. The newest preview URL also returned HTTP 200; its `noindex, nofollow, noarchive` response header is expected for a preview, and its canonical URL correctly points to the production Pages hostname.
- **Do not convert this existing project to Git integration.** Cloudflare documents both transitions as one-way: a Direct Upload project cannot later be switched to Git integration, and a Git-integrated project cannot later be switched to Direct Upload. Connecting GitHub natively would therefore require a separate Pages project, not a safe in-place switch. Preserve `raawaa-store` and, if repository-based automation is later needed, deploy from GitHub Actions using Wrangler into the existing Direct Upload project.
- Custom domain `rawaa.eu.org` is still `pending`. Cloudflare's zone status is `pending` with activation failure `unresolvable`; the Pages custom-domain verification says `CNAME record not set`. A CNAME record for `rawaa.eu.org -> raawaa-store.pages.dev` exists in the Cloudflare zone, but the zone itself is not active.
- Nameservers assigned to the zone: `carl.ns.cloudflare.com` and `irma.ns.cloudflare.com`. The remaining domain fix is at the parent/registrar delegation layer: publish the exact assigned nameservers for `rawaa.eu.org` and check for stale DNSSEC/DS data. Editing the CNAME again inside the inactive zone will not fix the delegation.

## GitHub recovery repository
- Repository: `raawaa93/Raawaa`.
- Recovery branch: `recovery/cloudflare-manifest-2026-11-14`; PR #1 remains open and unmerged.
- The branch contains 197 of 199 production deployment files. The two files not copied into Git are `assets/img/hama/reel-50ml.mp4` and `assets/img/hama/reel-hama.mp4`; the recovered Hama page currently uses the original public Pages URLs as a temporary fallback.
- This is a copy of deployed static artifacts, not the original source repository or its Git history. The old `ghith93/Raawaa-store` repository remains inaccessible through the suspended original GitHub account.
- Keep PR #1 unmerged until the missing media is recovered (or explicitly accepted as external references), asset hashes are checked, and customer/owner workflows are tested.

## Store behavior and pricing consistency
- The public storefront is currently a static WhatsApp inquiry flow; it does not expose an online payment or customer order form. The owner dashboard says direct website intake is not enabled.
- The home/configuration path currently advertises Sham Cash discount 15% and free delivery across all governorates, with product prices in SYP.
- The separate Hama campaign page advertises USD prices and delivery within Hama. These may be distinct campaigns, but the current public copy does not make the distinction sufficiently clear. Resolve the intended commercial policy before publishing changes.
- `js/pricing-policy.js` has a stale comment saying Sham Cash is 10%, while `js/config.js` currently sets 15%. The calculation reads the configuration; update the stale comment when the pricing source of truth is finalized.
- The privacy page describes the public WhatsApp flow as not creating an online order record. The Supabase owner/staging backend exists separately; the owner UI labels direct intake as not enabled, and `rawaa_store.orders` currently has zero rows.

## Supabase read-only security review
- Project `oyoyozdugicmnkfhjovo` is `ACTIVE_HEALTHY` on Postgres 17.11.
- Six Edge Functions are active. The owner-login and Telegram pairing/test functions have JWT verification enabled; the outbox, retention, and commerce API functions have platform JWT verification disabled and need their own endpoint-level authorization review before any public use.
- The relevant `rawaa_store` tables have RLS enabled. Read-only SQL found no policies and no table grants to `anon` or `authenticated` in the inspected `public`, `rawaa_store`, and `commerce` schemas. This is fail-closed for direct client table access; do not add broad policies just to clear the advisor warning.
- Supabase Security Advisor reports leaked-password protection disabled (WARN) and 17 RLS-enabled/no-policy informational findings. Enable leaked-password protection in Auth settings after reviewing the impact on owner sign-in.
- Performance Advisor reports one duplicate-index warning on `rawaa_store.orders` and 10 unused-index notices. No indexes were changed.

## Next safe sequence
1. Recover the two MP4 assets and compare all restored files against the deployment manifest.
2. Complete a mobile functional pass for product selection, pricing, cart, WhatsApp message composition, privacy, and the owner login flow.
3. Resolve the SYP/USD, discount, and delivery-policy differences with one canonical pricing policy before changing live copy.
4. Fix the EU.org parent delegation using the exact Cloudflare nameservers; then re-check Pages custom-domain verification.
5. Keep the existing Pages project on its current Direct Upload path. If repository automation is added, use a controlled Wrangler deployment workflow rather than converting this production project to Git integration.
6. Review the three Edge Functions with `verify_jwt=false` at source level before enabling any public order flow.
