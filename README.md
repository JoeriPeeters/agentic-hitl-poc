# agentic-hitl-poc

A proof-of-concept for a **human-in-the-loop (HITL) software development workflow**
driven by the **GitHub Copilot coding agent**.

The idea: you describe work as a GitHub issue, hand it to Copilot, and Copilot
implements it on a branch and opens a pull request. **A human reviews and
approves every PR before it merges** — that review/approval step is the
human-in-the-loop.

```
Issue  ──assign──▶  Copilot coding agent  ──opens──▶  Pull request
                                                          │
                                              CI runs (typecheck + tests)
                                                          │
                                          ▼ HUMAN reviews & approves ◀── you
                                                          │
                                                        Merge
```

## The repo's part of the setup (already in place)

| File | Purpose |
| --- | --- |
| `.github/copilot-instructions.md` | How Copilot should work here: stack, commands, definition of done. |
| `.github/workflows/copilot-setup-steps.yml` | Pre-installs dependencies in Copilot's ephemeral environment. |
| `.github/workflows/ci.yml` | Type-checks and tests every PR — the objective gate behind your review. |
| `.github/CODEOWNERS` | Routes every PR to a human reviewer. |
| `.github/ISSUE_TEMPLATE/copilot-task.md` | Template for writing well-scoped Copilot tasks. |

Branch protection on `main` (require a PR + 1 approving review + passing CI)
enforces that nothing merges without a human. See "Branch protection" below to
confirm or adjust it.

## Two ways to drive the agent

The HITL gate (branch protection → PR → your approval) is **agent-agnostic** — it
doesn't care who opens the PR. This repo supports two AI coders behind that gate:

- **GitHub Copilot coding agent** — assign an issue to `@Copilot`. Requires a
  Copilot Pro+/Business/Enterprise plan (see below).
- **Claude coding agent** — add the `claude` label to an issue. Powered by the
  [Claude GitHub Action](https://github.com/anthropics/claude-code-action) and
  pay-as-you-go API usage (no subscription). See
  [Claude coding agent](#claude-coding-agent-no-copilot-plan-needed).

## One-time setup you do in GitHub (cannot be scripted)

The Copilot coding agent must be enabled for your account/org. This requires a
**Copilot Pro+, Business, or Enterprise** plan.

1. Make sure you have a qualifying Copilot plan.
2. Enable the coding agent: **github.com → your avatar → Settings → Copilot →
   Coding agent**, and enable it (for Business/Enterprise this is under the
   org's Copilot policies).
3. Confirm branch protection (below) is on for `main`.

## Claude coding agent (no Copilot plan needed)

Two workflows wire Claude into the same HITL loop:

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `.github/workflows/claude-implement.yml` | Add the **`claude` label** to an issue | Claude reads the issue + referenced spec, implements it on a branch, opens a PR. |
| `.github/workflows/claude.yml` | Mention **`@claude`** in an issue or PR comment | Claude responds in-thread; on a PR it pushes follow-up commits — how you iterate during review. |

**One-time setup:**

1. **Install the Claude GitHub App** at <https://github.com/apps/claude> and grant
   it access to this repository. The action fails without it
   (`Claude Code is not installed on this repository`). This is the analog of
   enabling the Copilot coding agent — a UI step that can't be scripted.
2. Create an Anthropic API key at <https://console.anthropic.com>.
3. Add it as a repo secret named **`ANTHROPIC_API_KEY`**:
   **Settings → Secrets and variables → Actions → New repository secret**, or via
   the CLI: `gh secret set ANTHROPIC_API_KEY --repo JoeriPeeters/agentic-hitl-poc`.
4. That's it — labeling an issue `claude` now kicks off a PR.

> The workflows also need `id-token: write` permission (already set) so the action
> can mint its GitHub token via OIDC.

> **CI on the bot's PR.** GitHub doesn't run workflows triggered by another
> workflow's default `GITHUB_TOKEN` (a loop-prevention rule). In practice this is
> not a problem here: the Claude action runs under the **Claude GitHub App's**
> token, not the default `GITHUB_TOKEN`, so the PRs it opens trigger `build-and-test`
> normally. (If you ever run an agent under the plain `GITHUB_TOKEN` and its PR's
> CI doesn't start, push an empty commit or close/reopen the PR to kick it.)

## Spec-driven development

This repo uses lightweight, spec-driven development: the durable "what & why"
for each feature lives as Markdown in [`specs/`](specs/README.md). Agree on the
spec first (review/merge it), then file an issue saying "Implement
`specs/<feature>.md`" and assign it to Copilot. The spec gives Copilot rich
context and gives your PR review an objective rubric. See
[`specs/farewell.md`](specs/farewell.md) for a worked example.

## Day-to-day workflow

1. **Write an issue.** New issue → choose **Copilot task** → fill in the goal and
   acceptance criteria (or simply point at a spec: "Implement `specs/<feature>.md`").
2. **Assign it to Copilot.** In the issue's **Assignees**, pick **Copilot**.
   Copilot reacts with 👀 and starts a session you can watch.
3. **Copilot opens a PR.** It works on a branch and opens a draft/normal PR,
   linking back to the issue. CI runs automatically.
4. **Review — the human-in-the-loop.** Read the diff. To iterate, leave PR review
   comments or `@Copilot <instruction>`; Copilot pushes follow-up commits.
5. **Approve & merge.** When CI is green and you're satisfied, approve and merge.
   Nothing reaches `main` without this step.

## Branch protection

To verify or (re)apply the rule that enforces human review, see
[`docs/branch-protection.md`](docs/branch-protection.md). In short: `main`
requires a pull request, at least one approving review from a code owner, and a
passing `build-and-test` check before merging.

## Local development

```bash
npm install       # Node 20+ recommended
npm run typecheck
npm test
npm start -- Joeri   # prints "Hello, Joeri!"
```

## What's intentionally minimal

The `src/` code (a `greet` function and its test) exists only to give Copilot a
real, tested codebase to build on and to give CI something to run. The point of
this repo is the **workflow**, not the app — the first real issues you assign to
Copilot will grow it.
