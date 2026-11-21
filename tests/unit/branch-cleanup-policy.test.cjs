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
  assert.deepEqual(SUPERSEDED_CLOSED_PR_BRANCHES, ['maintenance/retire-superseded-finalize-ref-2026-11-15']);
});

test('no closed-unmerged or no-PR maintenance refs remain individually eligible', () => {
  assert.deepEqual(SUPERSEDED_CLOSED_PR_BRANCHES, ['maintenance/retire-superseded-finalize-ref-2026-11-15']);
  assert.deepEqual(STALE_NO_PR_BRANCHES, []);
  const retired = [
    'maintenance/close-archive-closure-2026-11-15',
    'maintenance/archive-final-closure-ref-2026-11-15',
    'maintenance/finalize-pr113-archive-2026-11-15',
    'maintenance/finalize-archive-index-2026-11-15',
  ];
  for (const name of retired) {
    assert.deepEqual(classifyBranches([branchRef(name)], [pr(name)], repository, { [name]: { ahead_by: 0, behind_by: 10 } }), []);
    assert.deepEqual(classifyBranches([branchRef(name)], [], repository, { [name]: { ahead_by: 0, behind_by: 10 } }), []);
  }
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

test('does not delete retired no-PR refs after their allowlist is cleared', () => {
  const names = ['maintenance/finalize-archive-index-2026-11-15', 'maintenance/finalize-pr113-archive-2026-11-15'];
  for (const name of names) {
    assert.equal(STALE_NO_PR_BRANCHES.includes(name), false);
    assert.deepEqual(classifyBranches([branchRef(name)], [], repository, { [name]: { ahead_by: 0, behind_by: 0 } }), []);
  }
});

test('does not retain superseded closed-PR cleanup permissions after retirement', () => {
  const names = ['maintenance/close-archive-closure-2026-11-15', 'maintenance/archive-final-closure-ref-2026-11-15'];
  assert.deepEqual(SUPERSEDED_CLOSED_PR_BRANCHES, ['maintenance/retire-superseded-finalize-ref-2026-11-15']);
  for (const name of names) {
    assert.deepEqual(classifyBranches([branchRef(name)], [pr(name)], repository, { [name]: { ahead_by: 0, behind_by: 8 } }), []);
  }
});


test('retires this exact maintenance policy branch after merge', () => {
  const name = 'maintenance/finalize-branch-cleanup-policy-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name), [name]);
});


test('retires the closed PR120 maintenance ref only after main contains its exact head', () => {
  const name = 'maintenance/retire-superseded-finalize-ref-2026-11-15';
  assert.ok(SUPERSEDED_CLOSED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name)], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name)], repository, { [name]: { ahead_by: 0, behind_by: 4 } }).map(x => x.name), [name]);
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name)], repository, { [name]: { ahead_by: 1, behind_by: 4 } }), []);
});

test('retires this exact final cleanup PR branch after merge', () => {
  const name = 'maintenance/retire-final-closed-pr-ref-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name), [name]);
});

test('retires this exact final cleanup branch after merge', () => {
  const name = 'maintenance/retire-last-closed-ref-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name), [name]);
});

test('retires the merged privacy-navigation branch after its exact PR merge', () => {
  const name = 'fix/privacy-navigation-current-home-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name), [name]);
});

test('deletes a reused branch when its current head exactly matches a merged PR despite an older closed-unmerged PR', () => {
  const name = 'maintenance/retire-last-closed-ref-2026-11-15';
  const pulls = [
    pr(name, { state: 'closed', merged: false, sha: 'old-closed-head' }),
    pr(name, { state: 'closed', merged: true, sha: 'current-merged-head' }),
  ];
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'current-merged-head' })], pulls, repository).map(x => x.name), [name]);
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'newer-unmerged-head' })], pulls, repository), []);
});

test('retires this exact merged cleanup-policy PR branch after merge', () => {
  const name = 'maintenance/fix-merged-head-cleanup-logic-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name), [name]);
});


