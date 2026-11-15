'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { classifyBranches, SUPERSEDED_CLOSED_PR_BRANCHES, STALE_NO_PR_BRANCHES } = require('../../scripts/branch-cleanup-policy.cjs');

const repository = 'raawaa93/Raawaa';
const branch = (name, protectedBranch = false) => ({ name, protected: protectedBranch });
const pr = (ref, { state = 'closed', merged = false, owner = repository } = {}) => ({
  state,
  merged_at: merged ? '2026-11-15T00:00:00Z' : null,
  head: { ref, repo: { full_name: owner } },
});

test('prunes a merged same-repository feature branch', () => {
  const result = classifyBranches([branch('fix/merged')], [pr('fix/merged', { merged: true })], repository);
  assert.deepEqual(result.map(x => x.name), ['fix/merged']);
});

test('preserves closed-unmerged work unless explicitly superseded', () => {
  const result = classifyBranches([branch('feature/unresolved')], [pr('feature/unresolved')], repository);
  assert.deepEqual(result, []);
});

test('prunes only reviewed superseded closed-unmerged branches', () => {
  const name = 'ci/restore-release-boundaries-2026-11-15-rebased';
  assert.ok(SUPERSEDED_CLOSED_PR_BRANCHES.includes(name));
  const result = classifyBranches([branch(name)], [pr(name)], repository);
  assert.deepEqual(result.map(x => x.name), [name]);
});

test('protects a branch referenced by an open PR even if another PR was merged', () => {
  const result = classifyBranches([branch('qa/reused')], [
    pr('qa/reused', { merged: true }),
    pr('qa/reused', { state: 'open' }),
  ], repository);
  assert.deepEqual(result, []);
});

test('preserves backup and recovery namespaces even after merge', () => {
  const names = ['backup/checkpoint', 'recovery/source'];
  const result = classifyBranches(names.map(name => branch(name)), names.map(name => pr(name, { merged: true })), repository);
  assert.deepEqual(result, []);
});

test('preserves protected branches', () => {
  const result = classifyBranches([branch('fix/protected', true)], [pr('fix/protected', { merged: true })], repository);
  assert.deepEqual(result, []);
});

test('never deletes a fork branch', () => {
  const result = classifyBranches([branch('feature/fork')], [pr('feature/fork', { merged: true, owner: 'contributor/Raawaa' })], repository);
  assert.deepEqual(result, []);
});

test('prunes only the explicitly reviewed stale preview/deploy refs', () => {
  const name = 'preview-deploy/2026-11-15-post-fix';
  assert.ok(STALE_NO_PR_BRANCHES.includes(name));
  const result = classifyBranches([branch(name)], [], repository);
  assert.deepEqual(result.map(x => x.name), [name]);
});

test('does not prune an arbitrary unreferenced branch', () => {
  const result = classifyBranches([branch('work/unknown')], [], repository);
  assert.deepEqual(result, []);
});
