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

test('only the final closed-unmerged inventory branch is pinned for archival', () => {
  assert.deepEqual(ARCHIVE_BRANCHES, {
    'docs/final-branch-inventory-2026-11-15': 'eaad2be711bec297bf298c6d78e5c46df8be327f',
  });
});

test('archives only the exact reviewed branch head', () => {
  const name = 'docs/final-branch-inventory-2026-11-15';
  assert.equal(expectedArchiveShaMatches(branch(name, ARCHIVE_BRANCHES[name])), true);
  assert.deepEqual(
    selectArchiveCandidates([branch(name, ARCHIVE_BRANCHES[name])], [], repository).map(x => x.name),
    [name],
  );
  assert.deepEqual(selectArchiveCandidates([branch(name, 'changed')], [], repository), []);
});

test('preserves the reviewed branch while a same-repository PR is open', () => {
  const name = 'docs/final-branch-inventory-2026-11-15';
  assert.deepEqual(
    selectArchiveCandidates([branch(name, ARCHIVE_BRANCHES[name])], [pull(name, 'open')], repository),
    [],
  );
});

test('does not treat a fork PR with the same head name as an active repository PR', () => {
  const name = 'docs/final-branch-inventory-2026-11-15';
  assert.deepEqual(
    selectArchiveCandidates(
      [branch(name, ARCHIVE_BRANCHES[name])],
      [pull(name, 'open', 'contributor/Raawaa')],
      repository,
    ).map(x => x.name),
    [name],
  );
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
