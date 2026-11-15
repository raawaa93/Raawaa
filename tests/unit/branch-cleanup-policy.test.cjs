'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  classifyBranches,
  MERGED_PR_BRANCHES,
  SUPERSEDED_CLOSED_PR_BRANCHES,
  STALE_NO_PR_BRANCHES,
} = require('../../scripts/branch-cleanup-policy.cjs');

const repository = 'raawaa93/Raawaa';
const branchRef = (name, { protectedBranch = false, sha = 'branch-head' } = {}) => ({
  name, protected: protectedBranch, commit: { sha },
});
const pr = (ref, { state = 'closed', merged = false, owner = repository, sha = 'branch-head' } = {}) => ({
  state, merged_at: merged ? '2026-11-15T00:00:00Z' : null,
  head: { ref, sha, repo: { full_name: owner } },
});

test('preserves unreviewed merged PR heads by default', () => {
  const result = classifyBranches(
    [branchRef('fix/merged', { sha: 'same-sha' })],
    [pr('fix/merged', { merged: true, sha: 'same-sha' })],
    repository,
  );
  assert.deepEqual(result, []);
});

test('deletes an exact merged head only when its branch is explicitly reviewed', () => {
  const name = 'automation/agent-guidance-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  const result = classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository);
  assert.deepEqual(result.map(x => x.name), [name]);
});

test('deletes a reviewed merged branch that moved only after ancestry proof', () => {
  const name = 'automation/agent-guidance-2026-11-15';
  const prs = [pr(name, { merged: true, sha: 'old-sha' })];
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'new-sha' })], prs, repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name, { sha: 'new-sha' })], prs, repository, {
      [name]: { ahead_by: 0, behind_by: 4 },
    }).map(x => x.name),
    [name],
  );
});

test('deletes only exact reviewed superseded closed-unmerged refs and keeps unknown work', () => {
  const unknown = classifyBranches([branchRef('feature/unresolved')], [pr('feature/unresolved')], repository, {
    'feature/unresolved': { ahead_by: 0, behind_by: 3 },
  });
  const name = 'ci/restore-release-boundaries-2026-11-15-rebased';
  const ahead = classifyBranches([branchRef(name)], [pr(name)], repository, {
    [name]: { ahead_by: 4, behind_by: 8 },
  });
  const followup = 'maintenance/branch-hygiene-followup-2026-11-15';
  const followupResult = classifyBranches([branchRef(followup)], [pr(followup)], repository);
  assert.deepEqual(unknown, []);
  assert.deepEqual(ahead.map(x => x.name), [name]);
  assert.deepEqual(followupResult.map(x => x.name), [followup]);
  assert.ok(SUPERSEDED_CLOSED_PR_BRANCHES.includes(name));
  assert.ok(SUPERSEDED_CLOSED_PR_BRANCHES.includes(followup));
});

test('a branch reused by merged and closed-unmerged PRs requires ancestry proof', () => {
  const name = 'qa/visual-audit-2026-11-15';
  const prs = [pr(name, { merged: true, sha: 'old-sha' }), pr(name, { sha: 'new-sha' })];
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'new-sha' })], prs, repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name, { sha: 'new-sha' })], prs, repository, {
      [name]: { ahead_by: 0 },
    }).map(x => x.name),
    [name],
  );
});

test('protects a branch referenced by an open PR even if another PR was merged', () => {
  const result = classifyBranches([branchRef('qa/open')], [
    pr('qa/open', { merged: true }), pr('qa/open', { state: 'open' }),
  ], repository, { 'qa/open': { ahead_by: 0 } });
  assert.deepEqual(result, []);
});

test('preserves backup and recovery namespaces even when contained in main', () => {
  const names = ['backup/checkpoint', 'recovery/source'];
  const result = classifyBranches(names.map(name => branchRef(name)), [], repository,
    Object.fromEntries(names.map(name => [name, { ahead_by: 0 }])));
  assert.deepEqual(result, []);
});

test('preserves protected branches and main', () => {
  const result = classifyBranches([branchRef('fix/protected', { protectedBranch: true }), branchRef('main')], [
    pr('fix/protected', { merged: true }), pr('main', { merged: true }),
  ], repository);
  assert.deepEqual(result, []);
});

test('never deletes a fork branch', () => {
  const result = classifyBranches([branchRef('feature/fork')], [
    pr('feature/fork', { merged: true, owner: 'contributor/Raawaa' }),
  ], repository);
  assert.deepEqual(result, []);
});

test('prunes only explicitly reviewed stale no-PR refs after ancestry proof', () => {
  const name = 'preview-deploy/2026-11-15-post-fix';
  assert.ok(STALE_NO_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  const result = classifyBranches([branchRef(name)], [], repository, {
    [name]: { ahead_by: 0, behind_by: 4 },
  });
  assert.deepEqual(result.map(x => x.name), [name]);
});

test('does not prune an arbitrary unreferenced branch, even if ahead_by is zero', () => {
  const result = classifyBranches([branchRef('work/unknown')], [], repository, {
    'work/unknown': { ahead_by: 0, behind_by: 4 },
  });
  assert.deepEqual(result, []);
});

test('retains refs when comparison data is missing or the branch is ahead of main', () => {
  const result = classifyBranches([branchRef('preview/current'), branchRef('work/unknown')], [], repository, {
    'work/unknown': { ahead_by: 2, behind_by: 4 },
  });
  assert.deepEqual(result, []);
});

test('preserves restore, release, production, and active preview/deploy checkpoints', () => {
  const names = [
    'restore/integrated-store-2026-11-14',
    'release/clean-pages-payload-2026-11-14',
    'production-deploy/release-2026-11-15',
    'preview-deploy/visual-qa-current-2026-11-15',
    'preview-deploy/2026-11-14',
    'deploy/10-percent-2026-11-14',
    'deploy/10-percent-site-only',
  ];
  const branches = names.map(name => branchRef(name));
  const pulls = names.map(name => pr(name, { merged: true }));
  const comparisons = Object.fromEntries(names.map(name => [name, { ahead_by: 0, behind_by: 0 }]));
  assert.deepEqual(classifyBranches(branches, pulls, repository, comparisons), []);
});

test('allows deletion of newly reviewed merged PR heads after merge', () => {
  const names = [
    'fix/branch-hygiene-protect-operational-refs-2026-11-15',
    'fix/visual-audit-csp-screenshots-2026-11-15',
    'fix/visual-audit-webkit-csp-2026-11-15',
  ];
  for (const name of names) {
    assert.ok(MERGED_PR_BRANCHES.includes(name), `${name} must be reviewed for merged-head cleanup`);
    assert.deepEqual(
      classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
      [name],
    );
  }
});

test('allows deletion of the explicitly reviewed no-PR docs ref only after ancestry proof', () => {
  const name = 'docs/project-tooling-and-branch-inventory-2026-11-15';
  assert.ok(STALE_NO_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [], repository, { [name]: { ahead_by: 0, behind_by: 3 } }).map(x => x.name),
    [name],
  );
});
