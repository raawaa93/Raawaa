import { test, expect } from '@playwright/test';

test('Serum selection, cart quantity, and payment estimate stay synchronized', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/serum.html', { waitUntil: 'domcontentloaded' });

  // The formula and size selection must drive the actual product ID added to cart.
  await page.locator('[data-formula-select="rosemary-caffeine"]').click();
  await page.locator('input[name="rawaa-size"][value="rosemary-caffeine-100"]').check();
  await expect(page.locator('[data-add-current]')).toHaveAttribute('data-add-to-cart', 'rosemary-caffeine-100');

  // The estimate breakdown is intentionally inside a collapsed disclosure.
  await page.locator('.serum-estimate-details > summary').click();

  // COD must remove the Sham Cash discount from the one-item estimator.
  await page.locator('[data-estimate-method]').selectOption('cod');
  await expect(page.locator('[data-estimate-discount]')).toHaveText('لا يوجد');
  await expect(page.locator('[data-estimate-total]')).toContainText('2,800');

  // Switching back to Sham Cash must restore exactly 10% on the selected product.
  await page.locator('[data-estimate-method]').selectOption('shamcash');
  await expect(page.locator('[data-estimate-discount]')).toContainText('280');
  await expect(page.locator('[data-estimate-total]')).toContainText('2,520');

  // Adding the chosen size must populate and open the cart, then quantity controls
  // must update the item count and line total.
  const addButton = page.locator('[data-add-current]');
  await expect(addButton).toBeEnabled();
  await expect(addButton).toHaveAttribute('data-add-to-cart', 'rosemary-caffeine-100');
  await addButton.click();
  await expect(page.locator('#cart-dialog')).toBeVisible();
  await expect(page.locator('[data-cart-count]')).toHaveText('1');
  const item = page.locator('[data-cart-item="rosemary-caffeine-100"]');
  await expect(item).toBeVisible();
  await expect(item.locator('[data-qty-value]')).toHaveText('1');

  await item.locator('[data-qty-increase]').click();
  await expect(item.locator('[data-qty-value]')).toHaveText('2');
  await expect(item.locator('.cart-item-line')).toContainText('5,600');
  expect(pageErrors).toEqual([]);
});
 
test('Checkout prepares a reviewable WhatsApp order without claiming it was sent', async ({ page }) => {
  await page.addInitScript(() => {
    window.__rawaaOpenedUrls = [];
    window.open = (url) => {
      window.__rawaaOpenedUrls.push(String(url));
      return null;
    };
  });
  await page.goto('/serum.html', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-formula-select="rosemary-caffeine"]').click();
  await page.locator('input[name="rawaa-size"][value="rosemary-caffeine-100"]').check();
  await page.locator('[data-add-current]').click();
  await expect(page.locator('#cart-dialog')).toBeVisible();
  await page.locator('[data-cart-checkout]').click();

  const fallback = page.locator('[data-cart-fallback-link]');
  await expect(fallback).toBeVisible();
  const href = await fallback.getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\//);
  const decoded = decodeURIComponent(href);
  expect(decoded).toContain('روزماري وكافيين');
  expect(decoded).toContain('100 مل');
  expect(decoded).toContain('2,800');
  await expect(page.locator('.cart-disclaimer')).toContainText('لا يُرسل الموقع رسالة');
  expect(await page.evaluate(() => window.__rawaaOpenedUrls.length)).toBe(1);
});

test('Product variant URLs preselect the exact formula and size', async ({ page }) => {
  await page.goto('/serum.html?product=rosemary-caffeine&size=100', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-formula-title]')).toHaveText('روزماري وكافيين');
  await expect(page.locator('input[name="rawaa-size"][value="rosemary-caffeine-100"]')).toBeChecked();
  await expect(page.locator('[data-add-current]')).toHaveAttribute('data-add-to-cart', 'rosemary-caffeine-100');

  await page.locator('input[name="rawaa-size"][value="rosemary-caffeine-30"]').check();
  await expect(page).toHaveURL(/product=rosemary-caffeine/);
  await expect(page).toHaveURL(/size=30/);
  await expect(page.locator('[data-add-current]')).toHaveAttribute('data-add-to-cart', 'rosemary-caffeine-30');
});


