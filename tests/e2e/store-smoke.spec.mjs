import { test, expect } from '@playwright/test';

const routes = ['/index.html', '/serum.html', '/campaign.html'];

for (const route of routes) {
  test(`${route} loads and fits common mobile and desktop widths`, async ({ page }, testInfo) => {
    const widths = testInfo.project.name === 'webkit-iphone'
      ? [390]
      : [390, 768, 1440];

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

      expect(response, `No response for ${route}`).not.toBeNull();
      expect(response.status(), `HTTP status for ${route}`).toBe(200);
      await expect(page.locator('body')).toBeVisible();

      const dimensions = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;
        const all = Array.from(document.querySelectorAll('html, body, body *'));
        const overflowing = all.map((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const before = getComputedStyle(element, '::before').content;
          const after = getComputedStyle(element, '::after').content;
          return {
            tag: element.tagName.toLowerCase(),
            id: element.id || '',
            className: typeof element.className === 'string' ? element.className.slice(0, 80) : '',
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            position: style.position,
            overflowX: style.overflowX,
            before,
            after,
          };
        }).filter((item) =>
          item.scrollWidth > item.clientWidth + 2 ||
          item.right > viewport + 2 ||
          item.before !== 'none' ||
          item.after !== 'none'
        ).sort((a, b) => (b.scrollWidth - b.clientWidth) - (a.scrollWidth - a.clientWidth))
          .slice(0, 16);
        return {
          viewport,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
          overflowing,
        };
      });

      expect(
        dimensions.document,
        `Horizontal overflow at ${width}px on ${route}: ${JSON.stringify(dimensions)}`,
      ).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  });
}
