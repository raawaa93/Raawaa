'use strict';

const SUPERSEDED_CLOSED_PR_BRANCHES = Object.freeze([
  'ci/restore-release-boundaries-2026-11-15-rebased',
  'ci/restore-release-boundaries-2026-11-15',
  'fix/manual-only-production-release',
  'automation/generate-lockfile-2026-11-15',
  'seo/sitemap-noindex-policy-2026-11-15',
  'seo/noindex-campaign-sitemap-2026-11-15',
  'seo/remove-noindex-campaign-from-sitemap-2026-11-15',
  'automation/graphify-and-lighthouse-2026-11-15',
  'automation/graphify-daily-refresh-2026-11-15',
  'qa/visual-audit-2026-11-15',
  'feature/campaign-nitro-offer-2026-11-14',
]);

const STALE_NO_PR_BRANCHES = Object.freeze([
  'preview-deploy/visual-qa-2026-11-15',
  'preview-deploy/2026-11-15-post-fix',
  'preview-deploy/2026-11-15-main-78ece71',
  'deploy/10-percent-site-only',
]);

function classifyBranches(branches, pullRequests, repositoryFullName, comparisons = {}) {
  const relatedByHead = new Map();
  for (const pull of pullRequests) {
    if (pull?.head?.repo?.full_name !== repositoryFullName || !pull?.head?.ref) continue;
    const ref = pull.head.ref;
    if (!relatedByHead.has(ref)) relatedByHead.set(ref, []);
    relatedByHead.get(ref).push(pull);
  }

  const superseded = new Set(SUPERSEDED_CLOSED_PR_BRANCHES);
  const staleNoPr = new Set(STALE_NO_PR_BRANCHES);

  return branches.filter((branch) => {
    const name = branch?.name;
    if (!name || name === 'main' || branch.protected) return false;
    if (name.startsWith('backup/') || name.startsWith('recovery/')) return false;

    const related = relatedByHead.get(name) || [];
    if (related.some((pull) => pull.state === 'open')) return false;

    const explicitlySuperseded = superseded.has(name);
    const explicitlyStale = staleNoPr.has(name);
    const hasMergedPR = related.some((pull) => Boolean(pull.merged_at));
    const hasClosedUnmergedPR = related.some((pull) => pull.state === 'closed' && !pull.merged_at);
    const mergedHeadMatchesCurrent = related.some((pull) =>
      Boolean(pull.merged_at) && pull.head.sha && pull.head.sha === branch.commit?.sha
    );
    const comparison = comparisons[name];

    // Explicitly reviewed superseded refs are safe after checking that no open PR uses them.
    if (hasClosedUnmergedPR) return explicitlySuperseded || comparison?.ahead_by === 0;

    // Temporary preview/deploy refs were individually reviewed; unknown refs still require proof.
    if (related.length === 0) return explicitlyStale || comparison?.ahead_by === 0;

    // A merged PR is sufficient only when the branch head has not moved since that merge.
    if (hasMergedPR && mergedHeadMatchesCurrent) return true;
    if (hasMergedPR) return explicitlySuperseded || comparison?.ahead_by === 0;

    return comparison?.ahead_by === 0;
  });
}

module.exports = {
  classifyBranches,
  SUPERSEDED_CLOSED_PR_BRANCHES,
  STALE_NO_PR_BRANCHES,
};
