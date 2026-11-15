'use strict';

const ARCHIVE_BRANCHES = Object.freeze({
  "maintenance/pr112-branch-hygiene-inventory-2026-11-15": "80e320e4b95138685ad10099c6087050d66b2b62",
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
