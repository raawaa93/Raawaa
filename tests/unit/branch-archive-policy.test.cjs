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

test('archives individually reviewed inactive refs only at their exact SHAs', () => {
  const reviewed = {
    'performance/fix-serum-image-preload-2026-11-15': '9368c47535062ad147bafba2632a899adac2c2fe',
    'performance/trim-serum-css-2026-11-15': '1449c8579d43b5535ef90d956daa8917c4e860a3',
    'fix/mobile-header-buttons-colors-2026-11-15': '6d9887c48cbbbd5eb9c0bf84a97acb6db2bfaf95',
    'docs/agency-agents-adoption-2026-11-15': '0ae06ec6949034351d1a33d2de81180e99d11d83',
    'docs/final-live-state-2026-11-21': 'b617c56799a3d913878df4915a1c2a94ea273617',
    'maintenance/branch-maintenance-runner-2026-11-21': '881720de49a7a3a3a28fde6102987de9f06ded31',
    'maintenance/final-branch-state-2026-11-21': '71e11b7b3d861787e9e72d574879298f69251b6c',
    'maintenance/archive-final-refs-2026-11-21': '31ff93d7ede35deaafff0373a92e5caa8cfc7822',
    'maintenance/archive-closed-stale-refs-2026-11-21': '9ee3d444021971c3ee3882de844c0c6952dd6258',
    'maintenance/archive-stale-pr168-2026-11-21': '0a7e47d3814b60640345a58d7f739ed6e19ac41d',
    'maintenance/archive-duplicate-pr170-2026-11-21': '2558a850dce41d277ef186e7157b345beef7f5ad',
    'maintenance/archive-closed-pr174-2026-11-21': '8aa2cca363008add9770833cbeff3b7aed81b74c',

    'fix/exclude-dev-files-from-pages-payload-2026-11-15': 'a4c976966be6d2193ccc76d216b3f0be3b76f27a',
    'security/zizmor-github-actions-2026-11-21': '80de5fe20505442a3eb1c98363745f139bc49a2b',
    'marketing/raawaa-video-scripts-2026-11-21': '09dbebab50f21292ce516cfe6cd9365a5f546023',
    'docs/supabase-edge-auth-audit-2026-11-21': '6e73b8a315dbe6975c8ce1948c51eafc74a20242',
    'dependabot/github_actions/actions/setup-python-7.1.0': 'f583302ca899a4ee6db406957b8a522893b737c1',
    'dependabot/github_actions/actions/upload-artifact-7.0.2': '779d7424c54bd46b98b30cfd610b985340e1e5db',
  };
  assert.deepEqual(ARCHIVE_BRANCHES, reviewed);
  const branches = Object.entries(reviewed).map(([name, sha]) => branch(name, sha));
  assert.deepEqual(selectArchiveCandidates(branches, [], repository).map(x => x.name), Object.keys(reviewed));
  for (const [name, sha] of Object.entries(reviewed)) {
    assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
    assert.equal(expectedArchiveShaMatches(branch(name, 'changed-sha')), false);
  }
  assert.deepEqual(
    selectArchiveCandidates(branches, [pull('performance/fix-serum-image-preload-2026-11-15')], repository).map(x => x.name),
    [
      'performance/trim-serum-css-2026-11-15',
      'fix/mobile-header-buttons-colors-2026-11-15',
      'docs/agency-agents-adoption-2026-11-15',
      'docs/final-live-state-2026-11-21',
      'maintenance/branch-maintenance-runner-2026-11-21',
      'maintenance/final-branch-state-2026-11-21',
      'maintenance/archive-final-refs-2026-11-21',
      'maintenance/archive-closed-stale-refs-2026-11-21',
      'maintenance/archive-stale-pr168-2026-11-21',
      'maintenance/archive-duplicate-pr170-2026-11-21',
      'maintenance/archive-closed-pr174-2026-11-21',

      'fix/exclude-dev-files-from-pages-payload-2026-11-15',
      'security/zizmor-github-actions-2026-11-21',
      'marketing/raawaa-video-scripts-2026-11-21',
      'docs/supabase-edge-auth-audit-2026-11-21',
      'dependabot/github_actions/actions/setup-python-7.1.0',
      'dependabot/github_actions/actions/upload-artifact-7.0.2',
    ],
  );
});

