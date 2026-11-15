# RAWAA competitor snapshot — 2026-11-15

## Collection status

- Crawl4AI 0.9.5, no LLM/API key, no paid crawler service.
- 10 exact public targets; **9 returned HTTP 200**. The Kérastase UK official page returned HTTP 307 with a Cloudflare JavaScript challenge. It was not bypassed.
- Markdown snapshots and structured JSON are available in [GitHub Actions run #43684667793](https://github.com/raawaa93/Raawaa/actions/runs/43684667793). Artifact retention: 30 days.
- The earlier 7-target run is retained in [run #43684278016](https://github.com/raawaa93/Raawaa/actions/runs/43684278016).
- Next automated run: Monday 05:17 UTC; manual trigger is also available in GitHub Actions.
- This snapshot is a dated market reference, not a live price feed. Prices can change by variant, region, tax, stock, and promotion.

## UK/EU direct-brand benchmark

| Brand / product | Public price and size | Positioning / visible message | Source |
|---|---:|---|---|
| OUAI Hair Oil | 13ml £16; 45ml £28 | Lengths/ends, frizz and split-end smoothing, high-gloss finish, heat protection | [OUAI UK product](https://theouai.co.uk/products/hair-oil) |
| OUAI Scalp Serum | £50; page did not expose a clear size in the captured product details | Scalp hydration/balance, fuller-looking hair, daily leave-in; skincare-inspired language | [OUAI UK product](https://theouai.co.uk/products/scalp-serum) |
| Gisou Honey Infused Hair Oil | 20ml €24; 50ml €40 | Honey origin story, scent, shine, hydration, frizz control, heat protection; 4.8 rating shown | [Gisou product](https://gisou.com/products/honey-infused-hair-oil?_mkt=EUR) |
| OLAPLEX Nº.7 Bonding Oil | 30ml £30; 60ml £54 | Lightweight styling oil, bond-building technology, shine, frizz control, 232°C heat protection | [30ml](https://uk.olaplex.com/products/olaplex-n-7-bonding-oil-30ml) · [60ml](https://uk.olaplex.com/products/olaplex-n-7-bonding-oil-60ml) |
| Moroccanoil Treatment Original | 25ml £14.50; 50ml £27.50; 100ml £38.50 | Argan-oil story, multi-use treatment, detangling, conditioning, shine and frizz smoothing | [Moroccanoil UK](https://uk.moroccanoil.com/products/moroccanoil-treatment-original) |
| Kérastase Elixir Ultime | 30ml £29; 75ml £58.50; 75ml refill £44 | Luxury, refillable pack, shine/softness, anti-frizz, heat protection; 4.7 rating and 1,284 reviews shown | [Kérastase UK](https://www.kerastase.co.uk/ranges/regimen/elixir-ultime/elixir-ultime-l%E2%80%99huile-originale-refillable-hair-oil-for-all-hair-types/KER_00303.html) |
| The Ordinary Multi-Peptide Serum for Hair Density | 60ml £21.90 | Scalp-focused water-based leave-in; caffeine and peptide complex; daily bedtime use | [The Ordinary UK](https://theordinary.com/en-gb/multi-peptide-serum-for-hair-density-hair-scalp-treatment-100434.html) |

## Syria retail snapshot — Feel22

The filtered hair-oil/serum category returned 10 visible product cards:

| Product | Displayed price |
|---|---:|
| Seapuri Scalpy Hair Serum | SYP 2,460 |
| Garnier Ultra Doux Rice Water Hair Silk Smoothing Serum | SYP 1,410 |
| L'Oréal Paris Elvive Extraordinary Oil Midnight Serum 100ml | SYP 1,310 |
| Kérastase Blond Absolu Cicaplasme Serum 150ml | SYP 6,420 |
| Garnier Ultra Doux Hair Honey Treasures Repairing Serum 115ml | SYP 1,410 |
| L'Oréal Professionnel Advanced Repair Molecular Rinse-Off Serum | SYP 5,810 |
| Kérastase Nutritive 8h Magic Night Serum 90ml | SYP 12,980 |
| Kérastase Chroma Absolu Anti-frizz Thermic Leave-in Serum 150ml | SYP 6,420 |
| L'Oréal Paris Elvive Fall Resist Aminexil Serum 102ml | SYP 1,580 |
| L'Oréal Paris Elvive Dream Long Straight Frizz Killer Serum | SYP 1,250 |

Sources: [Feel22 filtered category](https://syria.feel22.com/en/collections/face-serums?product_type=hair-oil-and-serum) · [Seapuri product page](https://syria.feel22.com/en/products/seapuri-scalpy-hair-serum).

**Currency handling note:** The Feel22 product page's visible content shows SYP 2,460, while its Open Graph metadata reports USD 16.40. The visible regional page price is retained above; the metadata mismatch is recorded as a crawler data-quality warning, not treated as a second price.

## Data-quality notes from the crawl

- Open Graph price commonly represents the selected/default variant, not the full-size hero variant: OUAI Hair Oil metadata showed £16 (13ml) while the page lists 45ml at £28; Gisou metadata showed €24 (20ml) while the product offer lists 50ml at €40; Moroccanoil metadata showed £14.50 (25ml) while the 100ml option is £38.50.
- OUAI Scalp Serum metadata showed GBP £50 while its JSON-LD offer currency was USD. Use the rendered UK page and its market context when comparing.
- The Ordinary page's generic Open Graph metadata did not contain its product price, but its Product schema and rendered page both show £21.90 for 60ml.
- The Feel22 category page is more reliable for local visible SYP prices than the individual product page's Open Graph metadata.
- Kérastase's official UK page can be read through ordinary web research, but the GitHub-hosted crawler receives a Cloudflare JS challenge. No stealth, proxy, or challenge bypass is used.

## Competitive patterns and implications for RAWAA

1. **Separate the job-to-be-done.** The market splits into hair-length/ends oils (shine, frizz, heat protection, split ends) and scalp treatments (density, thinning, hydration, scalp balance). RAWAA's product page should state clearly which job its serum performs before borrowing either category's claims.
2. **Make usage frictionless.** Competitors explain when to apply, where to apply, how often, whether to rinse, and whether the product is used on wet or dry hair. RAWAA should make those instructions visible near the purchase decision.
3. **Give the formula a memorable story.** Competitors connect one hero ingredient or technology to one clear benefit: honey, argan oil, bond-building, peptides/caffeine, or camellia oils. RAWAA should build its own story from its actual formula and approved product information, not copy competitor ingredients or claims.
4. **Use a deliberate value ladder.** Competitors use travel/full-size/large-size/refill variants and bundles. Consider an entry size or bundle only if RAWAA's manufacturing, packaging, and unit economics support it.
5. **Show the value, not only the discount.** Premium competitors sell a combined outcome: sensory experience, clear routine, visible benefits, and distinctive packaging. A discount alone is not a durable position.

## Method and limits

- Exact allowlisted URLs only; one page at a time; 3-second gap.
- Public robots.txt checked before each crawl. Disallowed or unreachable sites are skipped.
- No login, cookies, cart, checkout, private APIs, proxy, stealth, CAPTCHA solving, or LLM calls.
- Structured product data and metadata are combined with Markdown snapshots; metadata is not assumed to be the canonical size/price.
- Prices are displayed in their page currency. No currency conversion, tax normalization, or stock inference is applied.
