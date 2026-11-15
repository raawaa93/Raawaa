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

test('archive allowlist is unique, explicit, SHA-pinned, and excludes operational namespaces', () => {
  const names = Object.keys(ARCHIVE_BRANCHES);
  assert.equal(new Set(names).size, names.length);
  assert.equal(names.length, 29);
  for (const name of names) {
    assert.equal(isProtectedBranch({ name, protected: false }), false, name);
    assert.match(ARCHIVE_BRANCHES[name], /^[a-f0-9]{40}$/u, name + ' must have a fixed 40-character commit SHA');
  }
  for (const prefix of ['backup/', 'recovery/', 'restore/', 'release/', 'production-deploy/', 'deploy/', 'preview-deploy/']) {
    assert.equal(names.some(name => name.startsWith(prefix)), false, prefix);
  }
});

test('selects only reviewed branches whose recorded SHA is unchanged', () => {
  const reviewed = Object.keys(ARCHIVE_BRANCHES);
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

test('pins the moved no-PR inventory branch to its exact reviewed head', () => {
  const name = 'maintenance/final-inventory-cleanup-2026-11-15';
  const sha = 'f262cd055a5af74c1513efde0ff890a90941bb76';
  assert.equal(ARCHIVE_BRANCHES[name], sha);
  assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
  assert.equal(expectedArchiveShaMatches(branch(name, 'changed-after-review')), false);
});

test('merged documentation and visual-QA refs are retired by the merged-ref policy, not archived twice', () => {
  assert.equal(Object.prototype.hasOwnProperty.call(ARCHIVE_BRANCHES, 'docs/workspace-hygiene-2026-11-15'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(ARCHIVE_BRANCHES, 'fix/visual-audit-top-viewport-clean-2026-11-15'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(ARCHIVE_BRANCHES, 'maintenance/archive-inactive-branches-2026-11-15'), false);
});
