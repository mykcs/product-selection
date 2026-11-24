# Development and CI design

## Why CI is useful here

Although the site is static HTML, the content is not purely decorative. Price conversion and regional comparisons can become internally inconsistent when one number changes without its derived values.

A few seconds of deterministic Python validation is cheaper than discovering those mistakes after deployment.

## What CI checks

- required pages and internal routes;
- non-empty HTML titles;
- Watch fixed 46 mm policy and preselected purchase URLs;
- README exchange-rate snapshot;
- Watch CNY conversions and regional deltas;
- iPhone 18 Pro Max 256GB fixed-model price conversions.

## What CI does not do

- no browser/E2E farm;
- no live Apple price scraping;
- no automatic exchange-rate refresh;
- no Vercel deployment;
- no shopping/availability claim.

Live prices remain content-maintenance evidence, not something CI invents.

## Provider roles

- GitHub: source / PR / lightweight correctness gate.
- Vercel: Preview / Production deployment.

## Cross-account Preview qualification

The GitHub source repository is `suiyue77/product-selection`, with `mykcs` as a write collaborator. The hosting project is `suiyue77-team/product-selection` on Vercel Hobby. This split lets GitHub Actions remain the provider-neutral CI gate, while Vercel separately handles site deployments and its own account quotas. An accepted Git push is **not** proof that Hobby accepted its commit author for deployment.

Qualify the actual cross-account path with a small, reviewable PR from `mykcs`:

1. From an isolated worktree, commit on an ordinary `docs/` (or `feat/` / `fix/`) branch as the authenticated `mykcs` GitHub identity, and open a PR to `main`. Do not use the `wip/**` or `scratch/**` branches disabled in `vercel.json`.
2. Confirm the required GitHub Actions `Price and route validation` check is successful for that PR's **exact** head SHA. Preserve the existing ruleset and branch protections.
3. Check the **new** Vercel project's Deployments view for a Preview that identifies the same source repository, PR/head SHA, and deploys successfully. Record any missing trigger, author-permission rejection, quota stop or failed build as a distinct `NOT_VERIFIED` / `BLOCKED` outcome; do not treat GitHub CI green as deployment success.
4. Open the actual Preview under an authorized Vercel login and check the relevant route. Also verify that an unauthenticated visit is redirected to login: the new project's Vercel Authentication should protect **All Deployments**.
5. Only after a separately authorized merge, verify that a **new** Production deployment serves the merged `main` SHA. A successful PR Preview alone does not qualify Production auto-deployment.

Keep the earlier `wangrui92-team/product-selection` project and its public domains out of this new project's authentication claims; disconnecting its old Git source did **not** retire those URLs. Do not move/delete domains, bypass author restrictions, impersonate a commit author, relax the required GitHub check, or use extra Vercel accounts to bypass plan quotas.

Rollback: revert this documentation change if project ownership or provider roles change; do not alter deployed code or the existing CI authority as part of a cross-account connectivity test.
