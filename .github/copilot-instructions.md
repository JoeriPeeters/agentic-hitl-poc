# Copilot instructions

These instructions apply to the GitHub Copilot coding agent (and Copilot in the
editor) when working in this repository. Follow them on every task.

## What this repo is

A proof-of-concept for a **human-in-the-loop (HITL)** development workflow: work
is described in GitHub issues, the Copilot coding agent implements it on a branch
and opens a pull request, and a **human reviews and approves every PR before it
merges**. Optimize for changes that are easy for a human to review.

## Spec-driven: read the spec first

This repo uses **spec-driven development**. Specifications live in `specs/`.

- If an issue references a spec (e.g. "Implement `specs/farewell.md`"), **read
  that spec first** and treat its acceptance criteria as the definition of done
  for the task.
- Implement exactly what the spec's Behavior and Acceptance criteria describe —
  honor its Non-goals and do not build beyond them.
- If the spec has Open questions or is ambiguous, **state your assumption in the
  PR description and call it out** rather than guessing silently.
- See `specs/README.md` for the convention.

## Stack & layout

- **Language:** TypeScript (ES modules, `"type": "module"`).
- **Runtime:** Node.js 20+.
- **Tests:** [Vitest](https://vitest.dev). Test files live next to sources as `*.test.ts`.
- **Source:** all application code lives under `src/`.
- Use `.js` extensions in relative import paths (TypeScript ESM resolution), e.g.
  `import { greet } from "./greet.js";`.

## Commands

Install once, then use these (CI runs the same ones):

```bash
npm install      # install dependencies
npm run typecheck # tsc --noEmit — must pass with zero errors
npm test          # vitest run — all tests must pass
npm run build     # emit to dist/ (optional, for a publishable build)
```

## Definition of done

A task is complete only when **all** of the following hold:

1. `npm run typecheck` passes with no errors.
2. `npm test` passes, and new behavior is covered by new or updated tests.
3. The change is scoped to the issue — no unrelated refactors.
4. Public functions have a short doc comment explaining intent.

## Conventions

- Keep functions small and pure where practical; prefer explicit over clever.
- `strict` TypeScript is on, including `noUncheckedIndexedAccess` — handle
  `undefined` from index access rather than asserting it away.
- Match the style of the surrounding code; don't introduce new dependencies or
  tooling without saying why in the PR description.

## Pull request expectations

- Keep PRs **small and single-purpose** so a human can review them quickly.
- The PR description must state **what changed and why**, and list how you
  verified it (the commands you ran and their result).
- Call out anything you were unsure about so the human reviewer can focus there.
- Do not change branch protection, this file, or workflows under `.github/`
  unless the issue explicitly asks for it.
