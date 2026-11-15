import assert from 'node:assert/strict';

const origin = process.env.RAWAA_PRODUCTION_ORIGIN || 'https://raawaa-store.pages.dev';
const checks = [
  { path: '/', owner: false },
  { path: '/owner/index.html', owner: true },
  { path: '/owner/pricing.html', owner: true }
];

for (const item of checks) {
  const url = new URL(item.path, origin);
  const response = await fetch(url, { redirect: 'error' });
  assert.equal(response.status, 200, url.href + ' must return HTTP 200');
  const headers = response.headers;
  assert.equal(headers.get('x-frame-options')?.toLowerCase(), 'deny', url.href + ' must block framing');
  const permissions = headers.get('permissions-policy') || '';
  for (const feature of ['camera=()', 'microphone=()', 'geolocation=()']) {
    assert.ok(permissions.includes(feature), url.href + ' must disable ' + feature);
  }
  if (item.owner) {
    const csp = headers.get('content-security-policy') || '';
    assert.ok(csp.includes("default-src 'self'"), url.href + ' must set a restrictive CSP');
    assert.ok(csp.includes("script-src 'self'"), url.href + ' must restrict scripts to same-origin files');
    assert.ok(csp.includes("style-src 'self'"), url.href + ' must restrict styles to same-origin files');
    assert.ok(csp.includes('https://oyoyozdugicmnkfhjovo.supabase.co'), url.href + ' must allow the owner Supabase API');
    assert.ok(!/unsafe-eval|unsafe-inline/i.test(csp), url.href + ' must not allow unsafe script/style execution');
    assert.equal(headers.get('cache-control')?.toLowerCase(), 'no-store', url.href + ' must not be cached');
    assert.match(headers.get('x-robots-tag') || '', /noindex/i, url.href + ' must remain out of search indexes');
  }
  await response.body?.cancel();
  process.stdout.write('Verified security headers: ' + url.pathname + '\n');
}
