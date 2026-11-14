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
