#!/usr/bin/env python3
"""Polite, no-LLM competitor-page snapshots for RAWAA.

Only the exact public URLs in docs/engineering/competitor-targets.json are fetched.
Robots rules are checked before every crawl. No login, cookies, proxy, stealth,
CAPTCHA solving, or paid API is used.
"""
from __future__ import annotations
import asyncio, json, os, re, sys
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser

ROOT = Path(__file__).resolve().parents[1]
TARGETS_PATH = ROOT / "docs/engineering/competitor-targets.json"
OUTPUT_DIR = Path(os.environ.get("RAWAA_CRAWL_OUTPUT", ROOT / "artifacts/competitor-crawl"))
USER_AGENT = "RAWAAResearchBot"
MAX_MARKDOWN_CHARS = 40_000
PAGE_TIMEOUT_MS = 45_000
REQUEST_GAP_SECONDS = 3.0

class JSONLDParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks, self._capture, self._chunks = [], False, []
    def handle_starttag(self, tag, attrs):
        if tag.lower() == "script":
            values = dict(attrs)
            if (values.get("type") or "").split(";")[0].strip().lower() == "application/ld+json":
                self._capture, self._chunks = True, []
    def handle_data(self, data):
        if self._capture: self._chunks.append(data)
    def handle_endtag(self, tag):
        if tag.lower() == "script" and self._capture:
            self.blocks.append("".join(self._chunks))
            self._capture, self._chunks = False, []

def parse_jsonld_blocks(html):
    parser = JSONLDParser()
    parser.feed(html or "")
    parsed = []
    for block in parser.blocks:
        try: parsed.append(json.loads(block))
        except (json.JSONDecodeError, TypeError): continue
    return parsed

def _walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values(): yield from _walk(child)
    elif isinstance(value, list):
        for child in value: yield from _walk(child)

def _as_list(value):
    if value is None: return []
    return value if isinstance(value, list) else [value]

def _brand_name(value):
    if isinstance(value, str): return value
    if isinstance(value, dict): return value.get("name")
    return None

def _offer_summary(value):
    summaries = []
    for offer in _as_list(value):
        if isinstance(offer, dict):
            summaries.append({k: offer.get(src) for k, src in [
                ("price","price"),("price_currency","priceCurrency"),("availability","availability"),
                ("url","url"),("low_price","lowPrice"),("high_price","highPrice"),("offer_count","offerCount")
            ]})
    return summaries

def extract_products_from_jsonld(documents):
    products, seen = [], set()
    for document in documents:
        for node in _walk(document):
            if not isinstance(node, dict): continue
            types = {str(item).lower() for item in _as_list(node.get("@type"))}
            if not ({"product", "productgroup"} & types): continue
            name, url = node.get("name"), node.get("url")
            key = (str(name or ""), str(url or ""))
            if key in seen: continue
            seen.add(key)
            rating = node.get("aggregateRating") or {}
            products.append({
                "name": name, "brand": _brand_name(node.get("brand")),
                "description": node.get("description"), "sku": node.get("sku"),
                "url": url, "image": node.get("image"),
                "offers": _offer_summary(node.get("offers")),
                "aggregate_rating": {
                    "rating_value": rating.get("ratingValue") if isinstance(rating, dict) else None,
                    "review_count": rating.get("reviewCount") if isinstance(rating, dict) else None,
                },
            })
    return products

def robots_allows(robots_text, url, user_agent=USER_AGENT):
    parser = RobotFileParser()
    parser.parse((robots_text or "").splitlines())
    return parser.can_fetch(user_agent, url)

