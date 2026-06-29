# Branch protection — the human-in-the-loop gate

Branch protection on `main` is what makes the "human approves every change" rule
real. Without it, Copilot's PRs (or anyone's) could merge unreviewed.

## What we enforce on `main`

- Require a pull request before merging.
- Require **at least 1 approving review**.
- Require review from **Code Owners** (see [`../.github/CODEOWNERS`](../.github/CODEOWNERS)).
- Require the **`build-and-test`** status check to pass.
- Dismiss stale approvals when new commits are pushed.

> The required status check is named **`build-and-test`** — GitHub Actions reports
> the check under the *job* name (`build-and-test` in [`ci.yml`](../.github/workflows/ci.yml)),
> not `workflow / job`. Using `CI / build-and-test` here would leave the check
> "expected" forever and silently block every merge even when CI is green.

Because Copilot's PRs are authored by the Copilot bot (not by you), you can
legitimately review and approve them — you are not approving your own work.

## Apply it with the GitHub CLI

```bash
gh api -X PUT repos/JoeriPeeters/agentic-hitl-poc/branches/main/protection \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build-and-test"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "require_code_owner_reviews": true,
    "dismiss_stale_reviews": true
  },
  "restrictions": null
}
JSON
```

> Note: requiring a status check that has never run yet can briefly block merges
> until CI runs once. If you need to merge the very first PR before CI history
> exists, temporarily drop `required_status_checks` to `null`.

## Or in the UI

**Settings → Branches → Add branch ruleset / protection rule** for `main`, then
tick the boxes listed above.