test('does not re-archive any retired ref if a stale branch is recreated', () => {
  const names = [
    'docs/workspace-hygiene-2026-11-15',
    'fix/visual-audit-top-viewport-clean-2026-11-15',
    'maintenance/archive-inactive-branches-final-2026-11-15',
    'maintenance/retire-last-stale-refs-2026-11-15',
  ];
  for (const name of names) {
    assert.equal(expectedArchiveShaMatches(branch(name)), false);
    assert.deepEqual(selectArchiveCandidates([branch(name)], [], repository), []);
  }
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

test('does not archive unknown refs, even when a same-name fork PR exists', () => {
  const name = 'feature/unreviewed';
  assert.deepEqual(
    selectArchiveCandidates([branch(name)], [pull(name, 'open', 'contributor/Raawaa')], repository),
    [],
  );
});


test('keeps the closed PR156 branch out of archive candidates because exact-main cleanup owns it', () => {
  const name = 'docs/final-access-and-branch-audit-2026-11-21';
  assert.equal(Object.prototype.hasOwnProperty.call(ARCHIVE_BRANCHES, name), false);
  assert.deepEqual(selectArchiveCandidates([branch(name, '8fe861b2496db12242aee3b8d3362d656de3e47c')], [], repository), []);
});


test('archives the exact closed PR159 head and rejects a moved or open ref', () => {
  const name = 'docs/final-live-state-2026-11-21';
  const sha = 'b617c56799a3d913878df4915a1c2a94ea273617';
  assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
  assert.equal(expectedArchiveShaMatches(branch(name, 'moved-head')), false);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [], repository).map(x => x.name), [name]);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'open')], repository), []);
});


test('archives the exact unmerged runner experiment only when its reviewed SHA matches', () => {
  const name = 'maintenance/branch-maintenance-runner-2026-11-21';
  const sha = '881720de49a7a3a3a28fde6102987de9f06ded31';
  assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
  assert.equal(expectedArchiveShaMatches(branch(name, 'moved-head')), false);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [], repository).map(x => x.name), [name]);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'open')], repository), []);
});


test('archives the exact closed-unmerged PR #164 head after its useful notes are transferred', () => {
  const name = 'maintenance/final-branch-state-2026-11-21';
  const sha = '71e11b7b3d861787e9e72d574879298f69251b6c';
  assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
  assert.equal(expectedArchiveShaMatches(branch(name, 'moved-head')), false);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [], repository).map(x => x.name), [name]);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'open')], repository), []);
});


test('archives the exact closed-unmerged PR #166 branch after transferring its policy', () => {
  const name = 'maintenance/archive-final-refs-2026-11-21';
  const sha = '31ff93d7ede35deaafff0373a92e5caa8cfc7822';
  assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
  assert.equal(expectedArchiveShaMatches(branch(name, 'moved-head')), false);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [], repository).map(x => x.name), [name]);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'open')], repository), []);
});


test('archives the exact closed PR168 branch and rejects moved or open refs', () => {
  const name = 'maintenance/archive-closed-stale-refs-2026-11-21';
  const sha = '9ee3d444021971c3ee3882de844c0c6952dd6258';
  assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
  assert.equal(expectedArchiveShaMatches(branch(name, 'moved-head')), false);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'closed')], repository).map(x => x.name), [name]);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'open')], repository), []);
});


test('archives the exact closed PR170 duplicate and rejects moved or open refs', () => {
  const name = 'maintenance/archive-stale-pr168-2026-11-21';
  const sha = '0a7e47d3814b60640345a58d7f739ed6e19ac41d';
  assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
  assert.equal(expectedArchiveShaMatches(branch(name, 'moved-head')), false);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'closed')], repository).map(x => x.name), [name]);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'open')], repository), []);
});


test('archives the exact closed PR174 duplicate branch', () => {
  const name = 'maintenance/archive-duplicate-pr170-2026-11-21';
  const sha = '2558a850dce41d277ef186e7157b345beef7f5ad';
  assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
  assert.equal(expectedArchiveShaMatches(branch(name, 'moved-head')), false);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'closed')], repository).map(x => x.name), [name]);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'open')], repository), []);
});


test('archives the exact closed PR176 duplicate policy branch', () => {
  const name = 'maintenance/archive-closed-pr174-2026-11-21';
  const sha = '8aa2cca363008add9770833cbeff3b7aed81b74c';
  assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
  assert.equal(expectedArchiveShaMatches(branch(name, 'moved-head')), false);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'closed')], repository).map(x => x.name), [name]);
  assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'open')], repository), []);
});


test('archives only the exact merged heads from the 2026-11-21 integration batch', () => {
  const reviewed = [
    ['security/zizmor-github-actions-2026-11-21', '80de5fe20505442a3eb1c98363745f139bc49a2b'],
    ['marketing/raawaa-video-scripts-2026-11-21', '09dbebab50f21292ce516cfe6cd9365a5f546023'],
    ['docs/supabase-edge-auth-audit-2026-11-21', '6e73b8a315dbe6975c8ce1948c51eafc74a20242'],
    ['dependabot/github_actions/actions/setup-python-7.1.0', 'f583302ca899a4ee6db406957b8a522893b737c1'],
    ['dependabot/github_actions/actions/upload-artifact-7.0.2', '779d7424c54bd46b98b30cfd610b985340e1e5db'],
  ];
  for (const [name, sha] of reviewed) {
    assert.equal(expectedArchiveShaMatches(branch(name, sha)), true);
    assert.equal(expectedArchiveShaMatches(branch(name, 'moved-head')), false);
    assert.deepEqual(
      selectArchiveCandidates([branch(name, sha)], [pull(name, 'closed')], repository).map(x => x.name),
      [name],
    );
    assert.deepEqual(selectArchiveCandidates([branch(name, sha)], [pull(name, 'open')], repository), []);
  }
});
