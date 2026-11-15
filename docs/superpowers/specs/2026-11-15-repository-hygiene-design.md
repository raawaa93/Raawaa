# Repository and tooling hygiene — design
Date: 2026-11-15. Status: owner-authorized implementation.

## Intent
Reduce RAWAA Store repository clutter while preserving canonical source, recoverable backups, and work not demonstrably superseded. Establish one auditable inventory for project tools, integrations, skills, and free-tier limits.

## Goals
- Keep main as sole canonical source.
- Prune merged PR branches and a narrowly reviewed allowlist of closed work already superseded.
- Preserve all backup/* and recovery/* refs, current rollback/preview/deployment checkpoints, and unresolved verification/recovery work.
- Never delete a branch referenced by an open PR, protected, or closed-unmerged unless explicitly allowlisted as superseded.
- Automate repeatable branch hygiene with GitHub Actions and a tested policy module.
- Record connected integrations, relevant skills, quota observations, and blockers.
- Zero-cost, no new dependencies.

## Non-goals
No deletion of recovery snapshots, customer/order data, secrets, Supabase projects, Cloudflare resources, Notion pages, or Figma files. No DNS, production-source, pricing, promotion, or commercial-policy changes. No TinyFish. No paid plan, paid API, or billing activation.

## Approaches
1. Manual deletion: fast once, difficult to repeat safely.
2. Delete every closed-PR branch: rejected because closed is not merged and branch refs can be reused.
3. Tested policy plus scheduled GitHub Action: selected; classifies merged heads, reviewed superseded work, stale previews, open PRs, and protected namespaces, and logs all decisions.

## Design
- scripts/branch-cleanup-policy.cjs: pure classifier with explicit allowlists and namespace protections.
- tests/unit/branch-cleanup-policy.test.cjs: unit tests for merged, unmerged, reused, protected, backup, recovery, fork, and stale-preview cases.
- .github/workflows/cleanup-merged-branches.yml: runs after pushes to main, weekly, or manually; reads GitHub branches and PRs; deletes only classified refs.
- store-checks.yml runs policy tests on PRs.
- docs/engineering/BRANCH-INVENTORY.md records initial classification and verified post-cleanup state.
- docs/engineering/TOOLING-REGISTRY.md records tools, skills, quota observations, and blockers.
- AGENTS.md and README.md document the same governance.

## Safety
Preserve main, protected branches, backup/* and recovery/*. Preserve all open-PR heads. Preserve closed-unmerged heads unless exact branch is in the reviewed superseded allowlist. Delete merged PR heads only when they belong to this repository. Never infer external service data is unused. Cleanup does not touch website files, production deployment, DNS, Cloudflare Pages, Supabase, or commercial policy.

## Success
Policy tests and Store checks pass; action reports deleted and retained refs; remaining branch list matches inventory; maintenance merge does not trigger production deployment.
