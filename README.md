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

## One-time setup you do in GitHub (cannot be scripted)

The Copilot coding agent must be enabled for your account/org. This requires a
**Copilot Pro+, Business, or Enterprise** plan.

1. Make sure you have a qualifying Copilot plan.
2. Enable the coding agent: **github.com → your avatar → Settings → Copilot →
   Coding agent**, and enable it (for Business/Enterprise this is under the
   org's Copilot policies).
3. Confirm branch protection (below) is on for `main`.

## Day-to-day workflow

1. **Write an issue.** New issue → choose **Copilot task** → fill in the goal and
   acceptance criteria.
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
passing `CI / build-and-test` check before merging.

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
