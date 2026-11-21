'use strict';

const ARCHIVE_BRANCHES = Object.freeze({
  "fix/mobile-header-buttons-colors-2026-11-15": "6d9887c48cbbbd5eb9c0bf84a97acb6db2bfaf95",
  "performance/fix-serum-image-preload-2026-11-15": "9368c47535062ad147bafba2632a899adac2c2fe",
  "performance/trim-serum-css-2026-11-15": "1449c8579d43b5535ef90d956daa8917c4e860a3",
  "docs/agency-agents-adoption-2026-11-15": "0ae06ec6949034351d1a33d2de81180e99d11d83",
  // Closed PR #159: preserve this exact historical head in an archive tag before ref deletion.
  "docs/final-live-state-2026-11-21": "b617c56799a3d913878df4915a1c2a94ea273617",
  // Unmerged experiment: preserve the exact runner branch before retiring its ref.
  // The existing cleanup-merged-branches.yml workflow verifies the archive tag before deleting it.
  "maintenance/branch-maintenance-runner-2026-11-21": "881720de49a7a3a3a28fde6102987de9f06ded31",
  // Closed-unmerged PR #164 was superseded after its unique audit notes were transferred to main.
  "maintenance/final-branch-state-2026-11-21": "71e11b7b3d861787e9e72d574879298f69251b6c",
  // Closed-unmerged PR #166 was superseded by PR #167 after its policy was reconciled.
  "maintenance/archive-final-refs-2026-11-21": "31ff93d7ede35deaafff0373a92e5caa8cfc7822",
  // Closed PR #168: archive the superseded reconciliation branch at its exact head.
  "maintenance/archive-closed-stale-refs-2026-11-21": "9ee3d444021971c3ee3882de844c0c6952dd6258",
  // Closed PR #170: preserve the duplicate superseded branch before deleting its ref.
  "maintenance/archive-stale-pr168-2026-11-21": "0a7e47d3814b60640345a58d7f739ed6e19ac41d",
  // Closed duplicate PR #174: preserve its exact branch head before deletion.
  "maintenance/archive-duplicate-pr170-2026-11-21": "2558a850dce41d277ef186e7157b345beef7f5ad",
  // Closed duplicate PR #176: preserve its exact superseded policy branch before deleting it.
  "maintenance/archive-closed-pr174-2026-11-21": "8aa2cca363008add9770833cbeff3b7aed81b74c",
  // PR #171 was superseded by the merged rebase; ancestry-safe cleanup handles its old ref.
  "fix/exclude-dev-files-from-pages-payload-2026-11-15": "a4c976966be6d2193ccc76d216b3f0be3b76f27a",
});
const PROTECTED_PREFIXES = Object.freeze([
  'backup/',
  'recovery/',
  'restore/',
  'release/',
  'production-deploy/',
  'deploy/',
  'preview-deploy/',
]);

function isProtectedBranch(branch) {
  const name = branch?.name;
  return !name || name === 'main' || Boolean(branch.protected) ||
    PROTECTED_PREFIXES.some((prefix) => name.startsWith(prefix));
}

function expectedArchiveShaMatches(branch) {
  if (!branch?.name || !Object.prototype.hasOwnProperty.call(ARCHIVE_BRANCHES, branch.name)) return false;
  const expected = ARCHIVE_BRANCHES[branch.name];
  return typeof expected === 'string' && expected === branch.commit?.sha;
}

function selectArchiveCandidates(branches, pullRequests, repositoryFullName) {
  const openRefs = new Set(
    pullRequests
      .filter((pull) => pull?.state === 'open' && pull?.head?.repo?.full_name === repositoryFullName)
      .map((pull) => pull.head.ref),
  );

  return branches.filter((branch) =>
    Object.prototype.hasOwnProperty.call(ARCHIVE_BRANCHES, branch?.name) &&
    !isProtectedBranch(branch) &&
    !openRefs.has(branch.name) &&
    expectedArchiveShaMatches(branch),
  );
}

module.exports = {
  ARCHIVE_BRANCHES,
  PROTECTED_PREFIXES,
  isProtectedBranch,
  expectedArchiveShaMatches,
  selectArchiveCandidates,
};
