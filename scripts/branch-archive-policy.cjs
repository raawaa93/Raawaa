'use strict';

const ARCHIVE_BRANCHES = Object.freeze({
  "performance/fix-serum-image-preload-2026-11-15": "9368c47535062ad147bafba2632a899adac2c2fe",
  "performance/trim-serum-css-2026-11-15": "1449c8579d43b5535ef90d956daa8917c4e860a3",
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
