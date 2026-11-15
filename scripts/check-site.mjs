import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const walk = (dir) => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
  const rel = path.posix.join(dir, entry.name);
  if (entry.isDirectory()) return ['recovery', 'node_modules', '.git', '.projectmem', '.lighthouseci', 'graphify-out', 'docs'].includes(entry.name) ? [] : walk(rel);
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
// Guard every active storefront page and browser script against stale promotion copy.
// Recovery snapshots are deliberately excluded: they are historical evidence only.
for (const file of [...htmlFiles, ...files.filter((name) => name.endsWith('.js'))]) {
  assert.doesNotMatch(read(file), /15\s*%/u, file + ' must not contain the superseded 15% promotion');
}

const index = read('index.html');
const serum = read('serum.html');
const campaign = read('campaign.html');
const campaignScript = read('js/campaign.js');
const ownerPricing = read('owner/pricing.html');
const ownerSettings = read('owner/settings.mjs');
const ownerApp = read('owner/app.mjs');
const ownerPricingTool = read('owner/pricing-tool.mjs');
const sitemap = read('sitemap.xml');
const robots = read('robots.txt');
const serviceWorker = read('sw.js');
const configSource = read('js/config.js');
const responseHeaders = read('_headers');
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
assert.match(campaign, /<link rel="canonical" href="https:\/\/raawaa-store\.pages\.dev\/campaign"/u, 'Campaign canonical must point to the campaign URL');
assert.match(campaign, /<meta property="og:url" content="https:\/\/raawaa-store\.pages\.dev\/campaign"/u, 'Campaign Open Graph URL must point to the campaign URL');
assert.match(ownerPricing, /الليرة السورية/u, 'Owner pricing editor must use the current SYP currency');
assert.doesNotMatch(ownerPricing, /الدولار الأمريكي|بالدولار/u, 'Owner pricing editor must not present stale USD labels');
assert.match(ownerSettings, /currency: 'SYP'/u, 'Owner dashboard currency default must be SYP');
assert.match(ownerApp, /Intl\.NumberFormat/u, 'Owner dashboard must format order totals by currency');
assert.match(ownerPricingTool, /let currencySymbol = 'ل\.س '/u, 'Owner pricing editor fallback currency must be SYP');
assert.doesNotMatch(ownerPricingTool, /new Function\s*\(/u, 'Owner pricing editor must parse configuration data instead of evaluating source code');
assert.match(responseHeaders, /X-Frame-Options:\s*DENY/u, 'Pages must prevent clickjacking');
assert.match(responseHeaders, /Permissions-Policy:.*camera=\(\).*microphone=\(\).*geolocation=\(\)/u, 'Unused sensitive browser features must be disabled');
assert.match(responseHeaders, /\/owner\/\*[\s\S]*Cache-Control:\s*no-store/u, 'Owner pages must not be cached');
assert.match(responseHeaders, /\/owner\/\*[\s\S]*Content-Security-Policy:/u, 'Owner pages must have an explicit CSP');
assert.doesNotMatch(responseHeaders, /unsafe-eval|unsafe-inline/u, 'Owner CSP must not permit dynamic or inline code');
assert.match(campaign, /التوصيل مجاني إلى جميع المحافظات ولكل طرق الدفع/u, 'Campaign page must state free delivery for all payment methods');
assert.doesNotMatch(campaign, /لا تشمل التوصيل|رسوم التوصيل|بلا عطر/u, 'Campaign page must not imply a delivery fee or scent-free base product');
assert.ok(campaignScript.includes('product.image && product.image.src'), 'Campaign cards must display the configured product image');
assert.match(campaign, /<meta name="robots" content="noindex,follow">/u, 'Campaign landing page must remain noindex');
assert.ok(!sitemap.includes('/campaign'), 'Noindex campaign page must be excluded from sitemap');
assert.ok(!sitemap.includes('/hama'), 'Legacy Hama route must be removed from sitemap');
assert.ok(!serviceWorker.toLowerCase().includes('hama'), 'Service worker must not cache the retired Hama route');
assert.ok(robots.includes('Disallow: /hama'), 'Robots must disallow the retired Hama route');
for (const legacy of ['hama.html', 'setup.html', 'check.html', 'css/hama.css', 'css/setup.css', 'css/check.css', 'js/setup-inline.js', 'js/check-inline.js']) {
  assert.ok(!fs.existsSync(path.join(root, legacy)), legacy + ' must be retired from the active source root');
}
assert.doesNotMatch(index, /خصم 15%|15%[^<]{0,40}شام كاش/u, 'Homepage must not advertise a 15% Sham Cash discount');
assert.match(serum, /اختاري المزيج والحجم والعدد، وراجعي الإجمالي التقديري/u, 'Serum page must explain the configured estimate flow');
assert.doesNotMatch(serum, /تحتوي المزيجات الحالية على زيوت وعطر|سعر الزيت المختار غير مشمول/u, 'Serum page must not claim unconfigured customizations or exclusions');
assert.equal(config.customization?.scentOptions?.length || 0, 0, 'No unapproved fragrance options may be published');
assert.equal(config.customization?.oilAdditions?.length || 0, 0, 'No unapproved oil additions may be published');
assert.match(serum, /تصوّر تصميمي/u, 'Serum imagery must be identified as conceptual');
assert.ok(cart.length > 85000, 'Cart source must be the complete recovered version, not the truncated PR #188 snapshot');
assert.match(cart, /function ensureCartDialog\(\)/u, 'Cart dialog must be supplied on the serum page');
assert.match(cart, /id="cart-dialog"/u, 'Cart dialog markup must have its expected ID');
assert.match(cart, /data-cart-items/u, 'Cart dialog must include its item list');
assert.match(cart, /data-cart-foot/u, 'Cart dialog must include its checkout footer');
assert.match(cart, /data-cart-checkout/u, 'Cart dialog must include the WhatsApp checkout action');
assert.match(cart, /ensureCartDialog\(\);\s*el\.toastRegion/u, 'Cart dialog must be injected before cart initialization');
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
config.products.forEach((product) => {
  assert.ok(product.image?.src, product.id + ' must define a campaign image');
  assert.ok(product.image?.alt, product.id + ' must define accurate campaign image alt text');
  assertLocalAsset('campaign.html', product.image.src);
});

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
