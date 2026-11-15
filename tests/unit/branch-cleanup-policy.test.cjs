'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { classifyBranches } = require('../../scripts/branch-cleanup-policy.cjs');

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

test('preserves closed-unmerged work', () => {
  const result = classifyBranches([branch('feature/unresolved')], [pr('feature/unresolved')], repository);
  assert.deepEqual(result, []);
});

test('preserves a branch reused by both a merged and closed-unmerged PR', () => {
  const result = classifyBranches([branch('qa/reused')], [
    pr('qa/reused', { merged: true }),
    pr('qa/reused'),
  ], repository);
  assert.deepEqual(result, []);
});

test('preserves a branch referenced by an open PR even if another PR was merged', () => {
  const result = classifyBranches([branch('qa/open')], [
    pr('qa/open', { merged: true }),
    pr('qa/open', { state: 'open' }),
  ], repository);
  assert.deepEqual(result, []);
});

test('preserves backup and recovery namespaces even after merge', () => {
  const names = ['backup/checkpoint', 'recovery/source'];
  const result = classifyBranches(names.map(name => branch(name)), names.map(name => pr(name, { merged: true })), repository);
  assert.deepEqual(result, []);
});

test('preserves protected branches and main', () => {
  const result = classifyBranches([branch('fix/protected', true), branch('main')], [
    pr('fix/protected', { merged: true }), pr('main', { merged: true }),
  ], repository);
  assert.deepEqual(result, []);
});

test('never deletes a fork branch', () => {
  const result = classifyBranches([branch('feature/fork')], [
    pr('feature/fork', { merged: true, owner: 'contributor/Raawaa' }),
  ], repository);
  assert.deepEqual(result, []);
});

test('does not prune an arbitrary unreferenced branch, including previews', () => {
  const result = classifyBranches([branch('work/unknown'), branch('preview-deploy/current')], [], repository);
  assert.deepEqual(result, []);
});
