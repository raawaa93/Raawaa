'use strict';

const ARCHIVE_BRANCHES = Object.freeze({
  "fix/mobile-header-buttons-colors-2026-11-15": "6d9887c48cbbbd5eb9c0bf84a97acb6db2bfaf95",
  "performance/fix-serum-image-preload-2026-11-15": "9368c47535062ad147bafba2632a899adac2c2fe",
  "performance/trim-serum-css-2026-11-15": "1449c8579d43b5535ef90d956daa8917c4e860a3",
  "docs/agency-agents-adoption-2026-11-15": "0ae06ec6949034351d1a33d2de81180e99d11d83",
  "fix/exclude-dev-files-from-pages-payload-2026-11-15": "a4c976966be6d2193ccc76d216b3f0be3b76f27a",
  "docs/posthog-integration-audit-2026-11-21": "8bd438fb80c6ce5855411c6f3f3f37e8e127dcd2",
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
