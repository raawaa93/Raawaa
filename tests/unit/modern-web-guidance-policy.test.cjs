'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');

test('Modern Web Guidance uses the pinned CLI with telemetry disabled', () => {
  const skill = fs.readFileSync(path.join(root, '.agents/skills/modern-web-guidance/SKILL.md'), 'utf8');
  const readme = fs.readFileSync(path.join(root, '.agents/skills/modern-web-guidance/README.md'), 'utf8');
  const commands = skill.split('\n').filter(line => /npx .*modern-web-guidance/.test(line));

  assert.ok(commands.length >= 3, 'expected search, retrieve, and legacy-scan examples');
  for (const command of commands) {
    assert.match(command, /DISABLE_TELEMETRY=1 npx -y modern-web-guidance@1\.0\.1/);
    assert.doesNotMatch(command, /modern-web-guidance@latest/);
  }
  assert.match(readme, /CLI package: `modern-web-guidance@1\.0\.1`/);
  assert.match(readme, /DISABLE_TELEMETRY=1/);
});

test('Modern Web Guidance is scoped to material browser-platform work', () => {
  const skill = fs.readFileSync(path.join(root, '.agents/skills/modern-web-guidance/SKILL.md'), 'utf8');
  const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');

  assert.doesNotMatch(skill, /MANDATORY: Execute FIRST for all HTML\/CSS/);
  assert.match(skill, /Skip simple copy\/text\/markup edits/);
  assert.match(agents, /Skip trivial copy\/text\/markup edits/);
  assert.match(skill, /do not bypass sandbox or account controls/i);
});
