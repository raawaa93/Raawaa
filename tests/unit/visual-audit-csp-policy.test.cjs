'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { isKnownWebKitSelectCspFalsePositive } = require('../../scripts/visual-audit-csp-policy.cjs');

const known = {
  violatedDirective: 'style-src-attr',
  blockedURI: 'inline',
  sourceFile: '',
  lineNumber: 1,
  targetTagName: 'SELECT',
  targetHasStyle: false,
};

test('filters only the documented WebKit user-agent select false positive', () => {
  assert.equal(isKnownWebKitSelectCspFalsePositive('webkit', known), true);
});

test('does not filter the same violation in Chromium', () => {
  assert.equal(isKnownWebKitSelectCspFalsePositive('chromium', known), false);
});

test('does not filter real author inline style attributes', () => {
  assert.equal(isKnownWebKitSelectCspFalsePositive('webkit', { ...known, targetHasStyle: true }), false);
});

test('does not filter violations from author source files', () => {
  assert.equal(isKnownWebKitSelectCspFalsePositive('webkit', { ...known, sourceFile: 'https://raawaa-store.pages.dev/assets/app.js' }), false);
});

test('does not filter stylesheet element violations', () => {
  assert.equal(isKnownWebKitSelectCspFalsePositive('webkit', { ...known, violatedDirective: 'style-src-elem' }), false);
});

test('does not filter events not targeted at a select element', () => {
  assert.equal(isKnownWebKitSelectCspFalsePositive('webkit', { ...known, targetTagName: 'DIV' }), false);
});

test('does not filter violations with an unexpected source line', () => {
  assert.equal(isKnownWebKitSelectCspFalsePositive('webkit', { ...known, lineNumber: 12 }), false);
});