test('Owner pricing editor parses the published config and renders all products', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/owner/pricing.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-price-for]')).toHaveCount(9);
  await expect(page.locator('#discount-input')).toHaveValue('10');
  await expect(page.locator('#always-free')).toBeChecked();
  await expect(page.locator('#impact tbody tr')).toHaveCount(36);
  expect(pageErrors).toEqual([]);
});


test('public pages satisfy the restrictive CSP without browser violations', async ({ page }) => {
  for (const route of ['/', '/serum', '/campaign', '/privacy']) {
    await page.addInitScript(() => {
      window.__rawaaCspViolations = [];
      window.addEventListener('securitypolicyviolation', event => {
        window.__rawaaCspViolations.push(event.violatedDirective + ': ' + event.blockedURI);
      });
    });
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const violations = await page.evaluate(() => window.__rawaaCspViolations);
    expect(violations).toEqual([]);
  }
});


test('serum page skips homepage-only CSS and keeps narrow mobile refinements', async ({ page }) => {
  const requestedStylesheets = [];
  page.on('request', request => {
    if (request.resourceType() === 'stylesheet') requestedStylesheets.push(request.url());
  });

  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/serum.html', { waitUntil: 'domcontentloaded' });

  expect(requestedStylesheets.some(url => url.includes('rawaa-design-system.css'))).toBe(false);
  const card = page.locator('.serum-card');
  await expect(card).toBeVisible();
  const padding = await card.evaluate(element => ({
    top: getComputedStyle(element).paddingTop,
    bottom: getComputedStyle(element).paddingBottom,
  }));
  expect(padding).toEqual({ top: '3.2px', bottom: '3.2px' });
  await expect(page.locator('[data-add-current]')).toBeVisible();
});


test('serum hero selects responsive AVIF/WebP variants and follows the chosen formula', async ({ page }) => {
  await page.goto('/serum.html', { waitUntil: 'domcontentloaded' });

  const hero = page.locator('[data-size-img]');
  const avif = page.locator('[data-size-avif]');
  const webp = page.locator('[data-size-webp]');
  await expect(hero).toBeVisible();
  await expect(hero).toHaveAttribute('fetchpriority', 'high');
  await expect(hero).toHaveAttribute('src', /rawaa-olive-480\.jpg$/);
  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(0);
  await expect(page.locator('[data-size-picture] source')).toHaveCount(2);
  await expect(avif).toHaveAttribute('srcset', /rawaa-olive-480\.avif/);
  await expect(webp).toHaveAttribute('srcset', /rawaa-olive-480\.webp/);
  await expect.poll(() => hero.evaluate(img => img.currentSrc)).toMatch(/rawaa-olive-(480|720|900)\.(avif|webp)$/);

  await page.locator('[data-formula-select="rosemary-caffeine"]').click();
  await expect(hero).toHaveAttribute('src', /rawaa-rosemary-480\.jpg$/);
  await expect(avif).toHaveAttribute('srcset', /rawaa-rosemary-480\.avif/);
  await expect.poll(() => hero.evaluate(img => img.currentSrc)).toMatch(/rawaa-rosemary-(480|720|900)\.(avif|webp)$/);

  await page.locator('[data-formula-select="castor-blend"]').click();
  await expect(hero).toHaveAttribute('src', /rawaa-castor-480\.jpg$/);
  await expect(avif).toHaveAttribute('srcset', /rawaa-castor-480\.avif/);
  await expect.poll(() => hero.evaluate(img => img.currentSrc)).toMatch(/rawaa-castor-(480|720|900)\.(avif|webp)$/);
});
