'use strict';

const SUPERSEDED_CLOSED_PR_BRANCHES = Object.freeze([
  // Release-policy alternatives replaced by the validated automatic-release policy in PRs #62 and #65.
  'ci/restore-release-boundaries-2026-11-15-rebased',
  'ci/restore-release-boundaries-2026-11-15',
  'fix/manual-only-production-release',
  // The lockfile, OSV scan, and npm ci workflow changes are already present on main.
  'automation/generate-lockfile-2026-11-15',
  // These sitemap variants were superseded by the merged canonical sitemap cleanup.
  'seo/sitemap-noindex-policy-2026-11-15',
  'seo/noindex-campaign-sitemap-2026-11-15',
  'seo/remove-noindex-campaign-from-sitemap-2026-11-15',
  // Daily Graphify/Lighthouse and visual QA are already implemented by the merged workflows.
  'automation/graphify-and-lighthouse-2026-11-15',
  'automation/graphify-daily-refresh-2026-11-15',
  'qa/visual-audit-2026-11-15',
  // The earlier campaign proposal was superseded by the merged v2 campaign PR.
  'feature/campaign-nitro-offer-2026-11-14',
]);

const STALE_NO_PR_BRANCHES = Object.freeze([
  // These preview refs are behind main or were temporary trigger branches.
  'preview-deploy/visual-qa-2026-11-15',
  'preview-deploy/2026-11-15-post-fix',
  'preview-deploy/2026-11-15-main-78ece71',
  // This site-only deployment snapshot removed recovery and validation files; production now deploys from main.
  'deploy/10-percent-site-only',
]);

function classifyBranches(branches, pullRequests, repositoryFullName) {
  const sameRepository = pr => pr?.head?.repo?.full_name === repositoryFullName;
  const mergedHeads = new Set(
    pullRequests.filter(pr => sameRepository(pr) && Boolean(pr.merged_at)).map(pr => pr.head.ref),
  );
  const openHeads = new Set(
    pullRequests.filter(pr => sameRepository(pr) && pr.state === 'open').map(pr => pr.head.ref),
  );
  const closedUnmergedHeads = new Set(
    pullRequests.filter(pr => sameRepository(pr) && pr.state === 'closed' && !pr.merged_at).map(pr => pr.head.ref),
  );
  const superseded = new Set(SUPERSEDED_CLOSED_PR_BRANCHES);
  const staleNoPr = new Set(STALE_NO_PR_BRANCHES);

  return branches.filter(branch => {
    const name = branch?.name;
    if (!name || name === 'main' || branch.protected) return false;
    if (name.startsWith('backup/') || name.startsWith('recovery/')) return false;
    if (openHeads.has(name)) return false;

    const explicitlySuperseded = superseded.has(name);
    if (closedUnmergedHeads.has(name) && !explicitlySuperseded) return false;

    return mergedHeads.has(name) || explicitlySuperseded || staleNoPr.has(name);
  });
}

module.exports = {
  classifyBranches,
  SUPERSEDED_CLOSED_PR_BRANCHES,
  STALE_NO_PR_BRANCHES,
};
