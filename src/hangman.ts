/**
 * A pure Hangman engine: the player guesses one letter at a time to reveal a
 * hidden word, losing after a fixed number of wrong guesses.
 *
 * The engine holds no I/O, randomness, or time, so it is fully deterministic
 * and unit-testable. The caller supplies the secret word.
 */

export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  /** The secret word, lowercased. */
  word: string;
  /** Total wrong guesses allowed before losing. */
  maxWrongGuesses: number;
  /** Every letter guessed, unique, lowercase, in order. */
  guessedLetters: string[];
  /** The subset of `guessedLetters` not in `word`, in order. */
  wrongGuesses: string[];
  /** `maxWrongGuesses - wrongGuesses.length`. */
  remainingGuesses: number;
  /** `word` with not-yet-guessed letters shown as "_". */
  masked: string;
  /** Whether the game is in progress, won, or lost. */
  status: GameStatus;
}

const LETTERS = /^[a-z]+$/;

/** Builds the masked view of `word`, revealing only letters that were guessed. */
function maskWord(word: string, guessedLetters: readonly string[]): string {
  const guessed = new Set(guessedLetters);
  return Array.from(word, (letter) => (guessed.has(letter) ? letter : "_")).join(
    "",
  );
}

/**
 * Creates a fresh game for `word`, allowing `maxWrongGuesses` wrong guesses.
 *
 * Throws if `word` is empty or contains anything other than the letters a–z
 * (case-insensitive), or if `maxWrongGuesses` is not a positive integer.
 */
export function createGame(word: string, maxWrongGuesses = 6): GameState {
  const normalized = word.toLowerCase();
  if (!LETTERS.test(normalized)) {
    throw new Error(
      `word must be one or more letters a-z, got: ${JSON.stringify(word)}`,
    );
  }
  if (!Number.isInteger(maxWrongGuesses) || maxWrongGuesses <= 0) {
    throw new Error(
      `maxWrongGuesses must be a positive integer, got: ${maxWrongGuesses}`,
    );
  }

  return {
    word: normalized,
    maxWrongGuesses,
    guessedLetters: [],
    wrongGuesses: [],
    remainingGuesses: maxWrongGuesses,
    masked: maskWord(normalized, []),
    status: "playing",
  };
}

/**
 * Applies a single-letter guess and returns a new `GameState`; never mutates
 * `state`.
 *
 * Throws if `letter` is not exactly one letter a–z, or if the game is already
 * over. Guessing an already-guessed letter is a no-op (no guess consumed).
 */
export function guess(state: GameState, letter: string): GameState {
  const normalized = letter.toLowerCase();
  if (normalized.length !== 1 || !LETTERS.test(normalized)) {
    throw new Error(
      `letter must be exactly one letter a-z, got: ${JSON.stringify(letter)}`,
    );
  }
  if (state.status !== "playing") {
    throw new Error(`cannot guess once the game is over (status: ${state.status})`);
  }

  if (state.guessedLetters.includes(normalized)) {
    // No-op: return an equivalent state without consuming a guess.
    return {
      ...state,
      guessedLetters: [...state.guessedLetters],
      wrongGuesses: [...state.wrongGuesses],
    };
  }

  const guessedLetters = [...state.guessedLetters, normalized];
  const isCorrect = state.word.includes(normalized);
  const wrongGuesses = isCorrect
    ? [...state.wrongGuesses]
    : [...state.wrongGuesses, normalized];
  const remainingGuesses = state.maxWrongGuesses - wrongGuesses.length;
  const masked = maskWord(state.word, guessedLetters);

  let status: GameStatus = "playing";
  if (!masked.includes("_")) {
    status = "won";
  } else if (remainingGuesses <= 0) {
    status = "lost";
  }

  return {
    ...state,
    guessedLetters,
    wrongGuesses,
    remainingGuesses,
    masked,
    status,
  };
}
