# RAWAA Visual QA

This isolated, read-only audit captures the production storefront without changing or deploying it.

## What it checks

- Home, serum, campaign, and privacy pages.
- iPhone 13 emulation at 390px and desktop at 1440px.
- HTTP navigation status, Arabic RTL metadata, loaded fonts, image health, browser console/page errors, failed requests, and horizontal overflow.
- The serum image selector's bottle, sizes, and ritual views, including screenshots after each interaction.

## Run

The GitHub Actions workflow runs on pushes to `main` and `qa/visual-audit-*`, and can be started manually from Actions.

Each run uploads an artifact containing viewport screenshots, full-page screenshots, serum interactive-view captures, per-page JSON diagnostics, and a self-contained HTML report. The workflow is read-only against the production website.
