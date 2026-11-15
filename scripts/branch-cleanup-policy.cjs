'use strict';

/**
 * Conservatively classify branch refs that are safe to delete.
 *
 * A ref is eligible only if its head is already reachable from main, or its
 * PR was merged and no later unmerged work reused that same ref. Open PRs,
 * backups, recovery refs, protected refs, main, forks, and unknown refs stay.
 *
 * comparisons is an object keyed by branch name, with GitHub compare results.
 */
function classifyBranches(branches, pullRequests, repositoryFullName, comparisons = {}) {
  const relatedByHead = new Map();
  for (const pull of pullRequests) {
    if (pull?.head?.repo?.full_name !== repositoryFullName || !pull?.head?.ref) continue;
    const ref = pull.head.ref;
    if (!relatedByHead.has(ref)) relatedByHead.set(ref, []);
    relatedByHead.get(ref).push(pull);
  }

  return branches.filter((branch) => {
    const name = branch?.name;
    if (!name || name === 'main' || branch.protected) return false;
    if (name.startsWith('backup/') || name.startsWith('recovery/')) return false;

    const related = relatedByHead.get(name) || [];
    if (related.some((pull) => pull.state === 'open')) return false;

    const hasMergedPR = related.some((pull) => Boolean(pull.merged_at));
    const hasClosedUnmergedPR = related.some((pull) => pull.state === 'closed' && !pull.merged_at);
    const comparison = comparisons[name];

    // An unmerged or unreferenced branch can be removed only if its commit
    // history is already contained in main (ahead_by === 0).
    if (hasClosedUnmergedPR || related.length === 0) {
      return comparison?.ahead_by === 0;
    }

    // A merged PR is sufficient only if the branch was not subsequently
    // reused for unmerged work (handled above).
    if (hasMergedPR) return true;

    return comparison?.ahead_by === 0;
  });
}

module.exports = { classifyBranches };
