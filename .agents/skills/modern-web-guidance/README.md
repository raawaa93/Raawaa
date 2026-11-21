# Modern Web Guidance — RAWAA pin

- Upstream: https://github.com/GoogleChrome/modern-web-guidance
- Source commit: `64a6d708f5a43f2cd3fde5d4d7db3905ba1bdf65`
- CLI package: `modern-web-guidance@1.0.1`
- License: Apache-2.0 (see `LICENSE`)
- This is the upstream skill file, not a forked or rewritten copy.

For this repository, pin the CLI version and disable telemetry. Example:

```sh
DISABLE_TELEMETRY=1 npx -y modern-web-guidance@1.0.1 search "responsive image loading"
DISABLE_TELEMETRY=1 npx -y modern-web-guidance@1.0.1 retrieve "<guide-id>"
```

Use a separate focused search for each platform capability. Apply the guidance only where it fits the existing vanilla HTML/CSS/JS architecture and Safari/WebKit support requirements. Do not add a runtime dependency or copy generated output into production assets. This CLI is a development-time tool only.
