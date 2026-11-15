'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const workflowPath = path.join(process.cwd(), '.github/workflows/production-cicd.yml');
const workflow = fs.readFileSync(workflowPath, 'utf8');

test('production releases are push-only after canonical main validation', () => {
  assert.match(workflow, /^on:\s*\n\s+push:/m);
  assert.doesNotMatch(workflow, /^\s*workflow_dispatch:/m);
  assert.match(workflow, /if: github\.ref == 'refs\/heads\/main' && github\.event_name == 'push'/);
});

test('maintenance and visual-audit helpers are ignored by production release triggers', () => {
  const ignored = workflow.split('paths-ignore:')[1]?.split('\n\npermissions:')[0] || '';
  for (const file of [
    'scripts/branch-cleanup-policy.cjs',
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
    'scripts/visual-audit.mjs',
    'scripts/visual-audit-csp-policy.cjs',
  ]) {
    assert.ok(guard.includes(file), file + ' must be treated as maintenance-only by the stale-source guard');
  }
});

test('site integrity policy agrees with push-only production release workflow', () => {
  const siteCheck = fs.readFileSync(path.join(process.cwd(), 'scripts/check-site.mjs'), 'utf8');
  assert.match(siteCheck, /github\\.event_name == 'push'/u);
  assert.doesNotMatch(siteCheck, /workflow_dispatch|confirm_production/u);
});
