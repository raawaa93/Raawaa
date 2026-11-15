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


## WebKit strict-CSP handling

Playwright 1.64+ with WebKit 27.2 has an upstream regression where the browser's own user-agent styling for native <select> controls can emit a false `style-src-attr` CSP event. The known signature is narrowly defined: WebKit only, `violatedDirective=style-src-attr`, `blockedURI=inline`, empty `sourceFile`, `lineNumber=1`, event target `SELECT`, and no author `style` attribute on that element. The audit records every CSP event and ignores only this exact signature; all other CSP events and console errors remain failures. See [Playwright issue #43497](https://github.com/microsoft/playwright/issues/43497) and upstream WebKit bug [327212](https://bugs.webkit.org/show_bug.cgi?id=327212).

Do not weaken the site's Content Security Policy or add `unsafe-inline`. Remove the exception when the Playwright-bundled WebKit includes the upstream fix. The audit captures CSP events through page load and interactive selector states, then classifies them after all screenshots.

### Mobile viewport integrity

The current Playwright iPhone 13 profile reports a 390px CSS viewport with a 664px content height and an 844px screen height in this runner. The difference reflects the emulated browser's visible content area; it is not, by itself, a device-profile failure. The report records `viewportHeight`, `visualViewportHeight`, and `screenHeight` separately. Compare normalized CSS dimensions rather than raw PNG pixels (the device scale factor can produce 3× screenshots).
