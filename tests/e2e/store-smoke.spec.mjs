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


test('Homepage promotion strip, sticky header, and mobile menu stay correctly aligned', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const buttonMetrics = await page.locator('.hero-actions .btn').evaluateAll(elements => elements.map(element => {
    const style = getComputedStyle(element);
    return { minHeight: parseFloat(style.minHeight), color: style.color, background: style.backgroundColor };
  }));
  expect(buttonMetrics).toHaveLength(2);
  expect(buttonMetrics.every(button => button.minHeight >= 44)).toBe(true);
  expect(buttonMetrics[0].background).toBe('rgb(46, 42, 38)');
  expect(buttonMetrics[0].color).toBe('rgb(255, 253, 250)');

  const promo = page.locator('.offer-bar');
  const header = page.locator('.site-header');
  const promoBottom = await promo.evaluate(element => element.getBoundingClientRect().bottom);
  const headerTop = await header.evaluate(element => element.getBoundingClientRect().top);
  expect(headerTop).toBeGreaterThanOrEqual(promoBottom - 1);

  const toggle = page.locator('#navToggle');
  const menu = page.locator('#mobileNav');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();
  const firstMenuTop = await menu.evaluate(element => element.getBoundingClientRect().top);
  const firstHeaderBottom = await header.evaluate(element => element.getBoundingClientRect().bottom);
  expect(firstMenuTop).toBeGreaterThanOrEqual(firstHeaderBottom - 1);

  await toggle.click();
  await page.evaluate(() => window.scrollTo(0, 500));
  await toggle.click();
  const scrolledMenuTop = await menu.evaluate(element => element.getBoundingClientRect().top);
  const scrolledHeaderBottom = await header.evaluate(element => element.getBoundingClientRect().bottom);
  expect(scrolledMenuTop).toBeGreaterThanOrEqual(scrolledHeaderBottom - 1);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});
