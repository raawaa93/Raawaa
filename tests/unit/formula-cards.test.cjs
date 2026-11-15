'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '../../js/formula-cards.js'), 'utf8');

function makeHarness(schedule) {
  const nodes = [
    { family: 'rosemary-caffeine', textContent: 'من ٢٬٠٠٠ ل.س', getAttribute() { return this.family; } },
    { family: 'olive-panthenol', textContent: 'من ١٬٨٠٠ ل.س', getAttribute() { return this.family; } },
    { family: 'castor-blend', textContent: 'من ١٬٨٠٠ ل.س', getAttribute() { return this.family; } },
  ];
  let scheduled;
  const window = {
    RAWAA_CONFIG: {
      products: [
        { familyId: 'rosemary-caffeine', price: 2400 },
        { familyId: 'rosemary-caffeine', price: 2000 },
        { familyId: 'olive-panthenol', price: 2200 },
        { familyId: 'olive-panthenol', price: 1800 },
        { familyId: 'castor-blend', price: 2600 },
        { familyId: 'castor-blend', price: 1800 },
      ],
      currency: { symbol: 'ل.س ' },
    },
    requestIdleCallback: schedule === 'idle' ? (callback, options) => { scheduled = callback; assert.equal(options.timeout, 3000); } : undefined,
    setTimeout: schedule === 'timeout' ? (callback, delay) => { scheduled = callback; assert.equal(delay, 0); } : undefined,
  };
  vm.runInNewContext(source, { window, document: { querySelectorAll: () => nodes }, Intl });
  return { nodes, runScheduled: () => scheduled() };
}

test('keeps HTML fallback prices visible until the browser is idle', () => {
  const h = makeHarness('idle');
  assert.deepEqual(h.nodes.map((n) => n.textContent), ['من ٢٬٠٠٠ ل.س', 'من ١٬٨٠٠ ل.س', 'من ١٬٨٠٠ ل.س']);
  h.runScheduled();
  assert.deepEqual(h.nodes.map((n) => n.textContent), ['من ٢٬٠٠٠ ل.س', 'من ١٬٨٠٠ ل.س', 'من ١٬٨٠٠ ل.س']);
});

test('uses a timer fallback when requestIdleCallback is unavailable', () => {
  const h = makeHarness('timeout');
  assert.equal(h.nodes[0].textContent, 'من ٢٬٠٠٠ ل.س');
  h.runScheduled();
  assert.equal(h.nodes[0].textContent, 'من ٢٬٠٠٠ ل.س');
});
