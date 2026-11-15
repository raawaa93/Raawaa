import unittest
from scripts.competitor_crawl import extract_products_from_jsonld, parse_jsonld_blocks, robots_allows

class CompetitorCrawlTests(unittest.TestCase):
    def test_extracts_product_offer_from_graph(self):
        html = """
        <script type="application/ld+json">
        {"@graph":[{"@type":"Product","name":"Sample Hair Oil",
        "brand":{"@type":"Brand","name":"Sample"},
        "offers":{"@type":"Offer","price":"28.00","priceCurrency":"GBP",
        "availability":"https://schema.org/InStock"},
        "aggregateRating":{"ratingValue":"4.8","reviewCount":"120"}}]}
        </script>
        """
        products = extract_products_from_jsonld(parse_jsonld_blocks(html))
        self.assertEqual(len(products), 1)
        self.assertEqual(products[0]["name"], "Sample Hair Oil")
        self.assertEqual(products[0]["brand"], "Sample")
        self.assertEqual(products[0]["offers"][0]["price_currency"], "GBP")
        self.assertEqual(products[0]["aggregate_rating"]["review_count"], "120")

    def test_ignores_malformed_jsonld_and_non_product_nodes(self):
        html = '<script type="application/ld+json">{bad json</script><script type="application/ld+json">{"@type":"Organization","name":"Brand"}</script>'
        self.assertEqual(extract_products_from_jsonld(parse_jsonld_blocks(html)), [])

    def test_robots_rules_are_applied(self):
        rules = "User-agent: *\\nDisallow: /private/\\nAllow: /products/"
        self.assertTrue(robots_allows(rules, "https://example.com/products/oil"))
        self.assertFalse(robots_allows(rules, "https://example.com/private/account"))

    def test_product_arrays_are_deduplicated(self):
        product = {"@type": "Product", "name": "Oil", "url": "https://example.com/oil"}
        self.assertEqual(len(extract_products_from_jsonld([{"@graph": [product, product]}])), 1)

if __name__ == "__main__":
    unittest.main()
