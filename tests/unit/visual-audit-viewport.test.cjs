'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { devices } = require('playwright');

const root = path.resolve(__dirname, '../..');
const device = devices['iPhone 13'];
const auditScript = fs.readFileSync(path.join(root, 'scripts/visual-audit.mjs'), 'utf8');
const workflow = fs.readFileSync(path.join(root, '.github/workflows/visual-qa.yml'), 'utf8');
const documentation = fs.readFileSync(path.join(root, 'VISUAL-QA.md'), 'utf8');

test('iPhone 13 keeps the official screen and browser viewport dimensions distinct', () => {
  assert.deepEqual(device.screen, { width: 390, height: 844 });
  assert.deepEqual(device.viewport, { width: 390, height: 664 });
  assert.match(auditScript, /devices\[['"]iPhone 13['"]\]/u);
  assert.doesNotMatch(auditScript, /viewport:\s*\{\s*width:\s*390,\s*height:\s*844\s*\}/u);
});

test('visual audit requests reduced motion at browser-context level', () => {
  assert.match(auditScript, /reducedMotion:\s*['"]reduce['"]/u);
  assert.match(documentation, /Keep reduced-motion emulation at browser-context level/u);
});

test('visual QA installs the locked dependency graph', () => {
  assert.match(workflow, /npm ci --ignore-scripts --no-audit --no-fund/u);
  assert.doesNotMatch(workflow, /npm install --package-lock=false/u);
});

test('visual QA documentation distinguishes screen height from CSS viewport height', () => {
  assert.match(documentation, /390 × 844 screen/u);
  assert.match(documentation, /390 × 664 CSS viewport/u);
  assert.doesNotMatch(documentation, /390 × 844 CSS viewport/u);
});
