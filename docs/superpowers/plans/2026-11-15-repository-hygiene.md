# Repository Hygiene Implementation Plan

> REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Reduce RAWAA repository clutter to a justified canonical, backup, recovery, and investigation branch set, and document tools and free quotas.
**Architecture:** Pure Node.js branch classifier; GitHub Action invokes it after main pushes and weekly; unit tests guard deletion rules; repository registry records integrations and skills.
**Tech Stack:** GitHub Actions, GitHub REST via actions/github-script, Node built-in test runner, Markdown.
**Spec:** docs/superpowers/specs/2026-11-15-repository-hygiene-design.md

## Global Constraints
- Zero-cost only; no billing or paid API.
- Preserve backup/* and recovery/*.
- Delete merged PR heads only when their current head matches the merged PR head; moved heads require `ahead_by = 0` or an exact reviewed superseded allowlist.
- Never delete open-PR, protected, backup/recovery, or unreviewed closed-unmerged branches.
- Delete only the exact reviewed superseded and stale no-PR refs listed in the inventory.
- Never change DNS, secrets, Supabase data/schema, customer records, commercial policy, or production source.
- Never use TinyFish.
- Only validated main may deploy production.

## Review Focus
- A branch reused by merged and unmerged PRs must be preserved unless explicitly superseded.
- Fork branches must never be deleted from this repository.
- Slash-containing branch names must reach the GitHub delete-ref API intact.
- Backups/recovery remain protected even if their PR merged.
- A partial cleanup run must be safe to rerun.

### Task 1: Test the policy
Files: create tests/unit/branch-cleanup-policy.test.cjs; modify .github/workflows/store-checks.yml.
- [x] Test merged heads retained by default, superseded closed work, open PRs, reused refs, protected refs, backup/recovery namespaces, forks, stale previews, and ancestry proof.
- [x] Add node --test tests/unit/*.test.cjs to Store checks.
- [x] Observe expected RED for unsafe merged/closed-unmerged/unreferenced deletion rules before tightening the classifier.

### Task 2: Implement and automate
Files: create scripts/branch-cleanup-policy.cjs; create .github/workflows/cleanup-merged-branches.yml.
- [x] Implement classifyBranches(branches, pullRequests, repositoryFullName) with exact allowlists and `ahead_by = 0` proof.
- [x] Add main-push, weekly, and manual triggers.
- [x] Delete only policy-approved refs through supported GitHub API.
- [x] Verify namespace-protection tests and Store checks after PR #74; PR #77 adds six exact post-merge cleanup candidates.

### Task 3: Document
Files: create docs/engineering/BRANCH-INVENTORY.md and TOOLING-REGISTRY.md; create this spec and plan; modify AGENTS.md and README.md.
- [x] Record retained namespaces, superseded branches, connected tools, quotas, and blockers.
- [x] Align repository guidance with tested cleanup policy and automatic validated releases.
- [x] Date quota observations and distinguish available from active.

### Task 4: Merge and verify
- [x] Review the full diff and correct the closed-unmerged ancestry condition.
- [ ] Wait for PR #77 checks; fix failures, never bypass them.
- [ ] Merge PR #77 after checks pass.
- [ ] Verify the post-PR #77 cleanup run and enumerate remaining branches.
- [x] Refresh the 37-ref inventory and record all remaining unique-work branches; append actual deletion results after the run.
- [ ] Verify no production deployment was triggered.
