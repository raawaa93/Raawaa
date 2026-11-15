'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const auditScript = fs.readFileSync(path.join(root, 'scripts/visual-audit.mjs'), 'utf8');
const workflow = fs.readFileSync(path.join(root, '.github/workflows/visual-qa.yml'), 'utf8');
const documentation = fs.readFileSync(path.join(root, 'VISUAL-QA.md'), 'utf8');

test('iPhone 13 visual audit uses the official device descriptor without overriding its viewport', () => {
  assert.match(auditScript, /devices\[['"]iPhone 13['"]\]/u);
  assert.doesNotMatch(auditScript, /viewport:\s*\{\s*width:\s*390,\s*height:\s*844\s*\}/u);
  assert.match(documentation, /390 × 844 screen/u);
  assert.match(documentation, /390 × 664 CSS viewport/u);
  assert.doesNotMatch(documentation, /390 × 844 CSS viewport/u);
});

test('visual audit requests reduced motion at browser-context level', () => {
  assert.match(auditScript, /reducedMotion:\s*['"]reduce['"]/u);
  assert.match(documentation, /Keep reduced-motion emulation at browser-context level/u);
});

test('visual QA installs the locked dependency graph', () => {
  assert.match(workflow, /npm ci --ignore-scripts --no-audit --no-fund/u);
  assert.doesNotMatch(workflow, /npm install --package-lock=false/u);
});
