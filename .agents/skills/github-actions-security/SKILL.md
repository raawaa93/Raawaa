---
name: github-actions-security
description: Review RAWAA GitHub Actions workflows and release automation for supply-chain and CI security risks.
license: MIT
---

# GitHub Actions Security

Use this skill whenever changing .github/workflows/**, repository actions, release permissions, or deployment credentials.

## Required review

1. Read the relevant workflow and AGENTS.md release boundary before editing.
2. Run the repository's pinned zizmor workflow or inspect its most recent result. The workflow pins both the action commit and CLI version, disables online audits, uses read-only permissions, and emits annotations without uploading SARIF.
3. Check permissions at workflow and job scope; use the narrowest permissions required.
4. Pin third-party actions to immutable commit SHAs and retain a version comment.
5. Set persist-credentials: false on checkout unless a later step demonstrably needs Git credentials.
6. Never interpolate untrusted issue, PR, branch, or commit text directly into shell scripts. Pass values through environment variables and validate them.
7. Never expose production secrets to pull-request code, fork workflows, preview deployments, or untrusted reusable workflows.
8. Keep production deploys bound to the exact validated main commit. Preserve the latest-main, clean-source, and validation gates.
9. Review workflow_run, pull_request_target, cache, artifact, and reusable-workflow boundaries for privilege escalation.
10. Do not silence findings by broad suppressions. Add a narrow documented exception only after confirming the reported pattern is safe.

## Verification

- Review zizmor annotations and workflow logs.
- Run repository unit tests when changing workflow policy or scripts.
- Confirm the workflow has no write permissions unless required by a specific job.
- Confirm the change does not alter production release triggers or deploy credentials unintentionally.

## Scope

This skill is project guidance, not a substitute for source review or GitHub branch rulesets. The initial zizmor baseline is advisory until existing findings are triaged and branch protection is configured.
