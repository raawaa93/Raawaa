# RAWAA marketing and sales operations snapshot — 2026-11-21

**Status:** Operational workspace prepared; no public content has been published and no advertising spend has been initiated.  
**Store source of truth:** `main` → `js/config.js`, `serum.html`, `js/marketing.js`, and `docs/marketing/LAUNCH-READINESS-2026-11-21.md`.  
**Scope:** Marketing research, campaign planning, content assets, attribution, and connector readiness. This document does not authorize unreviewed product claims or public launch.

## 1. Current catalog and commercial rules

The current store catalog contains three blends, each with 30 ml, 50 ml, and 100 ml variants:

| Blend | 30 ml | 50 ml | 100 ml | Current usage boundary |
|---|---:|---:|---:|---|
| Rosemary & Caffeine | SYP 2,000 | SYP 2,400 | SYP 2,800 | Usage approval required; do not demonstrate or claim scalp/length use until approved in writing |
| Olive Oil & Panthenol | SYP 1,800 | SYP 2,200 | SYP 2,600 | Store instructions: mid-lengths to ends |
| Castor & Selected Oils | SYP 1,800 | SYP 2,200 | SYP 2,600 | Store instructions: ends only, very small amount |

Commercial rules in the current store source:

- 10% discount on eligible order total for Sham Cash payment only.
- Free delivery to all Syrian governorates and for all payment methods.
- Cash on delivery does not receive the Sham Cash discount.
- The Sham Cash wallet field is blank; never invent a wallet number.
- Prices above are catalog prices, not proof of stock, unit economics, batch release, or sale readiness.

## 2. Positioning and claim boundaries

- Store tagline: **«لمعان يُرى، ونعومة تُلمَس»**.
- Keep cosmetic appearance/feel language precise and modest.
- Do not claim hair growth, stopping hair loss, scalp treatment, repair of damage, or heat protection without supporting evidence and appropriate review.
- Do not merge scalp-product positioning with finishing products.
- Current store product imagery is conceptual packaging artwork, not verified photography of physical stock.
- Do not invent customer testimonials, reviews, before/after evidence, INCI declarations, formula percentages, manufacturing credentials, or supplier provenance.

## 3. Campaign workspace and production assets

The campaign and its supporting records are maintained in Notion:

