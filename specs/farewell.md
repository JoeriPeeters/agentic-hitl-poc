# Farewell greeting

> Status: agreed
> Related issue: #<n> (once filed)

## Problem

The library can greet a user (`greet`) but has no way to say goodbye. We want a
symmetric farewell so the demo CLI can both welcome and dismiss a user. This
spec also serves as the worked example for the repo's spec-driven, human-in-the-
loop workflow.

## Goals

- A `farewell(name)` function that mirrors the existing `greet(name)`.
- The CLI can print a farewell instead of a greeting.

## Non-goals

- Internationalization / multiple languages.
- Any change to `greet`'s behavior.
- Configuration files or new dependencies.

## Behavior

A new `farewell` function in `src/farewell.ts`, mirroring `src/greet.ts`:

| Input | Output |
| --- | --- |
| `"Joeri"` | `"Goodbye, Joeri!"` |
| `"  Ada  "` | `"Goodbye, Ada!"` (input is trimmed) |
| `""` or `"   "` | `"Goodbye, world!"` (blank falls back to "world") |

CLI (`src/index.ts`): when invoked with a `--bye` flag, print the farewell
instead of the greeting. The name remains the first non-flag argument.

```
npm start -- Joeri          # Hello, Joeri!
npm start -- --bye Joeri    # Goodbye, Joeri!
npm start -- --bye          # Goodbye, world!
```

## Acceptance criteria

- [ ] `farewell` exists in `src/farewell.ts` and behaves per the table above.
- [ ] `src/farewell.test.ts` covers the named, trimmed, and blank cases.
- [ ] `src/index.ts` supports the `--bye` flag as specified.
- [ ] `greet` and its tests are unchanged.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes, with tests covering the new behavior.

## Open questions

- Should an explicit empty name (`--bye ""`) error instead of falling back to
  "world"? Current spec says fall back; flag if you disagree.
