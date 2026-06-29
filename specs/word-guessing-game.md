---
risk: low
---

# Word guessing game (Hangman engine)

> Status: agreed
> Related issue: #<n> (once filed)

## Problem

We want a small, well-tested game in the repo to exercise the spec-driven,
human-in-the-loop workflow on something more substantial than a one-line
function. This spec defines a **Hangman** game as a **pure engine** — all rules
and state, no input/output — so it is fully unit-testable and deterministic.

## Goals

- A pure Hangman engine in `src/hangman.ts`: the player guesses one letter at a
  time to reveal a hidden word, losing after a fixed number of wrong guesses.
- The engine is deterministic and side-effect free (no I/O, no randomness, no
  time) so it can be exhaustively tested with Vitest.

## Non-goals

- No interactive terminal UI / readline loop — engine only.
- No random word selection: the caller supplies the word (keeps it pure and
  testable). No bundled word list.
- No multi-word phrases, spaces, accents, or punctuation in the secret word.
- No changes to `greet` / `farewell`.

## Behavior

### Types

```ts
type GameStatus = "playing" | "won" | "lost";

interface GameState {
  word: string;            // the secret word, lowercased
  maxWrongGuesses: number; // total wrong guesses allowed before losing
  guessedLetters: string[]; // every letter guessed, unique, lowercase, in order
  wrongGuesses: string[];   // the subset of guessedLetters not in `word`, in order
  remainingGuesses: number; // maxWrongGuesses - wrongGuesses.length
  masked: string;           // `word` with not-yet-guessed letters shown as "_"
  status: GameStatus;
}
```

### Functions

```ts
function createGame(word: string, maxWrongGuesses?: number): GameState;
function guess(state: GameState, letter: string): GameState;
```

**`createGame(word, maxWrongGuesses = 6)`**

- Lowercases `word` and stores it.
- Throws an `Error` if `word` is empty or contains anything other than the
  letters `a`–`z` (case-insensitive).
- Throws an `Error` if `maxWrongGuesses` is not a positive integer.
- Initial state: `guessedLetters` and `wrongGuesses` empty, `status` `"playing"`,
  `remainingGuesses` equal to `maxWrongGuesses`, and `masked` all underscores
  (one `_` per letter).

**`guess(state, letter)`** — returns a **new** `GameState`; never mutates `state`.

- Normalizes `letter` to lowercase. Throws an `Error` if it is not exactly one
  letter `a`–`z`.
- Throws an `Error` if `state.status` is not `"playing"` (the game is over).
- If `letter` was already guessed, it is a **no-op**: return an equivalent state
  without consuming a guess.
- Correct guess (letter is in `word`): add to `guessedLetters`, reveal it in
  `masked`. If every letter in `word` is now revealed, `status` becomes `"won"`.
- Wrong guess (letter not in `word`): add to `guessedLetters` and `wrongGuesses`,
  decrement `remainingGuesses`. If `remainingGuesses` reaches `0`, `status`
  becomes `"lost"`.

### Worked example

`createGame("hello")` → `masked` `"_____"`, `remainingGuesses` 6, `status`
`"playing"`.

| Guess | Result |
| --- | --- |
| `"l"` | correct → `masked` `"__ll_"`, remaining 6 |
| `"z"` | wrong → remaining 5, `wrongGuesses` `["z"]` |
| `"l"` | no-op (already guessed) → unchanged |
| `"h"`, `"e"`, `"o"` | reveals rest → `masked` `"hello"`, `status` `"won"` |

## Acceptance criteria

- [ ] `src/hangman.ts` exports `createGame`, `guess`, and the `GameState` /
      `GameStatus` types, behaving exactly as described above.
- [ ] `guess` is pure — calling it never mutates the input state.
- [ ] `src/hangman.test.ts` covers: initial state, a correct guess, a wrong
      guess, repeated-guess no-op, winning, losing (running out of guesses),
      guessing after the game is over (throws), and invalid input to both
      `createGame` and `guess` (throws).
- [ ] `greet` / `farewell` and their tests are unchanged.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes, with the new tests covering the behavior above.

## Open questions

- `maxWrongGuesses` default is `6`; flag if you want a different default.
- Repeated guesses are treated as a no-op rather than an error — flag if you'd
  prefer guessing an already-guessed letter to throw.
