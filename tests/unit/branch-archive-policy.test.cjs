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

test('archive allowlist is unique, explicit, and excludes operational namespaces', () => {
  const names = Object.keys(ARCHIVE_BRANCHES);
  assert.equal(new Set(names).size, names.length);
  for (const name of names) {
    assert.equal(isProtectedBranch({ name, protected: false }), false, name);
  }
  for (const prefix of ['backup/', 'recovery/', 'restore/', 'release/', 'production-deploy/', 'deploy/', 'preview-deploy/']) {
    assert.equal(names.some(name => name.startsWith(prefix)), false, prefix);
  }
  assert.equal(Object.keys(ARCHIVE_BRANCHES).length, 31);
});

test('selects only reviewed branches whose recorded SHA is unchanged', () => {
  const reviewed = Object.keys(ARCHIVE_BRANCHES).filter(name => ARCHIVE_BRANCHES[name] !== null);
  const branches = reviewed.map(name => branch(name, ARCHIVE_BRANCHES[name]));
  const selected = selectArchiveCandidates(branches, [], repository);
  assert.deepEqual(selected.map(x => x.name).sort(), reviewed.sort());
});

test('preserves a branch when its head moved after the review snapshot', () => {
  const name = 'automation/generate-lockfile-2026-11-15';
  assert.equal(expectedArchiveShaMatches(branch(name, 'new-unreviewed-sha')), false);
  assert.deepEqual(selectArchiveCandidates([branch(name, 'new-unreviewed-sha')], [], repository), []);
});

test('preserves a reviewed branch while any same-repository PR is open', () => {
  const name = 'automation/generate-lockfile-2026-11-15';
  assert.deepEqual(selectArchiveCandidates(
    [branch(name, ARCHIVE_BRANCHES[name])],
    [pull(name, 'open')],
    repository,
  ), []);
});

test('does not treat a fork PR with the same head name as an active repository PR', () => {
  const name = 'automation/generate-lockfile-2026-11-15';
  const selected = selectArchiveCandidates(
    [branch(name, ARCHIVE_BRANCHES[name])],
    [pull(name, 'open', 'contributor/Raawaa')],
    repository,
  );
  assert.deepEqual(selected.map(x => x.name), [name]);
});

test('preserves main, protected refs, and every operational namespace', () => {
  const protectedNames = [
    'main',
    'backup/checkpoint',
    'recovery/source',
    'restore/integrated-store',
    'release/current',
    'production-deploy/current',
    'deploy/canary',
    'preview-deploy/current',
  ];
  const branches = protectedNames.map(name => branch(name, 'head-sha', name === 'backup/checkpoint'));
  assert.ok(branches.every(isProtectedBranch));
  assert.deepEqual(selectArchiveCandidates(branches, [], repository), []);
});

test('archives the maintenance workflow branch itself only after its PR is closed', () => {
  const name = 'maintenance/archive-inactive-branches-2026-11-15';
  const ref = branch(name, 'self-tip');
  assert.equal(expectedArchiveShaMatches(ref), true);
  assert.deepEqual(selectArchiveCandidates([ref], [pull(name, 'open')], repository), []);
  assert.deepEqual(selectArchiveCandidates([ref], [pull(name, 'closed')], repository).map(x => x.name), [name]);
});
