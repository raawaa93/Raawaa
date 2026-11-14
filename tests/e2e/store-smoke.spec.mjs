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
        const offenders = Array.from(document.querySelectorAll('body *'))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              tag: element.tagName.toLowerCase(),
              id: element.id || '',
              className: typeof element.className === 'string' ? element.className.slice(0, 100) : '',
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              position: style.position,
              overflowX: style.overflowX,
            };
          })
          .filter((item) => item.right > viewport + 2 && item.width > 0)
          .sort((a, b) => b.right - a.right)
          .slice(0, 8);
        return {
          viewport,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
          offenders,
        };
      });

      expect(
        dimensions.document,
        `Horizontal overflow at ${width}px on ${route}: ${JSON.stringify(dimensions)}`,
      ).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  });
}
