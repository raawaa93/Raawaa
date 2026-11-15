# Web crawling & scraping tooling research

**Date:** 2026-11-15  
**Scope:** Public web crawling, page extraction, JS/browser automation, structured product/competitor research, monitoring, and free/open-source-first tooling for Raawaa Store.  
**Method:** Multiple discovery passes across GitHub project pages, official project documentation, GitHub topic/repository indexes, and the connected ChatGPT plugin directory. Stars are approximate snapshots from 2026-11-09 to 2026-11-15; they are popularity signals, not quality scores.

## Executive decision

Do not add a paid scraping dependency yet. The connected Firecrawl plugin is installed, but its account currently reports **0 remaining credits** (1,000 plan credits; current billing period ends 2026-11-29). TinyFish is not to be used. Plugin-directory searches for web scraping/crawling/browser automation surfaced Firecrawl and TinyFish as the matching apps; no other dedicated crawler plugin was returned. No new plugin was installed.

Recommended free/open-source stack:
1. **Crawl4AI** as the main self-hosted/local AI-ready crawler (Apache-2.0).
2. **Scrapling** as a complementary resilient fetch/extraction layer (BSD-3-Clause).
3. **Crawlee** (JS/TS or Python) when a production queue, retries, storage, and crawl orchestration are needed (Apache-2.0).
4. **Playwright** for repeatable browser rendering, screenshots, and visual/functional QA (Apache-2.0).
5. **changedetection.io** for scheduled competitor/product/price page change monitoring (Apache-2.0).
6. **Scrapy** for large, structured, high-throughput extraction pipelines (BSD-3-Clause).
7. Keep **Firecrawl** as an optional convenience/hosted fallback only when credits are available; its self-hosted code is AGPL-3.0 and requires infrastructure.

## Ranked shortlist for this project

The ranking below is by practical fit to store research and ongoing QA, not raw GitHub stars.

