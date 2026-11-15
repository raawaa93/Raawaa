# RAWAA Store

Recovered, editable source for the RAWAA Store static website.

## Current state

- The full recoverable Store source is now on `main`.
- Source was reconstructed from the 2026-11-08 Cloudflare Pages production copy and successful development previews. This is not a clone of the original Git history.
- The restored root tree contains 199 files: all 199 paths from the production manifest except the two nonessential Hama MP4 videos, plus this README and the recovered RAWAA design-system stylesheet. The two MP4s are intentionally not required for this recovery.
- PR #188's approved 10% Sham Cash-only policy and latest page/content checkpoint are integrated with the complete cart recovered from PR #205.
- PR #188's partial cart was not used.
- Automated checks pass for all root HTML/CSS local asset references, store policies, product disclosures, structured data, complete cart presence, and JavaScript syntax.

## Canonical store policy (owner-confirmed 2026-11-14)

This is the only active commercial policy for the recovered source. Historical snapshots are evidence only and must never be copied into production.

- Sham Cash discount: **10% only** on eligible orders paid with Sham Cash.
- Delivery: **free across all Syrian governorates for every payment method**.
- Cash on delivery receives no Sham Cash discount.
- Keep all prices and policy values centralized in `js/config.js`; calculations belong in `js/pricing-policy.js`. Do not duplicate discount or delivery calculations in page scripts.

## Store policy currently encoded

- 10% discount on eligible orders paid with Sham Cash only.
- Free delivery to all Syrian governorates for every payment method.
- Current blends contain oils and fragrance.
- Customization is a preliminary request; availability and price are confirmed before acceptance.
- Product packaging visuals are conceptual illustrations, not actual inventory photographs.
- No unapproved Offer/AggregateOffer pricing schema is published.

## Pages and assets

- Storefront: `index.html`, `serum.html`, `campaign.html`, `privacy.html`, `404.html`. Retired Hama/setup/diagnostic pages remain only in `recovery/`.
- Owner-facing pages: `owner/index.html`, `owner/pricing.html`.
- Front-end code: `js/`, `css/`, `owner/`.
- Static assets: `assets/` (product and campaign images, brand assets, icons, fonts and captions).
- Service worker and metadata: `sw.js`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`.
- Historical preview snapshots and recovery evidence: `recovery/` (archive only; never a deployment source).

## Development checks

Use Node.js 22 or newer. No package installation is required for the current static checks.

```bash
node scripts/check-site.mjs
find . -type f \( -name '*.js' -o -name '*.mjs' \) -not -path './recovery/*' -print0 | while IFS= read -r -d '' file; do node --check "$file"; done
```

GitHub Actions runs these checks on pushes and pull requests. Make future edits on a feature branch and open a pull request into `main`; do not edit recovery snapshots in place.

## Cloudflare deployment boundary

- Cloudflare Pages project: `raawaa-store`.
- Production URL: https://raawaa-store.pages.dev
- The existing Pages project uses **Direct Upload**, not Git integration.
- Every production-affecting source/configuration change pushed to `main` runs the production validation pipeline; after all browser, policy, integrity, and clean-build checks pass, the same validated commit is deployed automatically to Cloudflare Pages production. Documentation, recovery archives, test-only files, and validation-script-only changes are intentionally excluded from production releases.
- Failed validation blocks deployment. The release job refuses stale or dirty source and targets only the production Pages branch.
- Pull requests and non-main branches do not deploy to production. Preview deployments remain isolated from production.
- A merge to `main` authorizes automatic production release once all required validation succeeds.

## Recovery references

- [Detailed recovery and preview reconciliation](recovery/PR-RECOVERY-2026-11-14.md)
- [Snapshot index and completeness notes](recovery/snapshots/README.md)
- [Current recovery status](recovery/RECOVERY-STATUS.md)

## Source-of-truth and cleanup rules

- `main` is the sole canonical website source. All new work starts from `main` on a named feature branch and returns through a reviewed pull request.
- `backup/*` branches are immutable rollback checkpoints. Never deploy from them.
- `recovery/snapshots/` and old PR snapshots are read-only historical evidence. They may contain superseded content (including old promotion text); that content is not active policy and must not be copied into the live site.
- Do not bulk-delete historical files, branches, or recovery evidence. Retire a specific item only after its replacement is verified and a separate inventory proves it is unused.
- Cloudflare Pages is Direct Upload. A GitHub merge is not a deployment. Test an isolated preview and verify its full asset set before any production promotion.

## Current release status

See `recovery/RELEASE-READINESS-2026-11-14.md` for the release gates and backend audit. The latest operational audit is appended there with the current production/preview deployment IDs and the manual-release workflow change.
