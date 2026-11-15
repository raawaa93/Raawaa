'use strict';

const ARCHIVE_BRANCHES = Object.freeze({
  "automation/generate-lockfile-2026-11-15": "5e4aa75f96fe35c6eddf47389e5b4f548e765fc4",
  "automation/graphify-and-lighthouse-2026-11-15": "5a4931894ff853cec65158b716c4bff5a132273b",
  "automation/graphify-daily-refresh-2026-11-15": "ba595088521caaf26b2313a9d88664ae062feaad",
  "chore/google-site-verification": "8ccadd77bc66da908fc7d464119d69258842cc67",
  "ci/restore-release-boundaries-2026-11-15-rebased": "2993d59f4f492c9929ffc0f05c81f2cc5082982c",
  "ci/restore-release-boundaries-2026-11-15": "909fc4bfa337f353a069b87b68c51a0072127f05",
  "docs/workspace-hygiene-2026-11-15": "48a14a44feec666d0ebb3cf31992a8e06c1c2024",
  "feature/campaign-nitro-offer-2026-11-14": "ce61d6ee2e0cb2912c11900d4bf371df2e9cdf3b",
  "fix/branch-cleanup-allowlist-correction-2026-11-15": "4aa2cca35bdabfe716fa432bd7433595c4a4754d",
  "fix/branch-cleanup-policy-current-state-2026-11-15": "2fa31d3235987309962d094cb332d5e8924eadb8",
  "fix/branch-cleanup-policy-final-2026-11-15": "383bd07c6930b51343685fbbaed2a003fc9da209",
  "fix/branch-cleanup-policy-final-rebased-2026-11-15": "b5e41ca83bcc54aea4bf3f9c973563b62c608238",
  "fix/branch-hygiene-protect-operational-refs-2026-11-15": "b3b18f3484da39656c672a344ca1d9cae13c5bf1",
  "fix/final-visual-and-release-policy-2026-11-15": "7ca3855ac0a2030826a758baede212027f0b5fd6",
  "fix/final-visual-release-policy-consolidated-2026-11-15": "50d1d8835f5da9abc6724311075f0d1b19140999",
  "fix/manual-only-production-release": "9843b4224c069981aacd575602073315a31d118b",
  "fix/production-policy-site-check-2026-11-15": "0591b0e03f8f6b0be360b2336e42f75aca77b5b8",
  "fix/production-release-push-only-2026-11-15": "4d4ce839b8b4252b2a68ce856b9b83c34857bfbf",
  "fix/visual-audit-top-viewport-2026-11-15": "5ec51f3adb148d75b1b1244f7f3bdd0105b4a083",
  "fix/visual-qa-webkit-csp-regression-2026-11-15": "d512d7d07014e90b4d5e4fa25ed6fb8ae10aec1a",
  "maintenance/branch-cleanup-consolidated-2026-11-15": "4f8286f99ae3be4407d0fb1c0a035453c027f793",
  "maintenance/branch-hygiene-followup-2026-11-15": "8f8d02444ac265980c34703d2a44046d2701dc62",
  "maintenance/final-inventory-cleanup-2026-11-15": "e1fff31f5a341f874867b646d1533ce3a002ef63",
  "maintenance/finalize-branch-cleanup-2026-11-15": "4f68dcffd3ab6d0794c163f1245fd935341f5f90",
  "maintenance/finish-branch-cleanup-2026-11-15": "8a8c77c16f0b6d79423be42d7300363d1e6cd720",
  "maintenance/repository-hygiene-2026-11-15": "d001d7e8c346179a20c4ce3aab3717ad955945ef",
  "qa/visual-audit-2026-11-15": "bb5c7fb5f7b5142df3fb301a958156a5390aebf5",
  "seo/noindex-campaign-sitemap-2026-11-15": "9d9dddcc10ae0d487ff8f7efc443ec9be271beda",
  "seo/remove-noindex-campaign-from-sitemap-2026-11-15": "59057a487580be4b13b24a99f0812eb1fb936138",
  "seo/sitemap-noindex-policy-2026-11-15": "e01e7be06307910bf2978888ef5837e7c6db4566",
  "fix/visual-audit-top-viewport-clean-2026-11-15": "c0ccb2db0657d414885e68f16b8b79c9f73b4531",
  "maintenance/archive-inactive-branches-2026-11-15": null
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
  return expected === null || expected === branch.commit?.sha;
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
