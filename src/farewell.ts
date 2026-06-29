/**
 * Returns a friendly farewell.
 *
 * Mirrors {@link greet}: the name is trimmed, and a blank name falls back to
 * "world" so the CLI always produces a sensible message.
 */
export function farewell(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? `Goodbye, ${trimmed}!` : "Goodbye, world!";
}
