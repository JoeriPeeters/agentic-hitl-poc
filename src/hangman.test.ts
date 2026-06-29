import { describe, expect, it } from "vitest";
import { createGame, guess, type GameState } from "./hangman.js";

describe("createGame", () => {
  it("sets up the initial state", () => {
    const game = createGame("hello");
    expect(game).toEqual<GameState>({
      word: "hello",
      maxWrongGuesses: 6,
      guessedLetters: [],
      wrongGuesses: [],
      remainingGuesses: 6,
      masked: "_____",
      status: "playing",
    });
  });

  it("lowercases the word", () => {
    expect(createGame("Hello").word).toBe("hello");
  });

  it("honors a custom maxWrongGuesses", () => {
    const game = createGame("hi", 3);
    expect(game.maxWrongGuesses).toBe(3);
    expect(game.remainingGuesses).toBe(3);
  });

  it("throws on an empty or non-letter word", () => {
    expect(() => createGame("")).toThrow();
    expect(() => createGame("ab c")).toThrow();
    expect(() => createGame("ab1")).toThrow();
    expect(() => createGame("café")).toThrow();
  });

  it("throws when maxWrongGuesses is not a positive integer", () => {
    expect(() => createGame("hi", 0)).toThrow();
    expect(() => createGame("hi", -1)).toThrow();
    expect(() => createGame("hi", 1.5)).toThrow();
  });
});

describe("guess", () => {
  it("reveals a correct letter without consuming a guess", () => {
    const next = guess(createGame("hello"), "l");
    expect(next.masked).toBe("__ll_");
    expect(next.guessedLetters).toEqual(["l"]);
    expect(next.wrongGuesses).toEqual([]);
    expect(next.remainingGuesses).toBe(6);
    expect(next.status).toBe("playing");
  });

  it("records a wrong letter and decrements remaining guesses", () => {
    const next = guess(createGame("hello"), "z");
    expect(next.masked).toBe("_____");
    expect(next.guessedLetters).toEqual(["z"]);
    expect(next.wrongGuesses).toEqual(["z"]);
    expect(next.remainingGuesses).toBe(5);
    expect(next.status).toBe("playing");
  });

  it("normalizes the guessed letter to lowercase", () => {
    expect(guess(createGame("hello"), "H").masked).toBe("h____");
  });

  it("treats a repeated guess as a no-op", () => {
    const afterFirst = guess(createGame("hello"), "z");
    const afterRepeat = guess(afterFirst, "z");
    expect(afterRepeat.guessedLetters).toEqual(["z"]);
    expect(afterRepeat.wrongGuesses).toEqual(["z"]);
    expect(afterRepeat.remainingGuesses).toBe(5);
    expect(afterRepeat.status).toBe("playing");
  });

  it("does not mutate the input state", () => {
    const game = createGame("hello");
    const snapshot = structuredClone(game);
    guess(game, "l");
    expect(game).toEqual(snapshot);
  });

  it("wins when every letter is revealed", () => {
    let game = createGame("hello");
    for (const letter of ["h", "e", "l", "o"]) {
      game = guess(game, letter);
    }
    expect(game.masked).toBe("hello");
    expect(game.status).toBe("won");
    expect(game.remainingGuesses).toBe(6);
  });

  it("loses when wrong guesses run out", () => {
    let game = createGame("hello", 3);
    for (const letter of ["z", "x", "q"]) {
      game = guess(game, letter);
    }
    expect(game.status).toBe("lost");
    expect(game.remainingGuesses).toBe(0);
    expect(game.wrongGuesses).toEqual(["z", "x", "q"]);
  });

  it("follows the spec's worked example", () => {
    let game = createGame("hello");
    game = guess(game, "l");
    expect(game.masked).toBe("__ll_");
    expect(game.remainingGuesses).toBe(6);

    game = guess(game, "z");
    expect(game.remainingGuesses).toBe(5);
    expect(game.wrongGuesses).toEqual(["z"]);

    game = guess(game, "l"); // no-op
    expect(game.remainingGuesses).toBe(5);
    expect(game.masked).toBe("__ll_");

    for (const letter of ["h", "e", "o"]) {
      game = guess(game, letter);
    }
    expect(game.masked).toBe("hello");
    expect(game.status).toBe("won");
  });

  it("throws when the game is already over", () => {
    let game = createGame("hi");
    game = guess(game, "h");
    game = guess(game, "i");
    expect(game.status).toBe("won");
    expect(() => guess(game, "a")).toThrow();
  });

  it("throws on input that is not exactly one letter a-z", () => {
    const game = createGame("hello");
    expect(() => guess(game, "")).toThrow();
    expect(() => guess(game, "ab")).toThrow();
    expect(() => guess(game, "1")).toThrow();
    expect(() => guess(game, "é")).toThrow();
  });
});
