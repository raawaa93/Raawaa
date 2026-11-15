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

test('retains the historical SHA pin but does not archive a changed live branch head', () => {
  const name = 'maintenance/retire-last-stale-refs-2026-11-15';
  const oldSha = '56bd0b22c9bd578d9739c01ab44b993c42f33a05';
  assert.deepEqual(ARCHIVE_BRANCHES, { [name]: oldSha });
  assert.equal(expectedArchiveShaMatches(branch(name, oldSha)), true);
  assert.equal(expectedArchiveShaMatches(branch(name, '88404f1c02dcc3db3768ab615d4a175f836d398c')), false);
  assert.deepEqual(
    selectArchiveCandidates([branch(name, '88404f1c02dcc3db3768ab615d4a175f836d398c')], [], repository),
    [],
  );
});

test('archives only the exact reviewed historical head', () => {
  const name = 'maintenance/retire-last-stale-refs-2026-11-15';
  const oldSha = ARCHIVE_BRANCHES[name];
  assert.deepEqual(
    selectArchiveCandidates([branch(name, oldSha)], [], repository).map(x => x.name),
    [name],
  );
  assert.deepEqual(selectArchiveCandidates([branch(name, 'changed')], [], repository), []);
});

test('preserves the reviewed branch while a same-repository PR is open', () => {
  const name = 'maintenance/retire-last-stale-refs-2026-11-15';
  assert.deepEqual(
    selectArchiveCandidates([branch(name, ARCHIVE_BRANCHES[name])], [pull(name, 'open')], repository),
    [],
  );
});

test('does not treat a fork PR with the same head name as an active repository PR', () => {
  const name = 'maintenance/retire-last-stale-refs-2026-11-15';
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
