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

test('preserves closed-unmerged work unless its head is already in main', () => {
  const keep = classifyBranches([branch('feature/unresolved')], [pr('feature/unresolved')], repository);
  const remove = classifyBranches([branch('feature/in-main')], [pr('feature/in-main')], repository, {
    'feature/in-main': { ahead_by: 0, behind_by: 3 },
  });
  assert.deepEqual(keep, []);
  assert.deepEqual(remove.map(x => x.name), ['feature/in-main']);
});

test('preserves a branch reused by both a merged and closed-unmerged PR unless fully contained in main', () => {
  const prs = [pr('qa/reused', { merged: true }), pr('qa/reused')];
  assert.deepEqual(classifyBranches([branch('qa/reused')], prs, repository), []);
  assert.deepEqual(
    classifyBranches([branch('qa/reused')], prs, repository, { 'qa/reused': { ahead_by: 0 } }).map(x => x.name),
    ['qa/reused'],
  );
});

test('preserves a branch referenced by an open PR even if another PR was merged', () => {
  const result = classifyBranches([branch('qa/open')], [
    pr('qa/open', { merged: true }),
    pr('qa/open', { state: 'open' }),
  ], repository, { 'qa/open': { ahead_by: 0 } });
  assert.deepEqual(result, []);
});

test('preserves backup and recovery namespaces even when contained in main', () => {
  const names = ['backup/checkpoint', 'recovery/source'];
  const result = classifyBranches(names.map(name => branch(name)), [], repository,
    Object.fromEntries(names.map(name => [name, { ahead_by: 0 }])));
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

test('prunes an unreferenced branch only when its head is contained in main', () => {
  const result = classifyBranches(
    [branch('old/ancestor'), branch('work/unknown')],
    [],
    repository,
    { 'old/ancestor': { ahead_by: 0 }, 'work/unknown': { ahead_by: 2 } },
  );
  assert.deepEqual(result.map(x => x.name), ['old/ancestor']);
});

test('retains refs when comparison data is missing or the branch is ahead of main', () => {
  const result = classifyBranches(
    [branch('preview/current'), branch('work/unknown')],
    [],
    repository,
    { 'work/unknown': { ahead_by: 1 } },
  );
  assert.deepEqual(result, []);
});