- Campaign: [محتوى إطلاق مزيجات رواء — سوريا](https://app.notion.com/p/41f51680e96981078644cc1d28100723)
- 30-day operating plan: [خطة تشغيل المحتوى — 30 يوماً](https://app.notion.com/p/41f51680e96981298f28f4efcf91f2dd)
- Brand and messaging guide: [دليل العلامة والرسائل — رواء](https://app.notion.com/p/41f51680e9698120a5efd80ba85571ac)
- Content database: [قاعدة المحتوى والنشر](https://app.notion.com/p/260ab56005484a62ac472fa2fcaad08c)
- Product and stock database: [بطاقة المنتج والمخزون](https://app.notion.com/p/0d05ccb49899433fbff8ed38e64433cc)
- Orders and inquiries: [سجل الاستفسارات والطلبات](https://app.notion.com/p/7a3756a92bc74dc3a6e32f28fb04f295)
- Competitor research: [مقارنة المنافسين](https://app.notion.com/p/41f51680e9698128ad26f19ea0abb791)

Repository production scripts: [docs/marketing/VIDEO-SCRIPTS-12.md](VIDEO-SCRIPTS-12.md). The 12 scripts are draft production guidance; they have not been filmed or published.

Canva:
- Final editable 4:5 educational Instagram design, 1080×1350: [Open/edit in Canva](https://www.canva.com/d/gPR5bPBeqFn9xtG).
- Dedicated folder: [RAWAA — محتوى التسويق](https://www.canva.com/folder/FAHbgkxGPr4).
- Existing logo, profile image, and Facebook cover were reused as references. No Canva Brand Kit exists in the connected account.
- The educational design contains no product bottle or treatment claim. Inspect Arabic typography on a phone before publishing.

## 4. Attribution currently available in the storefront

`js/marketing.js` supports `utm_source`, `utm_campaign`, and `utm_content` attribution. It stores a cleaned campaign label in browser session storage and can append source information to the WhatsApp message. It does **not** confirm that a WhatsApp message was sent, an order was accepted, payment was collected, or delivery was completed.

Initial organic links:

- Instagram: `https://raawaa-store.pages.dev/serum?utm_source=instagram&utm_campaign=rawaa-mix-launch-2026-11&utm_content=organic-post-01`
- Facebook: `https://raawaa-store.pages.dev/serum?utm_source=facebook&utm_campaign=rawaa-mix-launch-2026-11&utm_content=organic-post-01`
- WhatsApp profile referral: `https://raawaa-store.pages.dev/serum?utm_source=whatsapp&utm_campaign=rawaa-mix-launch-2026-11&utm_content=profile-link`

No Meta Pixel ID is configured in the current store config. The pixel is optional and consent-gated; do not add or enable one before reviewing the privacy notice and CSP together. No GA4 property is connected. The CSV template at `docs/marketing/order-attribution-template.csv` is for recording order outcomes; do not place customer names, phone numbers, addresses, or other personal data in GitHub.

## 5. Competitor and market research — limitations included

Competitor shortlist and source pages are recorded in the Notion competitor report and OpenSEO project.

- **Soin De Coco / Rain Kissed:** Syrian-facing product page for a 150 ml finishing/shine serum; indexed price seen at USD 16.99 (reference USD 22) and 53 reviews shown on the page. Useful reference for offer structure, reviews, product naming, and guided product selection. These page details should be rechecked before any current-price comparison.
- **DiGiShi:** Syrian multi-brand retailer. Indexed examples include DAJANI 100 ml at SYP 1,076 (indexed as available), JINA 100 ml at SYP 560 (indexed as out of stock), Zera 50 ml at SYP 340 (indexed as out of stock), and Millia 250 ml at SYP 990 (indexed as out of stock). These values are stale/inconsistent and may contain currency/indexing issues; do not use them for pricing decisions.
- **Feel22 Syria:** multi-brand alternatives from Garnier, L'Oréal, Kérastase, Klorane and others. Indexed examples: L'Oréal Elvive Midnight Serum 100 ml SYP 1,310; Garnier Honey Treasures 115 ml SYP 1,410; Kérastase Chroma Absolu 150 ml SYP 6,420; Fino Hair Oil SYP 1,680. Treat as search-index observations, not guaranteed live checkout prices.
- **Urban Care Syria:** useful reference for category architecture by hair need; not proof of a local manufacturer or product sales.
- **Reach Media Syrian Ad Watch (8–14 Nov 2026):** reported 2,731 ads, 1,454 pages, and 292 health/beauty/clinic advertisers in its sample. This is not a full census and does not expose spend, reach, or product-level sales.

No competitor sales, market share, or demand ranking has been established. Normalize currency, variant size, stock status, delivery, and date before using any price comparison. Do not infer demand from ad counts or indexed prices.

OpenSEO project: [Raawaa — Syria Marketing](https://app.openseo.so/p/dfb730ac-5aea-479f-9adf-5002ce8d48da/context). Syria is not supported by its connected keyword-location selector; its default US-market keyword metrics must not be used as Syria evidence. The technical site crawl is location-independent. No GA4 property is connected.

## 6. Connected tools and actual readiness

| Tool | Observed RAWAA status | Operating decision |
|---|---|---|
| Notion | Connected; campaign, content, product, order, and competitor records available | Primary marketing operations workspace |
| Canva | Connected; existing logo/cover/profile assets; new editable post and folder created | Design production; no social publishing connection |
| OpenSEO | Connected; RAWAA project and competitor/key-page context created | Technical crawl and research memory; no Syrian keyword volumes |
| Activepieces | One active GitHub connection; one enabled manual GitHub workflow-control flow | No marketing automation flow; do not treat as a social scheduler |
| Metricool | Brand exists, but no social network connected | Cannot schedule/publish until owner connects accounts |
| Zoho CRM | OAuth scope mismatch on organization read | Reauthorize with the required CRM scopes before use |
| Windsor.ai | One Facebook Ads source appeared under the account owner's name; no proof it belongs to RAWAA and no RAWAA campaign data returned | Do not use for RAWAA performance reporting |
| ChatGPT Ads Manager | Connected ad account belongs to a different hair-oil store | Do not use for RAWAA campaigns |
| vidIQ | No RAWAA YouTube/social channel connected | Research inspiration only; not RAWAA analytics |
| HeyGen / Creatify / Higgsfield / Descript | No RAWAA brand kit/product/project assets verified; Creatify had watermark/credit limitations in prior audit | Avoid spending credits or generating false product evidence |

No posts were published, no messages were sent, no social account was linked, and no ad spend was incurred during this setup.

## 7. Launch gates

Do not schedule or publish product-use demonstrations until all relevant gates are closed:

1. Verify the final physical packaging and label for each SKU.
2. Approve the full INCI/ingredient label, claims, directions, warnings, and use-site for each blend.
3. Obtain written use approval for Rosemary & Caffeine before any demonstration.
4. Record actual inventory, batch, expiry, unit cost, packaging cost, waste, and delivery cost.
5. Capture genuine product photography; retain conceptual artwork disclosures until then.
6. Review the privacy notice and ensure the actual customer/order handling is accurately described.
7. Test the WhatsApp handoff and manual order-confirmation workflow.
8. Connect the actual RAWAA Facebook/Instagram accounts to the chosen publishing tool, if automated publishing is still desired.
9. Reauthorize Zoho only if the CRM is needed; do not create a second CRM in parallel.

Paid advertising remains disabled until organic order delivery and per-SKU contribution margin are measurable. The first hero SKU must be selected from documented usage feedback, delivered orders, and contribution margin — not guesswork.

## 8. Change log for this snapshot

- Created a dedicated Notion campaign workspace and linked its 30-day plan, content records, product records, orders, and competitor research.
- Created one editable educational Canva post, resized it to 1080×1350 (4:5), and filed it in the RAWAA marketing folder.
- Updated the Notion campaign with initial UTM links and attribution limitations.
- Created/updated the OpenSEO project context with the current catalog, claims boundaries, Syrian competitor shortlist, and explicit location-data limitations.
- No storefront source, price, shipping policy, discount, payment configuration, DNS, Cloudflare resource, database, customer data, secret, or production deployment was changed by this marketing setup.
