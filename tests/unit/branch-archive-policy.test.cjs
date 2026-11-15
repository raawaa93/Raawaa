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

test('final archive allowlist contains only the three exact reviewed remaining refs', () => {
  assert.deepEqual(ARCHIVE_BRANCHES, {
    'docs/workspace-hygiene-2026-11-15': '10e76ec9ed8de51cca6aad0451281f18513615b0',
    'fix/visual-audit-top-viewport-clean-2026-11-15': 'c0ccb2db0657d414885e68f16b8b79c9f73b4531',
    'maintenance/archive-inactive-branches-final-2026-11-15': 'ad3aaa80e47f2a4d823d85123f30c27726fb206d',
  });
  for (const [name, sha] of Object.entries(ARCHIVE_BRANCHES)) {
    assert.equal(isProtectedBranch({ name, protected: false }), false, name);
    assert.match(sha, /^[a-f0-9]{40}$/u, name);
  }
});

test('selects only reviewed refs whose exact SHA is unchanged', () => {
  const branches = Object.entries(ARCHIVE_BRANCHES).map(([name, sha]) => branch(name, sha));
  assert.deepEqual(
    selectArchiveCandidates(branches, [], repository).map(x => x.name).sort(),
    Object.keys(ARCHIVE_BRANCHES).sort(),
  );
});

test('preserves every reviewed branch if its head changes after review', () => {
  for (const [name] of Object.entries(ARCHIVE_BRANCHES)) {
    assert.equal(expectedArchiveShaMatches(branch(name, 'changed-after-review')), false);
    assert.deepEqual(selectArchiveCandidates([branch(name, 'changed-after-review')], [], repository), []);
  }
});

test('preserves a reviewed branch while a same-repository PR is open', () => {
  const name = 'docs/workspace-hygiene-2026-11-15';
  assert.deepEqual(
    selectArchiveCandidates([branch(name, ARCHIVE_BRANCHES[name])], [pull(name, 'open')], repository),
    [],
  );
});

test('does not treat a fork PR with the same head name as an active repository PR', () => {
  const name = 'docs/workspace-hygiene-2026-11-15';
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
