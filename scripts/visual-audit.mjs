import fs from 'node:fs';
import path from 'node:path';
import { chromium, devices } from '@playwright/test';

const baseURL = (process.env.BASE_URL || 'https://raawaa-store.pages.dev').replace(/\/$/, '');
const outDir = path.resolve('artifacts/visual-audit');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const routes = [
  { name: 'home', path: '/' },
  { name: 'serum', path: '/serum.html' },
  { name: 'campaign', path: '/campaign.html' },
  { name: 'privacy', path: '/privacy.html' },
];
const viewports = [
  { name: 'iphone-13', device: devices['iPhone 13'] },
  { name: 'desktop-1440', device: { viewport: { width: 1440, height: 1000 }, screen: { width: 1440, height: 1000 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false } },
];
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      ...viewport.device,
      locale: 'ar-SY',
      timezoneId: 'Asia/Damascus',
      colorScheme: 'light',
      reducedMotion: 'reduce',
      ignoreHTTPSErrors: false,
    });

    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      const failedRequests = [];
      const badResponses = [];

      page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      page.on('pageerror', err => pageErrors.push(err.message));
      page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure()?.errorText || 'failed' }));
      page.on('response', res => { if (res.status() >= 400) badResponses.push({ status: res.status(), url: res.url() }); });

      let navigationStatus = null;
      let navigationError = null;
      try {
        const response = await page.goto(baseURL + route.path, { waitUntil: 'domcontentloaded', timeout: 45000 });
        navigationStatus = response?.status() ?? null;
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
        await page.evaluate(() => document.fonts?.ready);
        await page.waitForTimeout(900);

        // Trigger lazy-loaded images before the full-page capture.
        await page.evaluate(async () => {
          const step = Math.max(500, Math.floor(window.innerHeight * 0.75));
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise(resolve => setTimeout(resolve, 80));
          }
          window.scrollTo(0, 0);
          await new Promise(resolve => setTimeout(resolve, 300));
        });

        const metrics = await page.evaluate(() => {
          const width = document.documentElement.clientWidth;
          const overflow = Array.from(document.querySelectorAll('body *')).map(el => {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return {
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              className: typeof el.className === 'string' ? el.className.slice(0, 100) : '',
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth,
              overflowX: style.overflowX,
            };
          }).filter(item => item.right > width + 2 || item.scrollWidth > item.clientWidth + 2)
            .sort((a, b) => (b.right - width) - (a.right - width)).slice(0, 30);
          const images = Array.from(document.images).map(img => ({
            src: img.currentSrc || img.src,
            alt: img.alt || '',
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            visible: !img.closest('picture')?.hidden && getComputedStyle(img).display !== 'none' && getComputedStyle(img).visibility !== 'hidden' && rect.width > 0 && rect.height > 0,
          }));
          return {
            title: document.title,
            lang: document.documentElement.lang,
            dir: document.documentElement.dir,
            viewportWidth: width,
            documentWidth: document.documentElement.scrollWidth,
            documentHeight: document.documentElement.scrollHeight,
            bodyWidth: document.body.scrollWidth,
            bodyFont: getComputedStyle(document.body).fontFamily,
            fontsStatus: document.fonts?.status || 'unknown',
            headings: Array.from(document.querySelectorAll('h1,h2')).slice(0, 15).map(h => h.innerText.trim()),
            brokenImages: images.filter(img => img.visible && img.complete && img.naturalWidth === 0),
            incompleteVisibleImages: images.filter(img => img.visible && !img.complete),
            images,
            overflow,
          };
        });

        const prefix = route.name + '--' + viewport.name;
        await page.screenshot({ path: path.join(outDir, prefix + '--viewport.png'), fullPage: false, animations: 'disabled' });
        await page.screenshot({ path: path.join(outDir, prefix + '--full.png'), fullPage: true, animations: 'disabled' });

        const interactiveScreenshots = [];
        if (route.name === 'serum') {
          for (const view of ['sizes', 'ritual']) {
            const selector = '[data-serum-view="' + view + '"] img';
            await page.locator('[data-serum-control="' + view + '"]').click();
            await page.waitForFunction((imageSelector) => {
              const img = document.querySelector(imageSelector);
              return img && img.complete && img.naturalWidth > 0 && img.getBoundingClientRect().width > 0;
            }, selector, { timeout: 15000 });
            const imageName = prefix + '--view-' + view + '.png';
            await page.locator('.serum-photo').screenshot({ path: path.join(outDir, imageName), animations: 'disabled' });
            interactiveScreenshots.push(imageName);
          }
        }

        const result = {
          route: route.path,
          page: route.name,
          viewport: viewport.name,
          navigationStatus,
          navigationError,
          metrics,
          consoleErrors,
          pageErrors,
          failedRequests,
          badResponses,
          screenshots: [prefix + '--viewport.png', prefix + '--full.png'],
          interactiveScreenshots,
        };
        results.push(result);
        await fs.promises.writeFile(path.join(outDir, prefix + '.json'), JSON.stringify(result, null, 2));
      } catch (error) {
        navigationError = String(error);
        results.push({ route: route.path, page: route.name, viewport: viewport.name, navigationStatus, navigationError, consoleErrors, pageErrors, failedRequests, badResponses });
      } finally {
        await page.close();
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const issues = [];
for (const r of results) {
  if (r.navigationStatus !== 200) issues.push(r.page + '/' + r.viewport + ': HTTP status ' + r.navigationStatus + (r.navigationError ? ' — ' + r.navigationError : ''));
  if (r.metrics?.documentWidth > r.metrics?.viewportWidth + 1) issues.push(r.page + '/' + r.viewport + ': horizontal page overflow ' + r.metrics.documentWidth + 'px > ' + r.metrics.viewportWidth + 'px');
  if (r.metrics?.brokenImages?.length) issues.push(r.page + '/' + r.viewport + ': ' + r.metrics.brokenImages.length + ' broken visible images');
  if (r.metrics?.incompleteVisibleImages?.length) issues.push(r.page + '/' + r.viewport + ': ' + r.metrics.incompleteVisibleImages.length + ' visible images did not finish loading');
  if (r.pageErrors?.length) issues.push(r.page + '/' + r.viewport + ': JavaScript page errors: ' + r.pageErrors.join(' | '));
  const sameOriginBadResponses = (r.badResponses || []).filter(item => item.url.startsWith(baseURL));
  if (sameOriginBadResponses.length) issues.push(r.page + '/' + r.viewport + ': same-origin HTTP errors: ' + JSON.stringify(sameOriginBadResponses));
  const sameOriginFailedRequests = (r.failedRequests || []).filter(item => item.url.startsWith(baseURL));
  if (sameOriginFailedRequests.length) issues.push(r.page + '/' + r.viewport + ': same-origin failed requests: ' + JSON.stringify(sameOriginFailedRequests));
}
await fs.promises.writeFile(path.join(outDir, 'report.json'), JSON.stringify({ baseURL, generatedAt: new Date().toISOString(), results, issues }, null, 2));

const cards = results.map(r => {
  const title = r.page + ' / ' + r.viewport;
  const imgs = [...(r.screenshots || []), ...(r.interactiveScreenshots || [])].map(s => '<a href="' + s + '"><img src="' + s + '" alt="' + s + '"></a>').join('');
  const state = r.navigationStatus === 200 && !r.navigationError ? 'Captured' : 'FAILED';
  const detail = r.metrics ? '<p>HTTP ' + r.navigationStatus + ' · viewport ' + r.metrics.viewportWidth + 'px · document ' + r.metrics.documentWidth + 'px · ' + r.metrics.documentHeight + 'px tall · ' + r.metrics.images.length + ' images · ' + r.metrics.brokenImages.length + ' broken · ' + (r.metrics.incompleteVisibleImages || []).length + ' incomplete visible</p>' : '<p>' + (r.navigationError || 'No metrics') + '</p>';
  return '<section><h2>' + title + ' — ' + state + '</h2>' + detail + '<div class="shots">' + imgs + '</div></section>';
}).join('');
const html = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>RAWAA Visual QA</title><style>body{font:16px system-ui;margin:24px;background:#f5f4f0;color:#222}h1{margin-bottom:4px}section{background:white;border:1px solid #ddd;border-radius:12px;padding:18px;margin:18px 0}h2{font-size:18px}.shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}.shots img{width:100%;height:auto;border:1px solid #ddd;border-radius:8px}pre{white-space:pre-wrap}</style><h1>RAWAA Visual QA</h1><p>Base URL: ' + baseURL + '</p><p>Generated: ' + new Date().toISOString() + '</p><h2>Findings (' + issues.length + ')</h2><pre>' + (issues.length ? issues.join('\n') : 'No critical automated findings.') + '</pre>' + cards + '</html>';
await fs.promises.writeFile(path.join(outDir, 'index.html'), html);
console.log(JSON.stringify({ pages: results.length, issues, report: path.join(outDir, 'index.html') }, null, 2));
if (issues.length) process.exitCode = 1;
