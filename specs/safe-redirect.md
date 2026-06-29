---
risk: high
---

# Safe redirect validation

> Status: agreed
> Related issue: #<n> (once filed)

## Problem

Redirecting a user to a URL taken from untrusted input (a `?next=` query
parameter, a form field) is a classic **open-redirect** vulnerability: an
attacker crafts `?next=https://evil.com` and the app sends the victim there.
We want a small, pure, well-tested validator that only permits safe redirect
destinations — relative paths, or absolute URLs on an explicit host allowlist —
and falls back to a safe default otherwise.

This spec is deliberately **`risk: high`** so it exercises the risk-routing flow:
its PR should trigger the OWASP security agent.

## Goals

- A pure `safeRedirect(target, allowedHosts, fallback?)` function in
  `src/safe-redirect.ts` that returns a safe redirect destination.
- Resistant to the common open-redirect bypass tricks (see Behavior).

## Non-goals

- No HTTP server, framework, or actual redirecting — pure validation only.
- No changes to `greet` / `farewell` / `hangman`.
- No allowlist of paths (only hosts) and no wildcard host matching.

## Behavior

```ts
function safeRedirect(
  target: string,
  allowedHosts: string[],
  fallback?: string, // default "/"
): string;
```

Returns `target` **only if** it is a safe destination; otherwise returns
`fallback` (default `"/"`).

A destination is safe if **either**:
1. It is a **relative path**: begins with a single `/`, and not `//` or `/\`
   (those are protocol-relative / backslash tricks), or
2. It is an absolute **`http:` or `https:`** URL whose **host** (compared
   case-insensitively) is in `allowedHosts`, and which has **no userinfo**
   component (`user:pass@host`).

Everything else returns the fallback. Host matching is exact (no subdomain or
wildcard matching). `allowedHosts` entries are compared case-insensitively.

### Worked examples (allowedHosts = `["app.example.com"]`)

| `target` | Result | Why |
| --- | --- | --- |
| `/dashboard` | `/dashboard` | safe relative path |
| `/` | `/` | safe relative path |
| `https://app.example.com/x` | unchanged | host allowed |
| `https://APP.Example.com/x` | unchanged | host match is case-insensitive |
| `http://app.example.com` | unchanged | http allowed |
| `https://evil.com` | `/` | host not on allowlist |
| `//evil.com` | `/` | protocol-relative |
| `/\evil.com` | `/` | backslash trick |
| `https://app.example.com@evil.com` | `/` | userinfo trick — real host is `evil.com` |
| `https://app.example.com.evil.com` | `/` | not an exact host match |
| `javascript:alert(1)` | `/` | non-http(s) scheme |
| `data:text/html,...` | `/` | non-http(s) scheme |
| `""` / `"   "` / malformed | `/` | not a valid safe destination |

## Acceptance criteria

- [ ] `src/safe-redirect.ts` exports `safeRedirect` behaving exactly as above.
- [ ] `safeRedirect` is pure — no I/O, no globals.
- [ ] `src/safe-redirect.test.ts` covers **every row** of the worked-examples
      table, including each bypass vector (protocol-relative, backslash,
      userinfo, scheme, subdomain-suffix, case-insensitive host, empty/malformed).
- [ ] A custom `fallback` argument is returned instead of `/` when provided.
- [ ] `greet` / `farewell` / `hangman` and their tests are unchanged.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes, with the new tests covering the behavior above.

## Open questions

- Default fallback is `"/"` — flag if you want a different default.
- Host matching is exact (no subdomains). Flag if subdomain matching is wanted —
  it widens the attack surface, so it's intentionally excluded here.
