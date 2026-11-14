# RAWAA — Canonical decisions and source-of-truth

Last updated: 2026-11-14

## Active customer-facing policy

- Sham Cash: 10% discount on eligible orders paid with Sham Cash only.
- Cash on delivery: no Sham Cash discount.
- Delivery: free to all Syrian governorates for all payment methods.
- The former 15% promotion observed on the older production deployment is superseded. It is historical evidence only and must not be reused.

## Product range

- Rosemary + Caffeine.
- Olive Oil + Panthenol.
- Castor Blend with selected oils.
- Sizes: 30 ml, 50 ml, and 100 ml.
- Current blends contain oils and fragrance. Customization is a request only; availability and price must be confirmed before acceptance.
- Packaging/product mockups must be disclosed as conceptual. Do not imply they are verified photographs of actual inventory.

## Pricing and implementation ownership

- Product prices are read from `js/config.js`.
- Discount and delivery calculations are centralized in `js/pricing-policy.js`.
- Do not introduce duplicate price/discount/delivery formulas in campaign, cart, product, or owner UI scripts.
- Preserve existing product price values unless a separately recorded owner decision changes them.
- Do not publish internal manufacturing, supplier, exchange-rate, or margin assumptions in this public storefront repository.

## Operational boundaries

- Orders are prepared through WhatsApp. Do not claim online card payment, automated inventory, or fully automated order management unless those capabilities are separately implemented and verified.
- Preserve owner pages and backend integrations. A static owner page does not prove its backend is connected.
- Cloudflare Pages uses Direct Upload. GitHub merges do not publish the site.
- Preview and verify before production deployment. Never change DNS, Supabase data/schema, or secrets as part of a static-site release.

## Repository hygiene

- `main` is the sole canonical source.
- `backup/*` are immutable rollback points.
- `recovery/snapshots/*` and old PR artifacts are read-only historical evidence, not deployable sources.
- Do not bulk-delete branches, snapshots, assets, or old files. Retire only individually verified obsolete items after dependency and provenance checks.
