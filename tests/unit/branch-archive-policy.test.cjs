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

test('archives reviewed merged refs only at their exact SHAs', () => {
  const reviewed = {
    'performance/fix-serum-image-preload-2026-11-15': '9368c47535062ad147bafba2632a899adac2c2fe',
    'performance/trim-serum-css-2026-11-15': '1449c8579d43b5535ef90d956daa8917c4e860a3',
    'fix/mobile-header-buttons-colors-2026-11-15': '6d9887c48cbbbd5eb9c0bf84a97acb6db2bfaf95',
  };
  assert.deepEqual(ARCHIVE_BRANCHES, reviewed);
  const branches = Object.entries(reviewed).map(([name, sha]) => branch(name, sha));
  assert.deepEqual(selectArchiveCandidates(branches, [], repository).map(x => x.name), Object.keys(reviewed));
  for (const [name, sha] of Object.entries(reviewed)) {
    assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
    assert.equal(expectedArchiveShaMatches(branch(name, 'changed-sha')), false);
  }
  assert.deepEqual(
    selectArchiveCandidates(branches, [pull('performance/fix-serum-image-preload-2026-11-15')], repository).map(x => x.name),
    ['performance/trim-serum-css-2026-11-15', 'fix/mobile-header-buttons-colors-2026-11-15'],
  );
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
