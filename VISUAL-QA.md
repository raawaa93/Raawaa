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
