'use strict';

const MERGED_PR_BRANCHES = Object.freeze([
  "automation/agent-guidance-2026-11-15",
  "automation/ai-memory-graph-performance",
  "automation/graphify-lighthouse-baseline-2026-11-15",
  "automation/validated-auto-production-release",
  "chore/google-search-console-verification",
  "chore/indexnow-key",
  "chore/lockfile-npm-ci-2026-11-15",
  "ci/allow-doc-only-main-updates",
  "ci/automatic-production-release",
  "ci/avoid-duplicate-main-checks-2026-11-15",
  "ci/restore-release-boundaries-v2-2026-11-15",
  "dependabot/github_actions/actions/setup-python-7",
  "dependabot/github_actions/actions/upload-artifact-7",
  "docs/branch-inventory-cleanup-2026-11-14",
  "docs/integration-audit-2026-11-15",
  "docs/owner-currency-alignment-2026-11-14",
  "docs/preview-gate-and-legacy-cleanup-2026-11-14",
  "docs/record-free-tooling-and-indexing-audit-2026-11-15",
  "docs/refresh-project-memory-2026-11-15",
  "docs/release-readiness-backend-audit-2026-11-14",
  "docs/update-live-deployment-memory-2026-11-15",
  "docs/update-project-memory-2026-11-15",
  "feature/campaign-nitro-offer-2026-11-14-v2",
  "fix/campaign-canonical-2026-11-15",
  "fix/cart-dialog-mobile-2026-11-15",
  "fix/owner-currency-syp-2026-11-14",
  "fix/owner-pricing-safe-config-parse-2026-11-15",
  "fix/preview-copy-consistency-2026-11-15",
  "fix/product-structured-data",
  "fix/serum-cart-estimate-sync-2026-11-15",
  "fix/serum-estimate-copy-2026-11-15",
  "maintenance/canonical-source-of-truth-2026-11-14",
  "maintenance/policy-regression-guard-2026-11-14",
  "ops/add-production-deploy-workflow-2026-11-15",
  "ops/fix-production-release-guard-2026-11-15",
  "ops/production-release-manual-gate-2026-11-15",
  "ops/update-actions-node24-2026-11-15",
  "polish/home-motion-accessibility-2026-11-15",
  "qa/checkout-whatsapp-flow-2026-11-15",
  "qa/visual-audit-2026-11-15",
  "qa/visual-audit-preview-2026-11-15",
  "qa/visual-audit-trigger-fix-2026-11-15",
  "qa/visual-audit-webkit-guard",
  "security/dependabot-weekly-2026-11-15",
  "security/owner-pages-response-headers-2026-11-15",
  "seo/link-privacy-from-home",
  "seo/noindex-sitemap-cleanup-20261115",
  "seo/refresh-sitemap-lastmod",
  "tooling/design-skills-playwright-2026-11-15",
  "tooling/playwright-webkit-iphone-2026-11-15",
  "work/mobile-ux-audit-2026-11-14",
  "fix/branch-hygiene-protect-operational-refs-2026-11-15",
  "fix/visual-audit-csp-screenshots-2026-11-15",
  "fix/visual-audit-webkit-csp-2026-11-15",
  "docs/visual-qa-and-inventory-finalization-2026-11-15",
  "maintenance/repository-hygiene-2026-11-15",
  "fix/visual-qa-webkit-csp-regression-2026-11-15",
  "maintenance/branch-cleanup-consolidated-2026-11-15",
  "fix/production-release-push-only-2026-11-15",
  "fix/visual-audit-top-viewport-clean-2026-11-15",
  "fix/branch-cleanup-policy-final-2026-11-15",
  "fix/branch-cleanup-policy-final-rebased-2026-11-15",
  "maintenance/archive-inactive-branches-2026-11-15",
  "maintenance/final-workspace-hygiene-2026-11-15",
  "docs/final-branch-inventory-2026-11-15",
  "docs/final-tooling-state-2026-11-15",
  "maintenance/final-archive-closure-2026-11-15"
]);
const SUPERSEDED_CLOSED_PR_BRANCHES = Object.freeze([]);
const STALE_NO_PR_BRANCHES = Object.freeze([]);

function classifyBranches(branches, pullRequests, repositoryFullName, comparisons = {}) {
  const relatedByHead = new Map();
  for (const pull of pullRequests) {
    if (pull?.head?.repo?.full_name !== repositoryFullName || !pull?.head?.ref) continue;
    const ref = pull.head.ref;
    if (!relatedByHead.has(ref)) relatedByHead.set(ref, []);
    relatedByHead.get(ref).push(pull);
  }

  const mergedAllowlist = new Set(MERGED_PR_BRANCHES);
  const superseded = new Set(SUPERSEDED_CLOSED_PR_BRANCHES);
  const staleNoPr = new Set(STALE_NO_PR_BRANCHES);

  return branches.filter((branch) => {
    const name = branch?.name;
    if (!name || name === 'main' || branch.protected) return false;

    const alwaysProtectedPrefixes = ['backup/', 'recovery/', 'restore/', 'release/', 'production-deploy/'];
    if (alwaysProtectedPrefixes.some((prefix) => name.startsWith(prefix))) return false;
    if (name.startsWith('deploy/')) return false;
    if (name.startsWith('preview-deploy/') && !staleNoPr.has(name)) return false;

    const related = relatedByHead.get(name) || [];
    if (related.some((pull) => pull.state === 'open')) return false;

    const hasMergedPR = related.some((pull) => Boolean(pull.merged_at));
    const hasClosedUnmergedPR = related.some((pull) => pull.state === 'closed' && !pull.merged_at);
    const mergedHeadMatchesCurrent = related.some((pull) =>
      Boolean(pull.merged_at) && pull.head.sha && pull.head.sha === branch.commit?.sha
    );
    const comparison = comparisons[name];

    // A reused ref with a closed-unmerged PR is retained unless it is explicitly
    // reviewed AND GitHub proves every current commit is already contained in main.
    if (hasClosedUnmergedPR) {
      if (hasMergedPR) return mergedAllowlist.has(name) && comparison?.ahead_by === 0;
      return superseded.has(name) && comparison?.ahead_by === 0;
    }

    // No-PR refs are eligible only when individually reviewed and proven contained in main.
    if (related.length === 0) return staleNoPr.has(name) && comparison?.ahead_by === 0;

    // Exact merged heads are removed only from the reviewed allowlist.
    if (hasMergedPR && mergedHeadMatchesCurrent) return mergedAllowlist.has(name);
    // A moved merged branch requires ancestry proof.
    if (hasMergedPR) return mergedAllowlist.has(name) && comparison?.ahead_by === 0;

    return false;
  });
}

module.exports = {
  classifyBranches,
  MERGED_PR_BRANCHES,
  SUPERSEDED_CLOSED_PR_BRANCHES,
  STALE_NO_PR_BRANCHES,
};
