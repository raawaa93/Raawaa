# Production mobile smoke test — 2026-11-14

## Scope
Read-only functional browser checks against the currently deployed Cloudflare Pages production site:
- https://raawaa-store.pages.dev/
- https://raawaa-store.pages.dev/serum

This is a test of the live deployment, not the recovered GitHub `main` branch. No checkout, WhatsApp message, order submission, owner login, or production change was performed.

## Results
- Homepage and product page loaded.
- Navigation to the product page and product query routes worked.
- Product selectors changed the displayed product details and price.
- Mobile layout showed no horizontal overflow, broken images, or clipped text in the browser smoke test.
- Cart add/open/close interaction succeeded.
- Added item: زيت الزيتون والبانثينول، 50 مل، quantity 1.
- Unit price and line total: 2,200 ل.س.
- Live cart showed Hama delivery, free delivery, Sham Cash payment, 15% discount (330 ل.س), and final total 1,870 ل.س.
- No order was submitted and no WhatsApp message was sent.

## Release-critical discrepancy
The live production site currently calculates a 15% Sham Cash discount. The recovered source on `main` encodes 10%. This is a real production/source difference. Do not deploy the recovered source until the canonical discount policy is reconciled and explicitly approved.

## Backup and development refs
- Immutable-by-convention source checkpoint: `backup/site-2026-11-14-restored-main`
- Isolated work branch: `work/mobile-ux-audit-2026-11-14`
- Checkpoint commit: `306865da8e168cf5847a68ea8bdb3fa448df8a9a`

The backup branch is a complete Git snapshot of the restored site at that commit. Existing PR snapshots under this directory remain preserved separately.
