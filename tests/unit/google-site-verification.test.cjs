'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

test('Google Search Console HTML verification file is present and exact', () => {
  const file = path.join(process.cwd(), 'google15a14d81e8e19f8a.html');
  assert.equal(
    fs.readFileSync(file, 'utf8').trim(),
    'google-site-verification: google15a14d81e8e19f8a.html',
  );
});
