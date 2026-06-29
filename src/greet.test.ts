import { describe, expect, it } from "vitest";
import { greet } from "./greet.js";

describe("greet", () => {
  it("greets a named person", () => {
    expect(greet("Joeri")).toBe("Hello, Joeri!");
  });

  it("falls back to the world when the name is blank", () => {
    expect(greet("   ")).toBe("Hello, world!");
  });
});
