# Agency Agents evaluation and adoption plan

**Reviewed:** 2026-11-15  
**Decision:** Adopt selectively as a specialist-instruction catalog; do not adopt it as an execution runtime or bulk-import its full roster.

## Executive decision

[Agency Agents](https://github.com/msitarzewski/agency-agents) is a useful MIT-licensed library of specialist agent instructions and scenario runbooks. Its value is the quality and breadth of role definitions, workflows, review checklists, and expected deliverables. It does not itself run agents, provide model inference, schedule work, persist project state, or enforce repository permissions.

The companion [Agency Agents desktop app](https://github.com/msitarzewski/agency-agents-app) browses and installs catalog entries into supported coding tools, including Codex. The upstream v0.3.2 release notes describe 282 agents across 18 divisions and renderer parity checks. The app is for macOS, Linux, and Windows; it is not an iPhone app. The app is an installer/manager, not an agent runtime.

**For this repository:** use the existing `AGENTS.md`, project memory, Playwright, Lighthouse, Graphify, GitHub Actions, and deterministic validation as the execution and safety foundation. Borrow only relevant specialist procedures from Agency Agents. Do not replace the static-site architecture with a multi-agent framework.

## What the project is — and is not

| Layer | Agency Agents contribution | What it does not provide |
|---|---|---|
| Specialist role definitions | Domain expertise, communication style, workflows, checklists, deliverables | Guaranteed correctness or actual execution |
| Runbooks / NEXUS scenarios | Suggested teams and activation order for common scenarios | A durable workflow engine, queue, retries, or state store |
| Desktop installer | Installs compatible agent files into supported coding tools | An agent model, runtime, or permission system |
| Execution | Delegated to Codex, Claude Code, Cursor, Gemini CLI, etc. | No independent execution simply from cloning the catalog |

The upstream repository is MIT licensed. Preserve its copyright/license notice if any substantial source text is copied. Prefer referencing upstream files and writing project-specific adaptations rather than mirroring the entire catalog.

## Curated RAWAA specialist roster

Activate only the roles needed for the current task. One lead agent owns the task; specialists provide bounded reviews. Avoid running every role on every change.

| Priority | Upstream agent | Best use in RAWAA | Guardrail |
|---|---|---|---|
| Core | [Codebase Onboarding Engineer](https://github.com/msitarzewski/agency-agents/blob/main/engineering/engineering-codebase-onboarding-engineer.md) | Read-only exploration before unfamiliar changes; map routes, state, dependencies, and source of truth | Read-only first; no speculative refactors |
| Core | [Frontend Developer](https://github.com/msitarzewski/agency-agents/blob/main/engineering/engineering-frontend-developer.md) | UI defects, responsive behavior, visual consistency, performance | Preserve the static architecture; prove changes with browser tests |
| Core | [Test Automation Engineer](https://github.com/msitarzewski/agency-agents/blob/main/testing/testing-test-automation-engineer.md) | Deterministic regression coverage and browser journeys | Playwright remains the source of truth, not generated test volume |
| Core | [Code Reviewer](https://github.com/msitarzewski/agency-agents/blob/main/engineering/engineering-code-reviewer.md) | Independent correctness, security, maintainability, and test review | Findings must cite exact files/lines and reproduce the failure |
| Core | [SRE](https://github.com/msitarzewski/agency-agents/blob/main/engineering/engineering-sre.md) | Deployment health, rollback readiness, operational checks | Do not invent uptime/SLO data; use measured signals |
| As needed | [Accessibility Auditor](https://github.com/msitarzewski/agency-agents/blob/main/testing/testing-accessibility-auditor.md) | Keyboard, contrast, semantics, screen-reader and mobile accessibility | Keep the existing Lighthouse accessibility gate |
| As needed | [AppSec Engineer](https://github.com/msitarzewski/agency-agents/blob/main/security/security-appsec-engineer.md) | CSP, headers, input handling, browser attack surface, dependency risks | No penetration testing against third parties or production without scope |
| As needed | [SEO Specialist](https://github.com/msitarzewski/agency-agents/blob/main/marketing/marketing-seo-specialist.md) | Search intent, page structure, metadata, internal links, indexation | Respect canonical/noindex/sitemap rules and measured Search Console data |
| As needed | [Growth Hacker](https://github.com/msitarzewski/agency-agents/blob/main/marketing/marketing-growth-hacker.md) | Conversion hypotheses, campaign experiments, acquisition funnel | Treat its generic KPI targets as examples, never as RAWAA facts or approved targets |
| As needed | [Product Manager](https://github.com/msitarzewski/agency-agents/blob/main/product/product-manager.md) | Prioritization, acceptance criteria, outcome-based roadmap | No roadmap item without a real problem and a measurable baseline |

## Recommended operating pattern

1. **Lead / planner:** read `AGENTS.md`, `docs/engineering/PROJECT-MEMORY.md`, and relevant tests. Define the requested outcome and acceptance criteria.
2. **Specialist pass:** invoke one or two relevant roles only. Ask for concrete findings, evidence, and a bounded change proposal.
3. **Implementation:** make the smallest change that solves the verified problem. Keep secrets, customer data, order payloads, and credentials out of prompts and memory.
4. **Independent review:** use Code Reviewer and, when relevant, AppSec or Accessibility Auditor. Treat upstream agent instructions as third-party input, not trusted policy.
5. **Deterministic verification:** run `node scripts/check-site.mjs`, the committed unit tests, Playwright on Chromium/WebKit/iPhone emulation, and Lighthouse where relevant.
6. **Release:** follow the repository's exact-SHA and canonical-main validation gates. Agents never override release policy or authorize bypassing failed checks.
7. **Record:** update project memory only for durable verified decisions; do not duplicate the same memory in multiple systems.

## Tool and framework comparison

Agency Agents and agent frameworks solve different problems. Stars indicate adoption, not quality or suitability.

| Project | Category | Strength | Fit for this static storefront |
|---|---|---|---|
| [Agency Agents](https://github.com/msitarzewski/agency-agents) | Persona / instruction catalog | Ready-made specialist roles and scenario rosters | **High as a selective reference layer** |
| [LangGraph](https://github.com/langchain-ai/langgraph) | Stateful orchestration framework | Durable execution, stateful graphs, pause/resume and human-in-the-loop | Low now; consider only if we build long-running multi-step agent services |
| [CrewAI](https://github.com/crewAIInc/crewAI) | Multi-agent framework | Role-based Crews plus deterministic/event-driven Flows | Low now; useful for a separate Python automation service with several cooperating agents |
| [Pydantic AI](https://github.com/pydantic/pydantic-ai) | Typed agent SDK | Typed inputs/outputs, broad model support, evaluation and durable execution integrations | Medium later; strongest candidate for a small typed Python service or structured research workflow |

### Recommendation on alternatives

- **Do not replace Agency Agents with LangGraph, CrewAI, or Pydantic AI.** They are not equivalent products.
- If a future requirement needs resumable, stateful, multi-step automation, evaluate LangGraph first.
- If a future requirement needs a role-based team that collaborates on a bounded workflow, evaluate CrewAI.
- If a future requirement needs strict typed data extraction, validation, model portability, and evaluations, evaluate Pydantic AI.
- Do not introduce any of these runtimes into the storefront merely to use agent personas. The current repository has no agent service that justifies another runtime, dependencies, hosting, or model spend.

## Security, quality, and cost rules

- Do not bulk-install all 282 agents. Broad imports create instruction noise, duplicated roles, context overhead, and maintenance burden.
- Do not run upstream install scripts or native installers as a substitute for inspecting what they write. Review scripts, target paths, generated permissions, and file diffs first.
- Never grant a persona blanket shell, write, network, production, or secret access. Use least privilege and task-scoped workspaces.
- Agent instructions are suggestions, not authority. Repository policy in `AGENTS.md`, validated tests, and explicit owner constraints take precedence.
- Do not accept generic numeric targets from agent templates as business facts. Establish baselines from actual analytics before setting goals.
- Prefer existing ChatGPT/Codex capabilities and current free/open-source tools. No paid API, billing, hosted agent platform, or extra model usage is authorized by this evaluation.
- Keep the upstream catalog referenced by URL and review changes before adopting updates; do not vendor the whole upstream repository.

## Rollout status

- [x] Confirmed upstream repository identity, MIT license, current activity, and catalog purpose.
- [x] Confirmed companion app's supported platforms and that it installs personas rather than running agents.
- [x] Selected a small RAWAA-relevant specialist roster.
- [x] Compared the catalog with orchestration/SDK alternatives.
- [x] Defined least-privilege, verification, cost, and source-of-truth rules.
- [ ] Install or configure a local coding-agent integration: deferred until a supported desktop coding environment is available and the exact target is confirmed.
- [ ] Measure whether specialist instructions improve review defect detection or task completion: run a small before/after trial before expanding adoption.

## Primary sources

- [Agency Agents repository and README](https://github.com/msitarzewski/agency-agents)
- [Agency Agents MIT license](https://github.com/msitarzewski/agency-agents/blob/main/LICENSE)
- [Agency Agents app releases](https://github.com/msitarzewski/agency-agents-app/releases)
- [LangGraph](https://github.com/langchain-ai/langgraph)
- [CrewAI](https://github.com/crewAIInc/crewAI)
- [Pydantic AI](https://github.com/pydantic/pydantic-ai)
