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

      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
      }));

      expect(
        dimensions.document,
        `Horizontal overflow at ${width}px on ${route}: ${JSON.stringify(dimensions)}`,
      ).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  });
}
