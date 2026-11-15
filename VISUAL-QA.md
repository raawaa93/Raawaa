# RAWAA Visual QA

This isolated, read-only audit captures the production storefront without changing or deploying it.

## What it checks

- Home, serum, campaign, and privacy pages.
- iPhone 13 emulation at 390px and desktop at 1440px.
- HTTP navigation status, Arabic RTL metadata, loaded fonts, image health, browser console/page errors, failed requests, and horizontal overflow.
- The serum image selector's bottle, sizes, and ritual views, including screenshots after each interaction.

## Run

The GitHub Actions workflow runs after successful production CI on `main`, every Monday at 03:17 UTC, and on pushes to `qa/visual-audit-*`. It can also be started manually from Actions.

Each run uploads an artifact containing viewport screenshots, full-page screenshots, serum interactive-view captures, per-page JSON diagnostics, and a self-contained HTML report. The workflow is read-only against the production website.


## Current-production-equivalent refresh procedure

The preview workflow intentionally checks out canonical `main` and deploys it to the isolated Pages preview branch `raawaa-recovery-preview`; it does not deploy the trigger branch's contents and does not publish to production. The visual QA workflow runs after that preview workflow completes successfully and tests the preview URL.

To refresh the screenshots for the currently deployed storefront, create a meaningful update on a `preview-deploy/**` branch. The preview workflow builds the exact current `main` source, then the visual QA workflow captures the four public pages on iPhone 13 emulation (390px) and desktop (1440px), in Chromium and WebKit, plus the serum selector's sizes and ritual states. The audit checks HTTP status, Arabic RTL metadata, font loading, image health, browser errors, failed requests, and horizontal overflow. It is read-only and must never submit a real order or send a WhatsApp message.


## WebKit strict-CSP screenshot handling

The visual audit must not use Playwright screenshot option `animations: 'disabled'`. In WebKit, that option injects an inline stylesheet for screenshot capture, which is rejected by the site's strict `style-src 'self'` policy and creates one false console error per screenshot. Keep reduced-motion emulation at browser-context level, allow the existing page-settle wait, and capture screenshots without the injected stylesheet. Do not weaken the site's Content Security Policy to accommodate the test harness. The JSON report also records viewport, visual-viewport, and screen heights so mobile emulation can be checked explicitly.


### Mobile viewport integrity

The visual report records the CSS viewport height, visual viewport height, and physical screen height alongside the viewport width. The Playwright iPhone 13 profile is expected to report a 390 × 844 CSS viewport; if the measured height differs, treat the device emulation as suspect and correct the profile before describing the result as iPhone 13 coverage. Screenshot files may be device-scale-factor pixels (for example, 3× width and height), so compare normalized CSS dimensions rather than raw PNG dimensions.


## Latest production audit — 2026-11-15

- Run: https://github.com/raawaa93/Raawaa/actions/runs/43678920501
- Artifact: `rawaa-visual-qa-43678920501` (32 standard viewport/full-page captures, 8 interactive serum captures, per-page JSON, and HTML report).
- Coverage: home, serum, campaign, and privacy; Chromium and WebKit; iPhone 13 emulation and desktop 1440px. Sixteen route/engine/viewport combinations completed.
- All 16 navigations returned HTTP 200. No broken visible images, horizontal overflow, browser console errors, page errors, failed requests, bad responses, or real CSP violations were reported. All 16 viewport screenshots recorded `screenshotScrollY = 0` and `visualViewportOffsetTop = 0`.
- **Viewport geometry caveat:** the run reported iPhone CSS viewport 390×664 while physical screen height was 844. That does not satisfy the documented 390×844 emulation target. The harness now explicitly sets both viewport and screen to 390×844; a fresh run must confirm the resulting metrics before iPhone coverage is marked fully verified.
- Manual screenshot review found a faint ghosted text layer behind the WebKit home-page header. It is not a console/CSP failure and needs a focused rendering investigation.
- The serum page, size/mix selector, campaign offer, and privacy page rendered without layout overflow. The homepage has generous vertical spacing before the hero; review whether this is intentional for mobile conversion.
- **Launch readiness:** the privacy page visibly remains a draft requiring legal/regulatory review before commercial launch. Product imagery is still labelled as conceptual design, not actual product photography; real product photos remain a launch-quality requirement.
