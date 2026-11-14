import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const root = path.resolve(new URL('..', import.meta.url).pathname);
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const serum = fs.readFileSync(path.join(root, 'serum.html'), 'utf8');
const configSource = fs.readFileSync(path.join(root, 'js/config.js'), 'utf8');
const cart = fs.readFileSync(path.join(root, 'js/cart.js'), 'utf8');
const views = fs.readFileSync(path.join(root, 'js/serum-views.js'), 'utf8');
const design = fs.readFileSync(path.join(root, 'css/rawaa-design-system.css'), 'utf8');

const configMatch = configSource.match(/window\\.RAWAA_CONFIG\\s*=\\s*deepFreeze\\((\\{[\\s\\S]*?\\})\\s*\\);/);
assert.ok(configMatch, 'RAWAA_CONFIG must be a JSON-compatible object');
const config = JSON.parse(configMatch[1]);

const shamCash = config.payment?.methods?.find((method) => method.id === 'shamcash');
assert.equal(shamCash?.discountPercent, 10, 'Sham Cash discount must remain 10%');
assert.equal(config.delivery?.policy?.alwaysFree, true, 'Delivery must remain free');
assert.ok((config.delivery?.zones || []).every((zone) => Number(zone.fee) === 0), 'All configured delivery zones must have zero fees');

assert.match(index, /خصم 10%/u, 'Homepage must display the approved 10% discount');
assert.doesNotMatch(index, /خصم 15%|15%.*شام كاش/u, 'Homepage must not advertise 15%');
assert.match(serum, /تحتوي المزيجات الحالية على زيوت وعطر/u, 'Serum page must disclose oils and fragrance');
assert.match(serum, /نؤكد توفّره وسعره قبل الاعتماد/u, 'Customization must be confirmed before acceptance');
assert.match(serum, /تصوّر تصميمي/u, 'Serum imagery must be identified as conceptual');

const jsonLd = [...serum.matchAll(/<script[^>]*type=["']application\\/ld\\+json["'][^>]*>([\\s\\S]*?)<\\/script>/gi)].map((match) => match[1]);
assert.ok(jsonLd.length > 0, 'Serum page must retain structured product metadata');
assert.ok(jsonLd.every((block) => !/"@type"\\s*:\\s*"(?:Offer|AggregateOffer)"/.test(block)), 'Do not publish unapproved Offer pricing schema');

assert.ok(cart.length > 85000, 'Cart source must be the complete recovered version, not the truncated PR #188 snapshot');
assert.match(views, /showView\\('bottle'\\);/, 'Serum image selector must default to the bottle view');
assert.ok(design.length > 5000, 'Shared design-system stylesheet must be present');

for (const [html, label] of [[index, 'index.html'], [serum, 'serum.html']]) {
  for (const match of html.matchAll(/<(?:script|link)\\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/gi)) {
    const url = match[1];
    if (/^(?:https?:|data:|#|mailto:|tel:|javascript:|\\/)/i.test(url)) continue;
    if (match[0].startsWith('<link') && !/stylesheet/i.test(match[0])) continue;
    const target = path.join(root, url.split(/[?#]/)[0]);
    assert.ok(fs.existsSync(target), label + ' references missing local asset: ' + url);
  }
}

console.log('Raawaa site checks passed: 10% Sham Cash, free delivery, disclosure, schema, complete cart, bottle default, and local CSS/JS references.');