test('retires the exact merged final inventory documentation ref', () => {
  const name = 'docs/final-live-branch-inventory-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  const head = 'inventory-merged-head';
  assert.deepEqual(classifyBranches([branchRef(name, { sha: head })], [pr(name, { merged: true, sha: head })], repository).map(x => x.name), [name]);
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'moved-head' })], [pr(name, { merged: true, sha: head })], repository), []);
});

test('retires this exact final inventory cleanup PR branch after merge', () => {
  const name = 'maintenance/prune-final-inventory-refs-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name), [name]);
});


test('retires this exact archival-policy PR branch after its own merge', () => {
  const name = 'maintenance/archive-merged-performance-refs-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  const head = 'archive-policy-merged-head';
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name, { sha: head })], [pr(name, { merged: true, sha: head })], repository).map(x => x.name), [name]);
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'moved-head' })], [pr(name, { merged: true, sha: head })], repository), []);
});

test('retires this exact mobile-fix archive-policy PR branch after its own merge', () => {
  const name = 'maintenance/archive-mobile-header-fix-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  const head = 'archive-mobile-header-merged-head';
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name, { sha: head })], [pr(name, { merged: true, sha: head })], repository).map(x => x.name), [name]);
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'moved-head' })], [pr(name, { merged: true, sha: head })], repository), []);
});


test('retires this exact mobile visual-QA documentation branch after merge', () => {
  const name = 'docs/record-mobile-visual-qa-and-branch-archive-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  const head = 'mobile-visual-qa-docs-merged-head';
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name, { sha: head })], [pr(name, { merged: true, sha: head })], repository).map(x => x.name), [name]);
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'moved-head' })], [pr(name, { merged: true, sha: head })], repository), []);
});


test('retires the exact home price idle-enhancement PR branch after merge', () => {
  const name = 'perf/defer-home-price-enhancement-2026-11-15';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  const head = 'home-price-idle-enhancement-merged-head';
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(classifyBranches([branchRef(name, { sha: head })], [pr(name, { merged: true, sha: head })], repository).map(x => x.name), [name]);
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'moved-head' })], [pr(name, { merged: true, sha: head })], repository), []);
});


test('retires only exact reviewed merged working branches after merge', () => {
  const names = [
    'fix/remove-retired-route-build-guard-2026-11-21',
    'maintenance/retire-pr146-branches-2026-11-21',
    'perf/responsive-product-images-2026-11-21',
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


test('retires the integration audit documentation branch only after its exact head is merged', () => {
  const name = 'docs/integration-audit-2026-11-21';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});


test('retires the serum CSS optimization branch only after its exact head is merged', () => {
  const name = 'perf/serum-css-pruning-2026-11-21';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});


test('retires the Modern Web Guidance tooling branch only after its exact head is merged', () => {
  const name = 'tooling/modern-web-guidance-2026-11-21';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});


test('retires the Modern Web Guidance policy-fix branch only after its exact head is merged', () => {
  const name = 'fix/modern-web-guidance-policy-2026-11-21';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});



test('retires the merged PostHog integration audit PR branch only at its exact merged head', () => {
  const name = 'docs/posthog-integration-audit-2026-11-21';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  const merged = pr(name, { merged: true });
  assert.deepEqual(classifyBranches([branchRef(name, { sha: merged.head.sha })], [merged], repository).map(x => x.name), [name]);
  assert.deepEqual(classifyBranches([branchRef(name, { sha: 'changed-head' })], [merged], repository, { [name]: { ahead_by: 1, behind_by: 0 } }), []);
});

test('retires the no-op branch archival policy PR only after its exact head is merged', () => {
  const name = 'maintenance/archive-noop-audit-branch-2026-11-21';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});


test('retires the final branch inventory documentation branch only after its exact head is merged', () => {
  const name = 'docs/final-branch-state-2026-11-21';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});


test('retires the final live-state documentation branch only after its exact head is merged', () => {
  const name = 'docs/final-live-state-2026-11-21';
  assert.ok(MERGED_PR_BRANCHES.includes(name));
  assert.deepEqual(classifyBranches([branchRef(name)], [], repository), []);
  assert.deepEqual(
    classifyBranches([branchRef(name)], [pr(name, { merged: true })], repository).map(x => x.name),
    [name],
  );
});






