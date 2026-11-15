#!/usr/bin/env node
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] || join(tmpdir(), 'raawaa-pages'));
const relOut = relative(root, out);
assert.ok(relOut === '' || relOut.startsWith('..') || isAbsolute(relOut), 'Deployment output must be outside the source tree');
assert.notEqual(out, root, 'Refusing to overwrite the repository root');

const excludedTopLevel = new Set(['.git', '.github', 'recovery', 'scripts', 'deploy', 'docs', 'node_modules', 'dist', 'coverage', '.wrangler', '.projectmem', '.lighthouseci', 'graphify-out']);
const excludedFiles = new Set(['README.md', '.gitignore', '.graphifyignore', 'lighthouserc.json', 'hama.html', 'setup.html', 'check.html', 'package.json', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock']);
const excludedPaths = new Set(['css/hama.css', 'css/setup.css', 'css/check.css', 'js/setup-inline.js', 'js/check-inline.js']);
function include(source) {
  const rel = relative(root, source).split(sep).join('/');
  if (!rel) return true;
  const parts = rel.split('/');
  const file = basename(source);
  if (parts.some((part) => excludedTopLevel.has(part))) return false;
  if (parts.includes('hama')) return false; // Legacy Hama campaign assets are archival only.
  if (excludedFiles.has(file) || excludedPaths.has(rel)) return false;
  if (file.endsWith('.md') || file.startsWith('.env') || file === '.DS_Store') return false;
  return true;
}

rmSync(out, { recursive: true, force: true });
mkdirSync(dirname(out), { recursive: true });
cpSync(root, out, { recursive: true, filter: include });

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const files = walk(out);
const paths = files.map((path) => relative(out, path).split(sep).join('/'));
const has = (path) => paths.includes(path);
for (const required of [
  'index.html', 'serum.html', 'campaign.html', 'privacy.html', '404.html',
  'robots.txt', 'sitemap.xml', 'sw.js', 'manifest.webmanifest',
  'owner/index.html', 'owner/pricing.html', 'owner/settings.mjs',
  'js/config.js', 'js/pricing-policy.js', 'js/cart.js', 'js/campaign.js', 'css/campaign.css'
]) assert.ok(has(required), 'Missing required deployment asset: ' + required);
for (const forbidden of [
  'hama.html', 'setup.html', 'check.html', 'css/hama.css', 'css/setup.css', 'css/check.css',
  'js/setup-inline.js', 'js/check-inline.js', 'README.md', '.graphifyignore', 'lighthouserc.json'
]) assert.ok(!has(forbidden), 'Forbidden legacy/development file included: ' + forbidden);
assert.ok(!paths.some((path) => path.split('/').includes('hama')), 'Legacy Hama assets must not enter the deployment payload');
assert.ok(!paths.some((path) => path.startsWith('recovery/') || path.startsWith('.github/') || path.startsWith('scripts/') || path.startsWith('deploy/') || path.startsWith('docs/')), 'Recovery and tooling files must not be deployed');
assert.ok(!paths.some((path) => ['.projectmem', '.lighthouseci', 'graphify-out'].includes(path.split('/')[0])), 'Local memory and generated audit outputs must never enter the deployment payload');

const textFiles = files.filter((path) => ['.html', '.js', '.mjs'].some((ext) => path.toLowerCase().endsWith(ext)));
for (const path of textFiles) {
  const content = readFileSync(path, 'utf8');
  const compact = [32, 9, 10, 13, 160].reduce((value, code) => value.split(String.fromCharCode(code)).join(''), content);
  assert.ok(!compact.includes('15%'), relative(out, path) + ' contains the superseded 15% offer');
}
const read = (path) => readFileSync(join(out, path), 'utf8');
assert.ok(read('campaign.html').includes('<meta name="robots" content="noindex,follow">'), 'Campaign landing page must remain noindex');
assert.ok(!read('sitemap.xml').includes('/campaign'), 'Noindex campaign page must be absent from sitemap');
assert.ok(!read('sitemap.xml').includes('/hama'), 'Legacy Hama page must be absent from sitemap');
assert.ok(!read('sw.js').toLowerCase().includes('hama'), 'Service worker must not cache the legacy Hama route');
assert.ok(read('robots.txt').includes('Disallow: /hama'), 'Robots must disallow the retired Hama route');
assert.ok(read('campaign.html').includes('خصم 10%'), 'Campaign must display the canonical 10% discount');
assert.ok(read('campaign.html').includes('التوصيل مجاني إلى جميع المحافظات ولكل طرق الدفع'), 'Campaign must state free delivery for every payment method');
assert.ok(!read('owner/pricing.html').includes('الدولار الأمريكي') && !read('owner/pricing.html').includes('بالدولار'), 'Owner pricing must not contain stale USD labels');
console.log('Clean Cloudflare Pages payload validated: ' + files.length + ' files at ' + out);
