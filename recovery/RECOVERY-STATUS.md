# RAWAA Store — current recovery status

Last updated: 2026-11-15

## Source restoration — complete

- The recovered Store source is now merged into the repository's default `main` branch.
- PR #2 (integrated PR #188 checkpoint) and PR #1 (full source recovery) are both merged.
- Main commit after the recovery merge: `a0afb90483333a52260a6cf3687bef5bda880fbf`.
- Latest documentation commit: `030c35e909e672de104a6f58195f7dc3f57a2cac`.
- Root website tree: 199 files. Compared with the 199-file production manifest, only the two nonessential Hama MP4 files are absent; the two extra root paths are this README and `css/rawaa-design-system.css`.
- All storefront pages, owner-facing static pages, images, fonts, icons, scripts, stylesheets, metadata, captions and PWA assets are present.
- The partial PR #188 cart was excluded. The complete 88,132-character cart recovered from PR #205 is in the root site.
- Historical preview snapshots remain isolated under `recovery/snapshots/`.

## Automated verification — passed

- GitHub Actions on the integrated recovery commit passed the site regression test and JavaScript syntax checks.
- The regression test validates the approved 10% Sham Cash-only discount, free delivery, oils/fragrance and customization disclosures, conceptual-image disclosure, absence of unapproved Offer/AggregateOffer pricing schema, complete cart, bottle-first Serum view, and local resource references across root HTML/CSS files.
- Latest GitHub Actions run on the documentation-updated main commit `030c35e909e672de104a6f58195f7dc3f57a2cac` succeeded.

## Store policy encoded in recovered source

- 10% discount on eligible Sham Cash payments only.
- Free delivery to every Syrian governorate for every payment method.
- Current blends contain oils and fragrance.
- Customization is a preliminary request; availability and price are confirmed before acceptance.
- Product packaging imagery is identified as conceptual, not actual inventory photography.
- No unapproved Offer/AggregateOffer pricing schema is emitted on the Serum page.

## Production and deployment — intentionally unchanged

- Cloudflare Pages project: `raawaa-store`.
- Production URL: https://raawaa-store.pages.dev
- Last inspected production deployment: `10b28454-da98-4bb7-9172-ee947a93a9e3`, dated 2026-11-08, 199 deployed files.
- Cloudflare Pages is configured for Direct Upload. GitHub merge to `main` does not deploy the website.
- No production deployment, DNS change, Supabase write, migration, secret change, or customer-facing change was made during source restoration.
- **Owner decision updated 2026-11-14: 10% is the sole canonical Sham Cash discount.** The 15% banner observed on the older 2026-11-08 production deployment is superseded historical state, not an active offer. Do not copy it into any new release. The recovered `main` source already encodes 10%; the live production URL still needs a controlled 10% release after preview validation.

## Domain status — separate issue

- `rawaa.eu.org` remains pending in Cloudflare. The recorded zone activation error is `unresolvable`; the CNAME alone cannot activate the zone.
- Cloudflare-assigned nameservers are `carl.ns.cloudflare.com` and `irma.ns.cloudflare.com`.
- No DNS or nameserver changes were made.

## Backend boundary

- The inspected Pages deployments report `uses_functions: false`; the public Store is a static Pages deployment.
- Supabase owner/order/Telegram functions and staging-named services are separate from the static storefront. Their presence does not prove that public checkout uses them.
- No Supabase function source was deployed or changed during this recovery.

## Remaining work before any release

1. Complete a mobile Safari/iPhone functional pass on an isolated preview: product selection, pricing, cart, WhatsApp message composition, privacy, and owner login.
2. Verify the isolated preview displays 10% Sham Cash discount consistently on every page and in all checkout calculations. The owner has already confirmed 10%; do not ask to reconfirm.
3. Verify restored text/binary assets against Cloudflare deployment hashes where practical.
4. Resolve the `rawaa.eu.org` parent delegation only after confirming it is the intended customer-facing domain.
5. Prepare an isolated Cloudflare Direct Upload preview using Wrangler; only promote to production after the preview is approved.

## Provenance and limitations

This repository is a reconstruction from Cloudflare Pages production and successful preview artifacts, not a clone of the original Git repository. It does not restore the original commit history, unpublished source files, or secrets. The original GitHub repository remains inaccessible through the connected old account.
 
## Operational re-audit — 2026-11-15

- Latest canonical main commit after PR #24 and the two documentation follow-ups: `fc89295b82556cc9946dc52f59b39fc23d1fdad6`.
- Latest production deployment: `4222fbbf-5d51-423d-a309-a2cec96b2f78` (success; `commit_dirty=true`).
- Latest isolated preview: `652d59e8-a3b0-42dd-bd44-10a59d4c3d08` (success; `commit_dirty=false`).
- Production/preview deployment source commit is identical, but the dirty production provenance warning remains. Do not treat the production deployment as clean-source verified.
- The current source had a real CI/CD contradiction: the production workflow deployed on every push to `main`, and a second workflow deployed from `production-deploy/**` branch pushes. PR #24 is now merged: main pushes validate only and production deployment requires manual dispatch from main with explicit confirmation.
- Cloudflare custom domain list still contains only `raawaa-store.pages.dev` plus pending `rawaa.eu.org`; no DNS changes were made. The intended `rawaa.sy` purchase remains pending with the seller.
- Supabase read-only advisors: leaked-password protection disabled (WARN); 17 RLS-without-policy INFO notices on Ghaiooth-core; 10 unused indexes (INFO), one duplicate-index warning on `rawaa_store.orders`. No DB changes were made.
- The backup workflow now runs on every push to main as well as daily and manually. A completed artifact, checksum verification and restore drill still require read-back evidence; backup completion remains unverified.
- R2 remains deferred pending payment-card readiness. No billing, DNS, schema, Edge Function or production data changes were made.
- Release gates remain: formula/INCI and supplier evidence, actual product photos, privacy-policy review, source-level review of order-related Edge Functions, and a tested order lifecycle before direct order intake.


### Backup trigger improvement (merged PR #24)

- The backup workflow now runs on every push to canonical `main`, in addition to its daily schedule and manual trigger. The PR #24 merge commit should start a backup run and produce a 90-day GitHub Actions artifact without requiring Cloudflare R2 or a paid service.
- Artifact creation, SHA-256 verification and an isolated restore drill still require read-back evidence; the trigger change alone is not proof that a backup completed.
