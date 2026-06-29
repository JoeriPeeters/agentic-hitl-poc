# Specs

This folder holds **specifications** — the durable "what and why" for each piece
of work, written before the code. Specs are the source of truth in this repo's
[human-in-the-loop workflow](../README.md):

```
specs/<feature>.md  ──referenced by──▶  GitHub issue  ──assign──▶  Copilot
        │                                                              │
        │                                              implements against the spec
        │                                                              ▼
        └────────────── human reviews the PR *against this spec* ──▶ merge
```

## Why specs

- **Context for Copilot.** A spec carries far more intent than an issue title,
  and it persists after the issue closes. `.github/copilot-instructions.md` tells
  the Copilot coding agent to read the relevant spec before implementing.
- **A rubric for human review.** The reviewer checks the PR against the spec's
  acceptance criteria instead of eyeballing a diff — this is what makes the
  human-in-the-loop gate meaningful.

## How to use
    
1. Copy [`TEMPLATE.md`](TEMPLATE.md) to `specs/<feature>.md` and fill it in.
2. Open a PR with just the spec and get it reviewed/merged first — agree on the
   *what* before any code exists.
3. File an issue whose body says: **"Implement `specs/<feature>.md`."**
4. Assign the issue to Copilot. Review its PR against the spec. Merge.

## Conventions

- One spec per feature, kebab-case filename: `specs/export-csv.md`.
- Keep specs short and behavioral — *what* should be true, not *how* to code it.
- A spec is "done" when it's merged; treat changes to it as a reviewed PR too.
- See [`farewell.md`](farewell.md) for a worked example.
