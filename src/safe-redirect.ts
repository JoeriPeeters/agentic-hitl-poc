/**
 * Validates an untrusted redirect target and returns a safe destination.
 *
 * Prevents open-redirect attacks: a destination is returned unchanged only if
 * it is either a relative path (`/dashboard`, but not `//evil.com` or `/\evil`)
 * or an absolute `http:`/`https:` URL whose host is on `allowedHosts` and which
 * carries no userinfo. Anything else — protocol-relative URLs, backslash
 * tricks, `user@host` userinfo, non-http(s) schemes, off-allowlist hosts,
 * empty or malformed input — falls back to `fallback` (default `"/"`).
 *
 * Pure: no I/O, no globals. Host matching is exact and case-insensitive (no
 * subdomain or wildcard matching).
 */
export function safeRedirect(
  target: string,
  allowedHosts: string[],
  fallback = "/",
): string {
  // 1. Relative path: a single leading "/", but not "//" (protocol-relative)
  //    or "/\" (backslash variant that browsers treat as protocol-relative).
  if (target.startsWith("/") && target[1] !== "/" && target[1] !== "\\") {
    return target;
  }

  // 2. Absolute http(s) URL on the host allowlist, with no userinfo.
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return fallback;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return fallback;
  }

  // Reject "user:pass@host" — the real host would be hidden after the "@".
  if (url.username !== "" || url.password !== "") {
    return fallback;
  }

  const host = url.hostname.toLowerCase();
  if (allowedHosts.some((allowed) => allowed.toLowerCase() === host)) {
    return target;
  }

  return fallback;
}
