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
  assert.deepEqual(
    classifyBranches([branchRef('fix/merged')], [pr('fix/merged', { merged: true })], repository),
    [],
  );
});

test('deletes an exact merged head only when its branch is explicitly reviewed', () => {
  const name = 'automation/agent-guidance-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});

test('deletes only the nine reviewed merged heads when their PR head matches', () => {
  const names = [
    'fix/branch-hygiene-protect-operational-refs-2026-11-15',
    'fix/visual-audit-csp-screenshots-2026-11-15',
    'fix/visual-audit-webkit-csp-2026-11-15',
    'maintenance/repository-hygiene-2026-11-15',
    'docs/visual-qa-and-inventory-finalization-2026-11-15',
    'fix/visual-qa-webkit-csp-regression-2026-11-15',
    'maintenance/branch-cleanup-consolidated-2026-11-15',
    'fix/production-release-push-only-2026-11-15',
    'fix/visual-audit-top-viewport-clean-2026-11-15',
  ];
  names.push('fix/branch-cleanup-policy-final-2026-11-15');
  assert.equal(new Set(MERGED_PR_BRANCHES).size, MERGED_PR_BRANCHES.length);
  for (const name of names) {
    assert.ok(MERGED_PR_BRANCHES.includes(name), name);
    assert.deepEqual(
      classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
      [name],
    );
  }
  assert.equal(MERGED_PR_BRANCHES.includes('maintenance/finish-branch-cleanup-2026-11-15'), false);
  assert.equal(MERGED_PR_BRANCHES.includes('fix/final-visual-and-release-policy-2026-11-15'), false);
  assert.equal(MERGED_PR_BRANCHES.includes('fix/visual-audit-top-viewport-clean-2026-11-15'), true);
});

test('deletes a reviewed moved merged branch only after ancestry proof', () => {
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

test('closed-unmerged refs require exact review AND ahead_by=0', () => {
  const name = 'ci/restore-release-boundaries-2026-11-15-rebased';
  assert.ok(SUPERSEDED_CLOSED_PR_BRANCHES.includes(name));
  assert.ok(SUPERSEDED_CLOSED_PR_BRANCHES.includes('fix/visual-audit-top-viewport-2026-11-15'));
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name)], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name)], repository, {
      [name]: { ahead_by: 4, behind_by: 8 },
    }),
    [],
  );
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name)], repository, {
      [name]: { ahead_by: 0, behind_by: 8 },
    }).map(x => x.name),
    [name],
  );
});

test('unknown closed-unmerged work is never deleted, even when ahead_by=0', () => {
  const name = 'feature/unresolved';
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name)], repository, {
      [name]: { ahead_by: 0, behind_by: 3 },
    }),
    [],
  );
});

test('does not retire the closed-unmerged cleanup follow-up branch', () => {
  const name = 'maintenance/branch-hygiene-followup-2026-11-15';
  assert.equal(SUPERSEDED_CLOSED_PR_BRANCHES.includes(name), false);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name)], repository, {
      [name]: { ahead_by: 0, behind_by: 3 },
    }),
    [],
  );
});


test('closed-unmerged branches excluded from both allowlists are never deleted', () => {
  const names = [
    'maintenance/finish-branch-cleanup-2026-11-15',
  ];
  for (const name of names) {
    assert.equal(MERGED_PR_BRANCHES.includes(name), false);
    assert.equal(SUPERSEDED_CLOSED_PR_BRANCHES.includes(name), false);
    assert.deepEqual(
      classifyBranches([branchRef(name)], [pr(name)], repository, {
        [name]: { ahead_by: 0, behind_by: 20 },
      }),
      [],
    );
  }
});

test('closed-unmerged visual audit work is retained until all commits are in main', () => {
  const name = 'fix/visual-audit-top-viewport-2026-11-15';
  assert.ok(SUPERSEDED_CLOSED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name)], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name)], repository, { [name]: { ahead_by: 13, behind_by: 0 } }),
    [],
  );
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name)], repository, { [name]: { ahead_by: 0, behind_by: 13 } }).map(x => x.name),
    [name],
  );
});

test('a merged allowlist entry with no PR is not deleted as an unreferenced branch', () => {
  const name = 'fix/visual-audit-top-viewport-clean-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository, { [name]: { ahead_by: 0 } }), []);
});

test('a reused merged/closed-unmerged ref requires ancestry proof', () => {
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
  assert.deepEqual(
    classifyBranches([branchRef('qa/open')], [
      pr('qa/open', { merged: true }), pr('qa/open', { state: 'open' }),
    ], repository, { 'qa/open': { ahead_by: 0 } }),
    [],
  );
});

test('preserves backup and recovery namespaces even when contained in main', () => {
  const names = ['backup/checkpoint', 'recovery/source'];
  assert.deepEqual(
    classifyBranches(names.map(name => branchRef(name)), [], repository,
      Object.fromEntries(names.map(name => [name, { ahead_by: 0 }]))),
    [],
  );
});

test('preserves restore, release, production, and active preview/deploy checkpoints', () => {
  const names = [
    'restore/integrated-store-2026-11-14',
    'release/clean-pages-payload-2026-11-14',
    'production-deploy/release-2026-11-15',
    'preview-deploy/visual-qa-current-2026-11-15',
    'preview-deploy/visual-qa-after-csp-fix-2026-11-15',
    'preview-deploy/2026-11-14',
    'deploy/10-percent-2026-11-14',
    'deploy/10-percent-site-only',
  ];
  const branches = names.map(name => branchRef(name));
  const pulls = names.map(name => pr(name, { merged: true }));
  const comparisons = Object.fromEntries(names.map(name => [name, { ahead_by: 0, behind_by: 0 }]));
  assert.deepEqual(classifyBranches(branches, pulls, repository, comparisons), []);
});

test('preserves protected branches and main', () => {
  assert.deepEqual(
    classifyBranches([branchRef('fix/protected', { protectedBranch: true }), branchRef('main')], [
      pr('fix/protected', { merged: true }), pr('main', { merged: true }),
    ], repository),
    [],
  );
});

test('never deletes a fork branch', () => {
  assert.deepEqual(
    classifyBranches([branchRef('feature/fork')], [
      pr('feature/fork', { merged: true, owner: 'contributor/Raawaa' }),
    ], repository),
    [],
  );
});

test('prunes only explicitly reviewed stale no-PR refs after ancestry proof', () => {
  const name = 'docs/project-tooling-and-branch-inventory-2026-11-15';
  assert.ok(STALE_NO_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [], repository, { [name]: { ahead_by: 0, behind_by: 3 } }).map(x => x.name),
    [name],
  );
});

test('does not prune an arbitrary unreferenced branch, even if ahead_by is zero', () => {
  assert.deepEqual(
    classifyBranches([branchRef('work/unknown')], [], repository, {
      'work/unknown': { ahead_by: 0, behind_by: 4 },
    }),
    [],
  );
});

test('retains refs when comparison data is missing or the branch is ahead of main', () => {
  assert.deepEqual(
    classifyBranches([branchRef('work/unknown')], [], repository, {
      'work/unknown': { ahead_by: 2, behind_by: 4 },
    }),
    [],
  );
});
