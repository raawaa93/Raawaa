'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ARCHIVE_BRANCHES,
  isProtectedBranch,
  expectedArchiveShaMatches,
  selectArchiveCandidates,
} = require('../../scripts/branch-archive-policy.cjs');

const repository = 'raawaa93/Raawaa';
const branch = (name, sha = 'head-sha', protectedBranch = false) => ({
  name, protected: protectedBranch, commit: { sha },
});
const pull = (ref, state = 'open', owner = repository) => ({
  state, head: { ref, repo: { full_name: owner } },
});

test('archive allowlist is cleared after the PR116 exact-SHA tag is verified', () => {
  assert.deepEqual(ARCHIVE_BRANCHES, {});
  assert.equal(expectedArchiveShaMatches(branch("maintenance/record-pr113-archive-2026-11-15", "1415d8dcac9ca2113626659d4454b2450b42b423")), false);
  assert.deepEqual(selectArchiveCandidates([branch("maintenance/record-pr113-archive-2026-11-15", "1415d8dcac9ca2113626659d4454b2450b42b423")], [], repository), []);
});

test('does not re-archive any retired ref if a stale branch is recreated', () => {
  const names = [
    'docs/workspace-hygiene-2026-11-15',
    'fix/visual-audit-top-viewport-clean-2026-11-15',
    'maintenance/archive-inactive-branches-final-2026-11-15',
    'maintenance/retire-last-stale-refs-2026-11-15',
  ];
  for (const name of names) {
    assert.equal(expectedArchiveShaMatches(branch(name)), false);
    assert.deepEqual(selectArchiveCandidates([branch(name)], [], repository), []);
  }
});

test('preserves main, protected refs, and all operational namespaces', () => {
  const names = [
    'main', 'backup/checkpoint', 'recovery/source', 'restore/current',
    'release/current', 'production-deploy/current', 'deploy/canary',
    'preview-deploy/current',
  ];
  const branches = names.map(name => branch(name, 'head-sha', name === 'backup/checkpoint'));
  assert.ok(branches.every(isProtectedBranch));
  assert.deepEqual(selectArchiveCandidates(branches, [], repository), []);
});

test('does not archive unknown refs, even when a same-name fork PR exists', () => {
  const name = 'feature/unreviewed';
  assert.deepEqual(
    selectArchiveCandidates([branch(name)], [pull(name, 'open', 'contributor/Raawaa')], repository),
    [],
  );
});
