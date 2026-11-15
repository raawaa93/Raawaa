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
  assert.deepEqual(classifyBranches(
    [branchRef('fix/merged')],
    [pr('fix/merged', { merged: true })],
    repository,
  ), []);
});

test('deletes an exact merged head only when explicitly allowlisted', () => {
  const name = 'automation/agent-guidance-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});

test('deletes a moved merged head only after GitHub proves ahead_by is zero', () => {
  const name = 'automation/agent-guidance-2026-11-15';
  const prs = [pr(name, { merged: true, sha: 'old-sha' })];
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'new-sha' })], prs, repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name, { sha: 'new-sha' })], prs, repository, {
      [name]: { ahead_by: 0, behind_by: 4 },
    }).map(x => x.name),
    [name],
  );
  assert.deepEqual(
    classifyBranches([branchRef(name, { sha: 'new-sha' })], prs, repository, {
      [name]: { ahead_by: 1, behind_by: 4 },
    }),
    [],
  );
});

test('keeps closed-unmerged work for the exact-SHA archive workflow', () => {
  const name = 'feature/unmerged-work';
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name)], repository, {
      [name]: { ahead_by: 0, behind_by: 4 },
    }),
    [],
  );
  assert.deepEqual(SUPERSEDED_CLOSED_PR_BRANCHES, []);
});

test('no unreviewed no-PR branch remains eligible after final cleanup', () => {
  assert.deepEqual(STALE_NO_PR_BRANCHES, []);
  const name = 'maintenance/retire-last-stale-refs-2026-11-15';
  assert.deepEqual(
    classifyBranches([branchRef(name)], [], repository, {
      [name]: { ahead_by: 0, behind_by: 1 },
    }),
    [],
  );
});

test('keeps reused merged/closed refs when any unique commits remain', () => {
  const name = 'fix/visual-audit-top-viewport-clean-2026-11-15';
  const prs = [
    pr(name, { merged: true, sha: 'old-sha' }),
    pr(name, { sha: 'new-sha' }),
  ];
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'new-sha' })], prs, repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name, { sha: 'new-sha' })], prs, repository, {
      [name]: { ahead_by: 5, behind_by: 2 },
    }),
    [],
  );
});

test('protects a branch referenced by an open PR even if another PR was merged', () => {
  const name = 'qa/open';
  assert.deepEqual(
    classifyBranches([branchRef(name)], [
      pr(name, { merged: true }), pr(name, { state: 'open' }),
    ], repository, { [name]: { ahead_by: 0 } }),
    [],
  );
});

test('protects main, protected refs, and operational namespaces', () => {
  const names = [
    'main', 'backup/checkpoint', 'recovery/source', 'restore/current',
    'release/current', 'production-deploy/current', 'deploy/canary',
    'preview-deploy/current',
  ];
  assert.deepEqual(
    classifyBranches(names.map(name => branchRef(name, { protectedBranch: name === 'backup/checkpoint' })), [], repository,
      Object.fromEntries(names.map(name => [name, { ahead_by: 0 }]))),
    [],
  );
});

test('never deletes a fork branch', () => {
  const name = 'feature/fork';
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true, owner: 'contributor/Raawaa' })], repository),
    [],
  );
});

test('retires the final maintenance PR branch only after its exact head is merged', () => {
  const name = 'maintenance/final-workspace-hygiene-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});


test('keeps the archived documentation branch out of the merged-ref prune list', () => {
  assert.equal(MERGED_PR_BRANCHES.includes('docs/workspace-hygiene-2026-11-15'), false);
});


test('retires the final inventory PR branch after its exact head is merged', () => {
  const name = 'docs/final-branch-inventory-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});


test('retires the final tooling-state PR branch only after its exact head is merged', () => {
  const name = 'docs/final-tooling-state-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});


test('retires the final archive closure branch after its exact head is merged', () => {
  const name = 'maintenance/final-archive-closure-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});


test('retires the final archive record PR branch after its exact head is merged', () => {
  const name = 'docs/record-final-archive-run-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});

test('retires the merged crawler implementation branches after their exact PR heads are merged', () => {
  const names = ['feature/competitor-crawl4ai-weekly', 'fix/competitor-crawl-runner'];
  for (const name of names) {
    assert.ok(MERGED_PR_BRANCHES.includes(name));
    assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
    assert.deepEqual(
      classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
      [name],
    );
  }
});

test('retires the merged release-fix, cleanup, and crawler-coverage branches after exact PR merge', () => {
  const names = [
    'fix/production-release-ancestry-fetch',
    'maintenance/prune-merged-crawler-branches',
    'feature/competitor-crawl-coverage-2026-11-15',
  ];
  for (const name of names) {
    assert.ok(MERGED_PR_BRANCHES.includes(name));
    assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
    assert.deepEqual(
      classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
      [name],
    );
  }
});

test('retires the PR115 archive maintenance ref after its exact head is merged', () => {
  const name = 'maintenance/archive-pr113-branch-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name), [name]);
});

test('retires the final PR113 and PR114 maintenance refs only after exact heads are merged', () => {
  const names = [
    'maintenance/pr112-branch-hygiene-inventory-2026-11-15',
    'maintenance/final-branch-cleanup-2026-11-15',
  ];
  for (const name of names) {
    assert.ok(MERGED_PR_BRANCHES.includes(name));
    assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
    assert.deepEqual(
      classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
      [name],
    );
  }
});

test('deletes only the two reviewed no-PR archive-finalization refs after fast-forward to main', () => {
  const names = [
    'maintenance/finalize-archive-index-2026-11-15',
    'maintenance/finalize-pr113-archive-2026-11-15',
  ];
  for (const name of names) {
    assert.ok(STALE_NO_PR_BRANCHES.includes(name));
    assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
    assert.deepEqual(
      classifyBranches([branchRef(name)], [], repository, { [name]: { ahead_by: 0, behind_by: 0 } }).map(x => x.name),
      [name],
    );
    assert.deepEqual(
      classifyBranches([branchRef(name)], [], repository, { [name]: { ahead_by: 1, behind_by: 0 } }),
      [],
    );
  }
});


test('retires the final archive-ref maintenance branch after exact merge', () => {
  const name = 'maintenance/archive-final-closure-ref-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name), [name]);
});
