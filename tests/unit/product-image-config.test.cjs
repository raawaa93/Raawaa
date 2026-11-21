'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const productsDir = path.join(root, 'assets', 'img', 'products');

function loadConfig() {
  const source = fs.readFileSync(path.join(root, 'js', 'config.js'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: 'js/config.js' });
  return sandbox.window.RAWAA_CONFIG;
}

test('all nine product variants use existing responsive AVIF/WebP/JPEG assets', () => {
  const config = loadConfig();
  assert.equal(config.products.length, 9);

  const familyNames = {
    'rosemary-caffeine': 'rosemary',
    'olive-panthenol': 'olive',
    'castor-blend': 'castor',
  };

  for (const product of config.products) {
    const family = familyNames[product.familyId];
    assert.ok(family, `known product family for ${product.id}`);

    const image = product.image;
    assert.deepEqual(Array.from(image.widths), [480, 720, 900]);
    assert.deepEqual(
      Array.from(image.avif),
      [480, 720, 900].map(width => `rawaa-${family}-${width}.avif`),
    );
    assert.deepEqual(
      Array.from(image.webp),
      [480, 720, 900].map(width => `rawaa-${family}-${width}.webp`),
    );
    assert.equal(image.src, `assets/img/products/rawaa-${family}-480.jpg`);
    assert.equal(image.width, 480);
    assert.equal(image.height, 480);

    for (const filename of [...image.avif, ...image.webp, path.basename(image.src)]) {
      assert.ok(
        fs.existsSync(path.join(productsDir, filename)),
        `missing responsive asset ${filename} for ${product.id}`,
      );
    }
  }
});

test('serum hero and PWA cache declare the responsive image sources', () => {
  const serum = fs.readFileSync(path.join(root, 'serum.html'), 'utf8');
  const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

  assert.match(serum, /<source data-size-avif="" type="image\/avif"/);
  assert.match(serum, /<source data-size-webp="" type="image\/webp"/);

  for (const family of ['rosemary', 'olive', 'castor']) {
    for (const ext of ['avif', 'webp', 'jpg']) {
      assert.ok(
        serviceWorker.includes(`./assets/img/products/rawaa-${family}-480.${ext}`),
        `PWA core cache missing ${family} 480px ${ext} image`,
      );
    }
  }
});
