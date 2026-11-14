# RAWAA Store agent guidance

## Source of truth
- Treat this repository's current main branch and owner-confirmed policy as authoritative.
- Preserve the existing static-site architecture unless a measured need justifies a change.
- Keep the 10% Sham Cash-only discount and free delivery for every payment method.
- Never invent product photography, customer reviews, testimonials, prices, or business credentials.
- Do not publish or deploy production changes from a feature branch. Use a preview and explicit approval.

## Design and implementation skills
Use these upstream skills as specialist references when a Codex environment has them installed:
- Emil Kowalski design engineering: https://github.com/emilkowalski/skills (MIT). Install with `npx skills@latest add emilkowalski/skills -a codex`.
- Taste Skill: https://github.com/Leonxlnx/taste-skill. For GPT/Codex use its stable `gpt-tasteskill` skill where available; install with `npx skills@latest add Leonxlnx/taste-skill --skill gpt-tasteskill -a codex`.
- Figma MCP is connected through the user's Figma integration. Inspect the actual file and available edit permissions before making changes.

These upstream skills are not vendored into this repository. Install them in the Codex workspace using the commands above; do not claim they are active merely because this file references them. Taste Skill's full checks expect its accompanying assets/scripts and a Node 22+ browser environment. Do not copy only its SKILL.md and pretend the bundle is complete.

## Browser testing
- Run `npm install` once, then `npx playwright install chromium`.
- Run `npm run test:e2e` for the route and responsive-overflow smoke tests.
- Add tests for every user-visible critical journey before changing cart, pricing, or WhatsApp behavior.
- Prefer deterministic Playwright assertions over AI-driven browser automation for repeatable checks.
- Use Browser Use only for exploratory tasks that require agentic navigation; use Crawl4AI for public-page extraction. Neither replaces Playwright regression tests.
