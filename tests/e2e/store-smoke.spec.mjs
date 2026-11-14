import { test, expect } from '@playwright/test';

const routes = ['/index.html', '/serum.html', '/campaign.html'];

for (const route of routes) {
  test(`${route} loads and fits common mobile and desktop widths`, async ({ page }, testInfo) => {
    const widths = testInfo.project.name === 'webkit-iphone'
      ? [390]
      : testInfo.project.name === 'webkit-desktop'
        ? [768, 1440]
        : [390, 768, 1440];

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

      expect(response, `No response for ${route}`).not.toBeNull();
      expect(response.status(), `HTTP status for ${route}`).toBe(200);
      await expect(page.locator('body')).toBeVisible();

      const dimensions = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;
        const overflowing = Array.from(document.querySelectorAll('body *')).map((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
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
          };
        }).filter((item) => item.scrollWidth > item.clientWidth + 2 || item.right > viewport + 2)
          .sort((a, b) => (b.scrollWidth - b.clientWidth) - (a.scrollWidth - a.clientWidth))
          .slice(0, 24);
        const images = Array.from(document.images).map((img) => {
          const rect = img.getBoundingClientRect();
          const style = getComputedStyle(img);
          return {
            src: img.currentSrc.split('/').pop(),
            naturalWidth: img.naturalWidth,
            renderedWidth: Math.round(rect.width),
            renderedRight: Math.round(rect.right),
            cssWidth: style.width,
            maxWidth: style.maxWidth,
            parent: img.parentElement?.className || img.parentElement?.tagName,
            grandparent: img.parentElement?.parentElement?.className || img.parentElement?.parentElement?.tagName,
          };
        });
        const stylesheets = Array.from(document.styleSheets).map((sheet) => {
          try {
            return { href: sheet.href, disabled: sheet.disabled, rules: sheet.cssRules.length };
          } catch (error) {
            return { href: sheet.href, disabled: sheet.disabled, error: String(error) };
          }
        });
        return {
          viewport,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
          bodyMargin: getComputedStyle(document.body).margin,
          bodyOverflowX: getComputedStyle(document.body).overflowX,
          stylesheets,
          overflowing,
          images: images.filter((img) => img.renderedRight > viewport + 2 || img.renderedWidth > viewport + 2),
        };
      });

      expect(
        dimensions.document,
        `Horizontal overflow at ${width}px on ${route}: ${JSON.stringify(dimensions)}`,
      ).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  });
}
