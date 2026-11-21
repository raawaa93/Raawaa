# Modern Web Guidance — RAWAA pin

- Upstream: https://github.com/GoogleChrome/modern-web-guidance
- Source commit: `64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65`
- CLI package: `modern-web-guidance@1.0.1`
- License: Apache-2.0 (see `LICENSE`)
- This is a local adaptation of the upstream skill at the pinned source commit. It preserves the guidance while scoping triggers and pinning the CLI/telemetry behavior to RAWAA's development policy.

For this repository, pin the CLI version and disable telemetry. Example:

```sh
DISABLE_TELEMETRY=1 npx -y modern-web-guidance@1.0.1 search "responsive image loading"
DISABLE_TELEMETRY=1 npx -y modern-web-guidance@1.0.1 retrieve "<guide-id>"
```

Use a separate focused search for each relevant platform capability. Skip trivial copy/markup tasks. Apply guidance only where it fits the existing vanilla HTML/CSS/JS architecture and Safari/WebKit requirements. Do not include customer data, secrets, private URLs, or proprietary source in queries. If network access is blocked, do not bypass controls. Do not add a runtime dependency or copy generated output into production assets; this CLI is development-time only.
