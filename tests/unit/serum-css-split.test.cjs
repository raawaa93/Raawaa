'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');

test('serum uses its pruned shell stylesheet while other routes keep shared CSS', () => {
  const serumHtml = fs.readFileSync(path.join(root, 'serum.html'), 'utf8');
  const homeHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const campaignHtml = fs.readFileSync(path.join(root, 'campaign.html'), 'utf8');
  const privacyHtml = fs.readFileSync(path.join(root, 'privacy.html'), 'utf8');
  const shellCssPath = path.join(root, 'css', 'serum-shell.css');
  const sharedCssPath = path.join(root, 'css', 'styles.css');
  const shellCss = fs.readFileSync(shellCssPath, 'utf8');
  const sharedCss = fs.readFileSync(sharedCssPath, 'utf8');

  assert.match(serumHtml, /href="css\/serum-shell\.css"/);
  assert.doesNotMatch(serumHtml, /href="css\/styles\.css"/);
  assert.match(homeHtml, /href="css\/home-inline\.css"/);
  assert.match(homeHtml, /href="css\/utilities\.css"/);
  assert.match(homeHtml, /href="css\/three-formulas\.css"/);
  assert.doesNotMatch(homeHtml, /href="css\/serum-shell\.css"/);
  assert.match(campaignHtml, /href="css\/styles\.css"/);
  assert.match(privacyHtml, /href="css\/styles\.css"/);
  assert.ok(shellCss.length > 0);
  assert.ok(shellCss.length < sharedCss.length * 0.7);

  for (const selector of [':root', '.site-header', '.mobile-nav', '.cart-drawer', '.btn-primary']) {
    assert.ok(shellCss.includes(selector), `serum shell stylesheet lost ${selector}`);
  }
  assert.match(shellCss, /@font-face/);
});
