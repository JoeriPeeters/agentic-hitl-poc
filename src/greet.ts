/**
 * Returns a friendly greeting.
 *
 * This is intentionally tiny — it exists so the repo has real, tested code for
 * the Copilot coding agent to build on top of, and so CI has something to run.
 */
export function greet(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? `Hello, ${trimmed}!` : "Hello, world!";
}
