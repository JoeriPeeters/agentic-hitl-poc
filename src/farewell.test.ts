import { describe, expect, it } from "vitest";
import { farewell } from "./farewell.js";

describe("farewell", () => {
  it("bids farewell to a named person", () => {
    expect(farewell("Joeri")).toBe("Goodbye, Joeri!");
  });

  it("trims surrounding whitespace from the name", () => {
    expect(farewell("  Ada  ")).toBe("Goodbye, Ada!");
  });

  it("falls back to the world when the name is blank", () => {
    expect(farewell("")).toBe("Goodbye, world!");
    expect(farewell("   ")).toBe("Goodbye, world!");
  });
});
