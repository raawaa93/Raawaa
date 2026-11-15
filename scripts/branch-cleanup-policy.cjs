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

    // Merged PR heads are retained by default. Only exact reviewed stale refs can be retired.
    const hasClosedUnmergedPR = related.some((pull) => pull.state === 'closed' && !pull.merged_at);
    const comparison = comparisons[name];
    if (comparison?.ahead_by !== 0) return false;

    if (hasClosedUnmergedPR) return superseded.has(name);
    if (related.length === 0) return staleNoPr.has(name);
    return false;
  });
}

module.exports = {
  classifyBranches,
  SUPERSEDED_CLOSED_PR_BRANCHES,
  STALE_NO_PR_BRANCHES,
};
