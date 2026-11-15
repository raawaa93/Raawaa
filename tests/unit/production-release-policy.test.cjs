'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const workflowPath = path.join(process.cwd(), '.github/workflows/production-cicd.yml');
const workflow = fs.readFileSync(workflowPath, 'utf8');

test('validated pushes to canonical main deploy automatically without manual approval', () => {
  assert.match(workflow, /^on:\s*\n\s+push:/m);
  assert.doesNotMatch(workflow, /workflow_dispatch|confirm_production/);
  assert.doesNotMatch(workflow, /environment:\s*\n\s+name:\s*production/);
  assert.match(workflow, /if: github\.ref == 'refs\/heads\/main' && github\.event_name == 'push'/);
});

test('workflow-only and maintenance changes are ignored by production release triggers', () => {
  const ignored = workflow.split('paths-ignore:')[1]?.split('\n\npermissions:')[0] || '';
  for (const file of [
    '.github/workflows/**',
    'scripts/check-site.mjs',
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

test('site integrity policy agrees with automatic validated production releases', () => {
  const siteCheck = fs.readFileSync(path.join(process.cwd(), 'scripts/check-site.mjs'), 'utf8');
  assert.match(siteCheck, /Production deploy must run automatically after validated canonical main push/u);
  assert.match(siteCheck, /A main push must deploy to production after successful validation/u);
  assert.doesNotMatch(siteCheck, /explicit yes\/no owner confirmation|explicit confirmed dispatch/u);
});

test('stale-source guard fetches full main history before ancestry comparison', () => {
  assert.match(workflow, /git fetch --no-tags origin main\n/);
  assert.doesNotMatch(workflow, /git fetch --no-tags origin main --depth=1/);
  assert.match(workflow, /git merge-base --is-ancestor/);
});
