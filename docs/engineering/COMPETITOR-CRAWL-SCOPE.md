# RAWAA competitor crawl — scope and operating rules

## Purpose
Track a small, previously researched set of public hair-oil, finishing-serum, scalp-serum, and Syria retail pages. The output is a research snapshot for product positioning, price/size architecture, offer framing, usage guidance, and category changes. It is not a checkout integration and does not interact with customer accounts.

## Approved seed URLs
The exact URLs and their market/category labels are maintained in \`competitor-targets.json\`. They include OUAI, Gisou, OLAPLEX, Moroccanoil, Kérastase, The Ordinary (adjacent scalp-serum benchmark), and Feel22 Syria (local retailer category).

## Collection boundaries
- Crawl only the exact seed URLs. Do not spider arbitrary links or expand into whole domains.
- Check each site's public \`robots.txt\` first; skip if crawling is disallowed or robots cannot be checked. A 404/410 robots response is treated as no published rules.
- One page per brand per run, sequentially, with a 3-second gap. No parallel burst.
- Public pages only. No login, account creation, cookies, checkout, cart, forms, private APIs, proxy, stealth mode, CAPTCHA solving, or access-control bypass.
- No LLM/API key is used. Crawl4AI extracts public HTML/Markdown and schema.org Product/Offer JSON-LD only.
- Each run uploads a 30-day artifact. The repository is public, so outputs must contain only public competitor page content and no user/customer/store secrets.
- Prices and stock are snapshots, not authoritative guarantees; store currency, capture time, source URL, and market with every record.

## Runtime and cost
Crawl4AI is pinned to v0.9.5 (Apache-2.0). It runs in a fresh GitHub-hosted Ubuntu runner; the Raawaa repository is public, and GitHub documents standard hosted-runner usage on public repositories as free and unlimited. No persistent server, database, paid proxy, Firecrawl credit, or model API is required. If the repository becomes private, re-check Actions billing before keeping the schedule.

## Schedule
Weekly on Monday at 05:17 UTC, with manual \`workflow_dispatch\`. Pull requests run unit tests only and do not crawl third-party sites. A push to main that changes the crawler or approved target list triggers the first snapshot.
