import { describe, expect, it } from "vitest";
import { safeRedirect } from "./safe-redirect.js";

const allowedHosts = ["app.example.com"];

describe("safeRedirect", () => {
  // Worked-examples table from specs/safe-redirect.md — one case per row.
  it("allows a safe relative path", () => {
    expect(safeRedirect("/dashboard", allowedHosts)).toBe("/dashboard");
  });

  it("allows the root relative path", () => {
    expect(safeRedirect("/", allowedHosts)).toBe("/");
  });

  it("allows an absolute URL on an allowed host", () => {
    expect(safeRedirect("https://app.example.com/x", allowedHosts)).toBe(
      "https://app.example.com/x",
    );
  });

  it("matches the host case-insensitively", () => {
    expect(safeRedirect("https://APP.Example.com/x", allowedHosts)).toBe(
      "https://APP.Example.com/x",
    );
  });

  it("allows http as well as https", () => {
    expect(safeRedirect("http://app.example.com", allowedHosts)).toBe(
      "http://app.example.com",
    );
  });

  it("rejects a host that is not on the allowlist", () => {
    expect(safeRedirect("https://evil.com", allowedHosts)).toBe("/");
  });

  it("rejects a protocol-relative URL", () => {
    expect(safeRedirect("//evil.com", allowedHosts)).toBe("/");
  });

  it("rejects the backslash protocol-relative trick", () => {
    expect(safeRedirect("/\\evil.com", allowedHosts)).toBe("/");
  });

  it("rejects a userinfo trick where the real host is not allowed", () => {
    expect(safeRedirect("https://app.example.com@evil.com", allowedHosts)).toBe(
      "/",
    );
  });

  it("rejects a host that only suffix-matches an allowed host", () => {
    expect(safeRedirect("https://app.example.com.evil.com", allowedHosts)).toBe(
      "/",
    );
  });

  it("rejects the javascript: scheme", () => {
    expect(safeRedirect("javascript:alert(1)", allowedHosts)).toBe("/");
  });

  it("rejects the data: scheme", () => {
    expect(safeRedirect("data:text/html,<h1>x</h1>", allowedHosts)).toBe("/");
  });

  it("rejects empty, whitespace, and malformed input", () => {
    expect(safeRedirect("", allowedHosts)).toBe("/");
    expect(safeRedirect("   ", allowedHosts)).toBe("/");
    expect(safeRedirect("http://", allowedHosts)).toBe("/");
  });

  // Acceptance criterion: a custom fallback is returned instead of "/".
  it("returns a custom fallback when the target is unsafe", () => {
    expect(safeRedirect("https://evil.com", allowedHosts, "/login")).toBe(
      "/login",
    );
    expect(safeRedirect("", allowedHosts, "/login")).toBe("/login");
  });

  it("still returns safe targets unchanged when a custom fallback is set", () => {
    expect(safeRedirect("/dashboard", allowedHosts, "/login")).toBe(
      "/dashboard",
    );
  });
});
