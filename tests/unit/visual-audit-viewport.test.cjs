'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const audit = fs.readFileSync('scripts/visual-audit.mjs', 'utf8');

test('viewport screenshots reset scroll and wait for the visual viewport to reach the top', () => {
  assert.match(audit, /window\.scrollTo\(\{ top: 0, left: 0, behavior: 'instant' \}\)/);
  assert.match(audit, /window\.scrollY === 0 && \(window\.visualViewport\?\.offsetTop \?\? 0\) === 0/);
  assert.match(audit, /screenshotScrollY/);
  assert.match(audit, /if \(r\.screenshotScrollY !== 0\) issues\.push/);
});

test('visual QA records the actual scroll and visual viewport offset', () => {
  assert.match(audit, /scrollY: window\.scrollY/);
  assert.match(audit, /visualViewportOffsetTop: window\.visualViewport\?\.offsetTop \?\? 0/);
});