def check_robots(url):
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    request = Request(robots_url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(request, timeout=20) as response:
            body = response.read(512_000).decode("utf-8", errors="replace")
        return robots_allows(body, url), robots_url
    except HTTPError as exc:
        if exc.code in (404, 410):
            return True, robots_url + f" (HTTP {exc.code}; no published rules)"
        return False, robots_url + f" (HTTP {exc.code}; fail-closed)"
    except (URLError, TimeoutError, OSError) as exc:
        return False, robots_url + f" (unreachable; fail-closed: {type(exc).__name__})"

def _page_title(html):
    match = re.search(r"<title[^>]*>(.*?)</title>", html or "", flags=re.I | re.S)
    if not match: return None
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", match.group(1))).strip() or None

def _markdown_text(value):
    if isinstance(value, str): return value
    if value is None: return ""
    return getattr(value, "raw_markdown", None) or getattr(value, "fit_markdown", None) or str(value)

async def crawl_targets():
    from crawl4ai import AsyncWebCrawler, BrowserConfig, CacheMode, CrawlerRunConfig
    targets = json.loads(TARGETS_PATH.read_text(encoding="utf-8"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    pages_dir = OUTPUT_DIR / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)
    browser_config = BrowserConfig(headless=True, verbose=False, user_agent=USER_AGENT)
    run_config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS, page_timeout=PAGE_TIMEOUT_MS, word_count_threshold=1)
    results, success_count = [], 0
    async with AsyncWebCrawler(config=browser_config) as crawler:
        for index, target in enumerate(targets):
            url = target["url"]
            allowed, robots_source = check_robots(url)
            record = {
                "id": target["id"], "brand": target["brand"], "market": target["market"],
                "kind": target["kind"], "url": url,
                "captured_at": datetime.now(timezone.utc).isoformat(),
                "robots_allowed": allowed, "robots_source": robots_source,
                "success": False, "status_code": None, "page_title": None,
                "products": [], "markdown_file": None, "error": None,
            }
            if not allowed:
                record["error"] = "Skipped: robots disallows crawling or robots.txt could not be checked."
                results.append(record)
                print(f"[SKIP robots] {target['id']}: {robots_source}", flush=True)
                continue
            try:
                response = await crawler.arun(url=url, config=run_config)
                record["success"] = bool(response.success)
                record["status_code"] = getattr(response, "status_code", None)
                html = getattr(response, "html", "") or getattr(response, "cleaned_html", "") or ""
                record["page_title"] = _page_title(html)
                record["products"] = extract_products_from_jsonld(parse_jsonld_blocks(html))
                markdown = _markdown_text(getattr(response, "markdown", None))
                if markdown:
                    markdown_path = pages_dir / f"{target['id']}.md"
                    markdown_path.write_text(markdown[:MAX_MARKDOWN_CHARS], encoding="utf-8")
                    record["markdown_file"] = str(markdown_path.relative_to(OUTPUT_DIR))
                if not response.success:
                    record["error"] = getattr(response, "error_message", None) or "Crawler returned success=false."
                else:
                    success_count += 1
                print(f"[{'OK' if response.success else 'FAIL'}] {target['brand']}: HTTP {record['status_code']} · {len(record['products'])} product schema item(s)", flush=True)
            except Exception as exc:
                record["error"] = f"{type(exc).__name__}: {exc}"
                print(f"[ERROR] {target['id']}: {record['error']}", flush=True)
            results.append(record)
            if index < len(targets) - 1: await asyncio.sleep(REQUEST_GAP_SECONDS)

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "crawler": "Crawl4AI 0.9.5", "llm_used": False,
        "target_count": len(targets), "success_count": success_count, "results": results,
    }
    (OUTPUT_DIR / "results.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# RAWAA competitor crawl snapshot", "",
        f"- Captured: {payload['generated_at']}",
        f"- Successful pages: {success_count}/{len(targets)}",
        "- Extraction: public JSON-LD Product/Offer data plus Markdown snapshots",
        "- No LLM/API key, login, proxy, stealth, or CAPTCHA bypass was used.", "",
        "| Brand | Market | Status | Product records |", "|---|---|---:|---:|",
    ]
    for item in results:
        status = f"HTTP {item['status_code']}" if item["status_code"] else ("skipped" if not item["robots_allowed"] else "failed")
        lines.append(f"| {item['brand']} | {item['market']} | {status} | {len(item['products'])} |")
    lines.extend(["", "## Notes", ""])
    for item in results:
        if item["error"]: lines.append(f"- **{item['brand']}**: {item['error']}")
    (OUTPUT_DIR / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Saved {OUTPUT_DIR / 'results.json'}", flush=True)
    if success_count == 0:
        print("No target page was crawled successfully; see results.json.", file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    raise SystemExit(asyncio.run(crawl_targets()))
