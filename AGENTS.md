# RAWAA Store agent guidance

## Source of truth
- Treat this repository's current main branch and owner-confirmed policy as authoritative.
- Preserve the existing static-site architecture unless a measured need justifies a change.
- Keep the 10% Sham Cash-only discount and free delivery for every payment method.
- Never invent product photography, customer reviews, testimonials, prices, or business credentials.
- Do not publish or deploy production changes from a feature branch. Use a preview and explicit approval.

## Design and implementation skills
Use these upstream skills as specialist references when a Codex environment has them installed:
- Emil Kowalski design engineering: https://github.com/emilkowalski/skills (MIT). Install the upstream collection with `npx skills@latest add emilkowalski/skills -a codex`.
- Taste Skill: https://github.com/Leonxlnx/taste-skill (MIT). The upstream README documents the Codex plugin installation:
  `codex plugin marketplace add Leonxlnx/taste-skill`
  `codex plugin add taste-skill@taste-skill`
  Start a new Codex session after installation. The skill is named `design-taste-frontend`; do not refer to the older/unverified `gpt-tasteskill` name.
- Figma MCP is connected through the user's Figma integration. Inspect the actual file and available edit permissions before making changes.

These upstream skills are not vendored into this repository. Install them in the Codex workspace using the commands above; do not claim they are active merely because this file references them. Taste Skill's full checks expect its accompanying assets/scripts, Node 22+, and Chrome/Chromium. Do not copy only its SKILL.md and pretend the bundle is complete.

## Browser testing
- Run `npm install` once, then `npx playwright install chromium webkit`.
- Run `npm run test:e2e` for route and responsive-overflow smoke tests in Chromium, desktop Safari (WebKit), and iPhone WebKit.
- Add tests for every user-visible critical journey before changing cart, pricing, or WhatsApp behavior.
- Prefer deterministic Playwright assertions over AI-driven browser automation for repeatable checks.
- Use Browser Use only for exploratory tasks that require agentic navigation; use Crawl4AI for public-page extraction. Neither replaces Playwright regression tests.
