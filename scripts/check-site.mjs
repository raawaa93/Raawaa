import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const walk = (dir) => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
  const rel = path.posix.join(dir, entry.name);
  if (entry.isDirectory()) return ['recovery', 'node_modules', '.git'].includes(entry.name) ? [] : walk(rel);
  return [rel];
});
const files = walk('.').filter((file) => !file.startsWith('./recovery/') && !file.startsWith('recovery/'));
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const cssFiles = files.filter((file) => file.endsWith('.css'));

// Mobile and accessibility baseline: every page must declare its viewport and
// preserve the Arabic RTL document semantics used throughout the storefront.
for (const file of htmlFiles) {
  const html = read(file);
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] || '';
  assert.match(htmlTag, /\blang=["']ar["']/i, file + ' must declare Arabic as its document language');
  assert.match(htmlTag, /\bdir=["']rtl["']/i, file + ' must declare RTL text direction');
  assert.match(html, /<meta\s+name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i, file + ' must include a mobile viewport');
}
const globalStyles = read('css/styles.css');
assert.match(globalStyles, /:focus-visible/, 'Global styles must preserve a visible keyboard focus indicator');
assert.match(globalStyles, /min-height:\s*48px/i, 'Primary controls must retain a touch-friendly minimum height');
assert.match(globalStyles, /env\(safe-area-inset-bottom\)/i, 'Cart footer must respect the iPhone safe-area inset');
const index = read('index.html');
const serum = read('serum.html');
const campaign = read('campaign.html');
const campaignScript = read('js/campaign.js');
const configSource = read('js/config.js');
const cart = read('js/cart.js');
const views = read('js/serum-views.js');

const configMatch = configSource.match(/window\.RAWAA_CONFIG\s*=\s*deepFreeze\((\{[\s\S]*?\})\s*\);/);
assert.ok(configMatch, 'RAWAA_CONFIG must be a JSON-compatible object');
const config = JSON.parse(configMatch[1]);
const shamCash = config.payment?.methods?.find((method) => method.id === 'shamcash');
assert.equal(shamCash?.discountPercent, 10, 'Sham Cash discount must remain 10%');
assert.equal(config.delivery?.policy?.alwaysFree, true, 'Delivery must remain free');
assert.ok((config.delivery?.zones || []).length > 0, 'Delivery zones must be configured');
assert.ok(config.delivery.zones.every((zone) => Number(zone.fee) === 0), 'All configured delivery zones must have zero fees');

assert.match(index, /خصم 10%/u, 'Homepage must display the approved 10% discount');
assert.match(campaign, /خصم 10%/u, 'Campaign page must display the approved 10% discount');
assert.match(campaign, /التوصيل مجاني إلى جميع المحافظات ولكل طرق الدفع/u, 'Campaign page must state free delivery for all payment methods');
assert.doesNotMatch(campaign, /لا تشمل التوصيل|رسوم التوصيل|بلا عطر/u, 'Campaign page must not imply a delivery fee or scent-free base product');
assert.match(campaignScript, /product\.image && product\.image\.src/u, 'Campaign cards must display the configured product image');
assert.doesNotMatch(index, /خصم 15%|15%[^<]{0,40}شام كاش/u, 'Homepage must not advertise a 15% Sham Cash discount');
assert.match(serum, /تحتوي المزيجات الحالية على زيوت وعطر/u, 'Serum page must disclose oils and fragrance');
assert.match(serum, /نؤكد توفّره وسعره قبل الاعتماد/u, 'Customization must be confirmed before acceptance');
assert.match(serum, /تصوّر تصميمي/u, 'Serum imagery must be identified as conceptual');
assert.ok(cart.length > 85000, 'Cart source must be the complete recovered version, not the truncated PR #188 snapshot');
assert.match(views, /showView\('bottle'\);/, 'Serum image selector must default to the bottle view');

const jsonLd = [...serum.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
assert.ok(jsonLd.length > 0, 'Serum page must retain structured metadata');
assert.ok(jsonLd.every((block) => !/"@type"\s*:\s*"(?:Offer|AggregateOffer)"/.test(block)), 'Do not publish unapproved Offer pricing schema');

function resolveLocal(fromFile, raw) {
  const value = raw.trim().split(/[?#]/, 1)[0];
  if (!value || /^(?:https?:|\/\/|data:|blob:|mailto:|tel:|javascript:|#)/i.test(value)) return null;
  let decoded;
  try { decoded = decodeURIComponent(value); } catch { decoded = value; }
  const resolved = decoded.startsWith('/')
    ? path.resolve(root, '.' + decoded)
    : path.resolve(root, path.dirname(fromFile), decoded);
  assert.ok(resolved === root || resolved.startsWith(root + path.sep), fromFile + ' references a path outside the site: ' + raw);
  return resolved;
}
function assertLocalAsset(fromFile, raw) {
  const target = resolveLocal(fromFile, raw);
  if (target) assert.ok(fs.existsSync(target), fromFile + ' references missing local asset: ' + raw);
}
for (const file of htmlFiles) {
  const html = read(file);
  for (const tag of html.matchAll(/<(script|img|source|video|audio|iframe|link)\b[^>]*>/gi)) {
    const tagName = tag[1].toLowerCase();
    const attrs = tag[0];
    if (tagName === 'link' && !/\brel=["'][^"']*(?:stylesheet|icon|manifest|preload|apple-touch-icon)[^"']*["']/i.test(attrs)) continue;
    const resource = attrs.match(/\b(?:src|href|poster)=["']([^"']+)["']/i);
    if (resource) assertLocalAsset(file, resource[1]);
    const srcset = attrs.match(/\bsrcset=["']([^"']+)["']/i);
    if (srcset) for (const candidate of srcset[1].split(',')) assertLocalAsset(file, candidate.trim().split(/\s+/)[0]);
  }
}
for (const file of cssFiles) {
  const css = read(file);
  for (const match of css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)) assertLocalAsset(file, match[2]);
}

console.log('Raawaa checks passed: approved 10% Sham Cash, free delivery, page disclosures, schema, complete cart, bottle-first serum, and all local HTML/CSS assets (' + htmlFiles.length + ' HTML, ' + cssFiles.length + ' CSS).');
