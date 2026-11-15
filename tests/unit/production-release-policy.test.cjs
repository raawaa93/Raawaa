'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const workflowPath = path.join(process.cwd(), '.github/workflows/production-cicd.yml');
const workflow = fs.readFileSync(workflowPath, 'utf8');

test('main pushes validate but cannot deploy; production requires explicit confirmed dispatch', () => {
  assert.match(workflow, /^on:\s*\n\s+push:/m);
  assert.match(workflow, /^\s*workflow_dispatch:/m);
  assert.match(workflow, /confirm_production:[\s\S]*?required: true[\s\S]*?options:[\s\S]*?- no[\s\S]*?- yes/);
  assert.match(workflow, /if: github\.ref == 'refs\/heads\/main' && github\.event_name == 'workflow_dispatch' && inputs\.confirm_production == 'yes'/);
  assert.doesNotMatch(workflow, /if: github\.ref == 'refs\/heads\/main' && github\.event_name == 'push'/);
});

test('maintenance and visual-audit helpers are ignored by production release triggers', () => {
  const ignored = workflow.split('paths-ignore:')[1]?.split('\n\npermissions:')[0] || '';
  for (const file of [
    'scripts/branch-cleanup-policy.cjs',
    'scripts/branch-archive-policy.cjs',
    'scripts/visual-audit.mjs',
    'scripts/visual-audit-csp-policy.cjs',
  ]) {
    assert.ok(ignored.includes(file), file + ' must not trigger a production release');
  }
});

test('stale-source guard recognizes all maintenance and visual-audit helpers', () => {
  const guard = workflow.match(/case "\$file" in([\s\S]*?)esac/)?.[1] || '';
  for (const file of [
    'scripts/branch-cleanup-policy.cjs',
    'scripts/branch-archive-policy.cjs',
    'scripts/visual-audit.mjs',
    'scripts/visual-audit-csp-policy.cjs',
  ]) {
    assert.ok(guard.includes(file), file + ' must be treated as maintenance-only by the stale-source guard');
  }
});

test('site integrity policy agrees with the explicit production approval gate', () => {
  const siteCheck = fs.readFileSync(path.join(process.cwd(), 'scripts/check-site.mjs'), 'utf8');
  assert.match(siteCheck, /Production release must require an explicit yes\/no owner confirmation/u);
  assert.match(siteCheck, /Production deploy must require an explicit confirmed dispatch from canonical main/u);
  assert.match(siteCheck, /A main push must never deploy to production automatically/u);
});

test('stale-source guard fetches full main history before ancestry comparison', () => {
  assert.match(workflow, /git fetch --no-tags origin main\n/);
  assert.doesNotMatch(workflow, /git fetch --no-tags origin main --depth=1/);
  assert.match(workflow, /git merge-base --is-ancestor/);
});