| Rank | Project | Approx. GitHub stars | License | Best use | Assessment |
|---:|---|---:|---|---|---|
| 1 | [Crawl4AI](https://github.com/unclecode/crawl4ai) | 87k | Apache-2.0 | Multi-page crawl, JS rendering, Markdown/JSON extraction, LLM/RAG | Best default self-hosted AI-ready crawler; local and Docker operation avoid per-page API fees, but require CPU/RAM and maintenance. |
| 2 | [Scrapling](https://github.com/D4Vinci/Scrapling) | 102k | BSD-3-Clause | Adaptive extraction, resilient selectors, HTTP/browser fetch | Strong second engine/fallback; useful when site markup changes. Validate compatibility and avoid treating anti-bot features as permission to bypass access controls. |
| 3 | [Crawlee JS/TS](https://github.com/apify/crawlee) | 26k | Apache-2.0 | Production crawler queues, retries, storage, browser + HTTP | Best fit for a maintainable Node/TypeScript service if the project later needs scheduled structured datasets. |
| 4 | [Scrapy](https://github.com/scrapy/scrapy) | 65k | BSD-3-Clause | Large structured crawls, pipelines, throttling, data export | Mature and efficient; best for predictable HTML/API extraction rather than highly dynamic browser-only sites. |
| 5 | [Playwright](https://github.com/microsoft/playwright) | 100k | Apache-2.0 | Real Chromium/Firefox/WebKit rendering, screenshots, tests | Essential browser foundation and QA engine; not a full crawl/data pipeline by itself. |
| 6 | [changedetection.io](https://github.com/dgtlmoon/changedetection.io) | 35.8k | Apache-2.0 | Scheduled price/product/content change alerts | High value for competitor monitoring; complements crawlers rather than replacing them. |
| 7 | [Firecrawl](https://github.com/firecrawl/firecrawl) | 201k | AGPL-3.0 | URL mapping, crawl-to-Markdown, structured extraction, API/MCP | Excellent all-in-one experience and already connected, but connected account reports zero credits. Self-hosting is possible but AGPL and infrastructure costs matter. |
| 8 | [Crawlee Python](https://github.com/apify/crawlee-python) | 9.7k | Apache-2.0 | Python crawler with Playwright/HTTP, storage and retries | Good Python-native orchestration option; choose it instead of duplicating Crawl4AI if a Python pipeline is the main need. |
| 9 | [ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai) | 32.7k | MIT | Natural-language/LLM extraction into schemas | Useful for irregular pages and extraction prompts, but model/API calls may create variable costs; not the default for repetitive bulk crawling. |
| 10 | [Stagehand](https://github.com/browserbase/stagehand) | 26k | MIT | AI-guided browser actions and structured extraction | Good for interaction-heavy sites; local browser use is free, but model calls can cost money and Browserbase hosting is separate/paid. |
| 11 | [Browser Use](https://github.com/browser-use/browser-use) | 121k | MIT | Autonomous browser agent and multi-step navigation | Very popular and useful for tasks requiring judgment and interaction; not the most deterministic or cheapest bulk crawler. |
| 12 | [Colly](https://github.com/gocolly/colly) | 25.6k | Apache-2.0 | Fast concurrent Go HTTP crawler | Excellent lightweight high-throughput option for mostly static pages; less suited to JS-heavy pages without a browser layer. |
| 13 | [Katana](https://github.com/projectdiscovery/katana) | 17.8k | MIT | URL discovery, crawling, headless mode, technical recon | Strong discovery crawler; security/recon orientation makes it secondary for commercial product intelligence. |
| 14 | [Maxun](https://github.com/getmaxun/maxun) | 18.2k | AGPL-3.0 | No-code visual extraction, API, monitoring, MCP | Useful if non-developers need reusable robots; self-hosting is possible, but AGPL and runtime footprint should be considered. |
| 15 | [Puppeteer](https://github.com/puppeteer/puppeteer) | 95.8k | Apache-2.0 | Chrome/Chromium automation and page extraction | Mature browser control; Playwright is the better default for cross-browser QA. |
| 16 | [Selenium](https://github.com/SeleniumHQ/selenium) | 34.6k | Apache-2.0 | Browser automation and Grid | Mature ecosystem, but heavier than Playwright for this project's current needs. |
| 17 | [Obscura](https://github.com/h4ckf0r0day/obscura) | ~35k | Apache-2.0 | Lightweight headless browser/CDP for agents | Interesting emerging alternative; keep experimental until compatibility and stability are independently tested on store/competitor pages. |
| 18 | [Lightpanda](https://github.com/lightpanda-io/browser) | 41.7k | AGPL-3.0 | Lightweight headless browser for automation | Promising speed/memory claims, but Web API and Playwright compatibility are still partial/WIP; not production default yet. |
| 19 | [HTTrack](https://github.com/xroche/httrack) | 4.8k | GPL-3.0 | Offline mirroring/archiving of sites | Useful for authorized site snapshots, not structured product extraction or JS-heavy competitor research. |

### Adjacent tools, not direct replacements

- **MarkItDown**: document-to-Markdown conversion; it does not discover/crawl websites. Useful after downloading documents.
- **Trafilatura**: article/main-text extraction from HTML; useful as a parsing stage, not a full crawler.
- **MediaCrawler**: social-platform-specific collector focused on Chinese platforms; not a general-purpose storefront/competitor crawler.
- **Automa / browser extensions**: useful for small personal browser workflows, not a reliable unattended multi-site data pipeline.

## Plugin directory audit

Searches covered: web scraping, website crawler, browser automation, Firecrawl alternatives, Apify, Browserless, and Crawl4AI.
- Firecrawl: already installed/connected.
- TinyFish: surfaced by the directory but explicitly excluded by the project owner; do not use or recommend.
- No other dedicated crawler plugin appeared in the matching results. This is the result of the connected directory searches, not proof that no third-party integration exists anywhere.
- Do not install a paid cloud dependency simply to duplicate free local tools.

## Current Firecrawl quota

Connected Firecrawl usage endpoint returned:
- Plan credits: 1,000
- Remaining credits: 0
- Billing period: 2026-10-29 through 2026-11-29
- Historical endpoint usage includes search, scrape, interact, map, and monitor. The usage endpoint cannot attribute the total to an individual project or URL.
This makes local/self-hosted alternatives the preferred route until the balance resets or a free quota is confirmed.

## How to apply this to Raawaa

Use a staged pipeline, not 5 overlapping crawlers on every run:

1. **Discovery:** sitemap/URL map using Crawl4AI or Katana.
2. **Primary extraction:** Crawl4AI for clean Markdown/links/structured output.
3. **Fallback extraction:** Scrapling for pages where the primary parser fails or selectors shift.
4. **Dynamic pages:** Playwright only for pages requiring JavaScript, interaction, or screenshots.
5. **Structured recurring jobs:** Crawlee when the pipeline needs durable queues, retries, scheduling, and persisted datasets.
6. **Change monitoring:** changedetection.io for competitor product/price/stock/policy pages.
7. **Large scale:** Scrapy only when volume and structured pipeline requirements justify it.
8. **AI interpretation:** use a local model or existing permitted model budget after extraction; do not send every page through an LLM.

For competitor research, capture: canonical URL, product title, variant/size, price and currency, availability, ingredient claims, product positioning, offer, shipping claim, capture time, and source excerpt. Store raw HTML/Markdown snapshots and extraction version so changes can be audited.

## Domain investigation: rawaa.eu.org

Cloudflare account read-only audit on 2026-11-15 found:
- Exactly one Pages project in this connected account: `raawaa-store`, currently using `raawaa-store.pages.dev`.
- Exactly one Cloudflare zone in this account: `rawaa.eu.org`; zone status is `pending`, with activation failure reason `unresolvable`.
- The zone has one DNS record: proxied CNAME `rawaa.eu.org -> raawaa-store.pages.dev`, comment `Raawaa Store Pages custom domain`, created 2026-11-14.
- The Pages project lists `rawaa.eu.org` as a custom domain created 2026-11-14, but status is `pending` and Pages reports `CNAME record not set`.
- Cloudflare assigned nameservers `carl.ns.cloudflare.com` and `irma.ns.cloudflare.com`; the zone is not active. The record exists inside Cloudflare but is not being validated as present in public authoritative DNS while zone activation remains unresolved.
- The Firecrawl URL map for the live store returned only `raawaa-store.pages.dev` routes; the repository's GitHub code search returned no results for `rawaa.eu.org` and `raawaa-store.pages.dev`, but the repository is not code-search indexed, so that is not a complete code-reference scan.
- Direct fetch of `https://rawaa.eu.org` failed. This is consistent with a non-resolving/pending domain but does not establish its registrant or intended owner.
- Therefore the available Cloudflare evidence strongly shows the domain was configured for Raawaa Store, not proven to be another project's domain. It does not prove who owns the .eu.org registration or whether the owner still wants it.
- No DNS record, Pages custom-domain binding, Cloudflare zone, nameserver, certificate, or registrar setting was deleted. Removing the Pages binding and DNS record would be reversible only if the zone and external delegation are retained; deleting the entire zone could affect other records/services not visible in this account.
- Recommended decision: keep the pending association for now, because it is explicitly pointed at Raawaa Store. If the owner confirms the domain is not theirs or should never be used for this store, remove the Pages custom-domain binding and its CNAME only; do not delete the zone until the .eu.org registration and any external DNS dependencies are verified.

## Safety and compliance

- Respect each site's terms, robots.txt, rate limits, access controls, and applicable privacy law.
- Do not use browser stealth, proxy rotation, or CAPTCHA handling to bypass login walls, paywalls, access restrictions, or anti-bot controls.
- Prefer public product/catalogue pages, sitemaps, official APIs, and low-rate requests. Never collect personal data when it is not necessary.
- Keep request logs, source URLs, timestamps, and a stop/allowlist policy.

## Source register

- [GitHub crawler project ranking, Nov 14, 2026](https://github.locker/topics/crawler)
- [GitHub web-scraping repository index](https://specstream.ai/data/repositories/web-scraping)
- [2026 open-source scraping project survey](https://www.joinmassive.com/blog/open-source-web-scraping-tools)
- [Crawl4AI official repository and docs](https://github.com/unclecode/crawl4ai)
- [Scrapling official repository](https://github.com/D4Vinci/Scrapling)
- [Crawlee official repository](https://github.com/apify/crawlee)
- [Crawlee Python repository](https://github.com/apify/crawlee-python)
- [Scrapy official repository](https://github.com/scrapy/scrapy)
- [Playwright official repository](https://github.com/microsoft/playwright)
- [Firecrawl official repository/license](https://github.com/firecrawl/firecrawl)
- [changedetection.io project status and license](https://opensaurus.org/project/changedetection-io/)
- [ScrapeGraphAI repository](https://github.com/ScrapeGraphAI/Scrapegraph-ai)
- [Stagehand official site and license](https://www.browserbase.com/stagehand)
- [Browser Use repository](https://github.com/browser-use/browser-use)
- [Colly official repository](https://github.com/gocolly/colly)
- [Katana official repository](https://github.com/projectdiscovery/katana)
- [Maxun official repository](https://github.com/getmaxun/maxun)
- [Obscura official repository](https://github.com/h4ckf0r0day/obscura)
- [Lightpanda official repository](https://github.com/lightpanda-io/browser)
- [Selenium official repository](https://github.com/SeleniumHQ/selenium)
- [HTTrack official website](https://www.httrack.com/)
