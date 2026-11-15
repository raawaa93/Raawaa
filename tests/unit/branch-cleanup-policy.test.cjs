'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  classifyBranches,
  SUPERSEDED_CLOSED_PR_BRANCHES,
  STALE_NO_PR_BRANCHES,
} = require('../../scripts/branch-cleanup-policy.cjs');

const repository = 'raawaa93/Raawaa';
const branch = (name, { protectedBranch = false, sha = 'branch-head' } = {}) => ({
  name,
  protected: protectedBranch,
  commit: { sha },
});
const pr = (ref, { state = 'closed', merged = false, owner = repository, sha = 'branch-head' } = {}) => ({
  state,
  merged_at: merged ? '2026-11-15T00:00:00Z' : null,
  head: { ref, sha, repo: { full_name: owner } },
});

test('prunes a merged branch only when its current head is the merged PR head', () => {
  const result = classifyBranches(
    [branch('fix/merged', { sha: 'same-sha' })],
    [pr('fix/merged', { merged: true, sha: 'same-sha' })],
    repository,
  );
  assert.deepEqual(result.map(x => x.name), ['fix/merged']);
});

test('preserves a branch updated after its merged PR unless the new head is in main', () => {
  const prs = [pr('fix/reused', { merged: true, sha: 'old-sha' })];
  assert.deepEqual(classifyBranches([branch('fix/reused', { sha: 'new-sha' })], prs, repository), []);
  assert.deepEqual(
    classifyBranches([branch('fix/reused', { sha: 'new-sha' })], prs, repository, {
      'fix/reused': { ahead_by: 0, behind_by: 4 },
    }).map(x => x.name),
    ['fix/reused'],
  );
});

test('preserves closed-unmerged work unless its head is already in main', () => {
  const keep = classifyBranches([branch('feature/unresolved')], [pr('feature/unresolved')], repository);
  const remove = classifyBranches([branch('feature/in-main')], [pr('feature/in-main')], repository, {
    'feature/in-main': { ahead_by: 0, behind_by: 3 },
  });
  assert.deepEqual(keep, []);
  assert.deepEqual(remove.map(x => x.name), ['feature/in-main']);
});

test('prunes only explicitly reviewed superseded closed-unmerged branches', () => {
  const name = 'ci/restore-release-boundaries-2026-11-15-rebased';
  assert.ok(SUPERSEDED_CLOSED_PR_BRANCHES.includes(name));
  const result = classifyBranches([branch(name)], [pr(name)], repository, {
    [name]: { ahead_by: 4, behind_by: 8 },
  });
  assert.deepEqual(result.map(x => x.name), [name]);
});

test('preserves a branch reused by merged and closed-unmerged PRs unless explicitly superseded or contained in main', () => {
  const prs = [pr('qa/reused', { merged: true, sha: 'old-sha' }), pr('qa/reused', { sha: 'new-sha' })];
  assert.deepEqual(classifyBranches([branch('qa/reused', { sha: 'new-sha' })], prs, repository), []);
  assert.deepEqual(
    classifyBranches([branch('qa/reused', { sha: 'new-sha' })], prs, repository, {
      'qa/reused': { ahead_by: 0 },
    }).map(x => x.name),
    ['qa/reused'],
  );
});

test('protects a branch referenced by an open PR even if another PR was merged', () => {
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
  const result = classifyBranches([branch('fix/protected', { protectedBranch: true }), branch('main')], [
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

test('prunes only the explicitly reviewed stale no-PR refs', () => {
  const name = 'preview-deploy/2026-11-15-post-fix';
  assert.ok(STALE_NO_PR_BRANCHES.includes(name));
  const result = classifyBranches([branch(name)], [], repository);
  assert.deepEqual(result.map(x => x.name), [name]);
});

test('does not prune an arbitrary unreferenced branch without ancestry proof', () => {
  const result = classifyBranches([branch('work/unknown')], [], repository, {
    'work/unknown': { ahead_by: 2, behind_by: 4 },
  });
  assert.deepEqual(result, []);
});

test('prunes an unreferenced branch only when its head is contained in main', () => {
  const result = classifyBranches([branch('old/ancestor')], [], repository, {
    'old/ancestor': { ahead_by: 0, behind_by: 10 },
  });
  assert.deepEqual(result.map(x => x.name), ['old/ancestor']);
});
