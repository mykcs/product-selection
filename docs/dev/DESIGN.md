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


## Hong Kong offer verification

For an availability or promotion refresh, start from the existing dated snapshot and exact variant links in `src/data/osprey-hk-stock.json`; do not rebuild the dealer catalogue. Search engines and other Agent reports are discovery leads, not proof of absence or availability. Open the merchant page in a real browser, complete its normal UI loading, use site search where necessary, select the exact generation/capacity/ordinary Raven Black variant, and inspect the visible state and public variant data when available. If a site shows a default color as available but the selected color is sold out, record only the selected color. Verify the barcode where exposed; otherwise retain the candidate status and ask for a tag photo rather than claiming an exact match.

For a promotion, use a clean guest browser context and compare the selected item, ordinary HKD price, quantity, actual cart discount, subtotal and pickup/shipping. Test one item separately from a qualifying multi-item cart; record payment/login/expiry requirements and distinguish verified cart totals from conditional estimates. Do not submit orders, payment, reservations or messages. Physical store stock and pickup readiness require separate merchant evidence. Keep other versions, delivery-only and unverified leads outside the confirmed price minimum. Update the single snapshot and existing map, then exercise the existing static validator and browser tests; a refreshed date is not a live inventory guarantee.

Delivery: retain the existing cross-account verification contract above. An integration-specific 403 is not evidence of a branch protection or owner rejection: confirm the exact actor/repository/head and existing authorized collaborator route before any allowed fallback. The successful #33 GitHub CLI merge and Vercel status are historical evidence, not a repair to the integration or proof of authenticated Production page content.


## Fleece comparison and Hong Kong lululemon directory

The independent /fleece/ and /fleece/hong-kong/ routes reuse SiteLayout, MainContent, shared typography/spacing tokens and vendored Leaflet. Single sources: src/data/fleece-comparison.json (official product pages, exact color/L public variant JSON, dated HKD prices) and src/data/lululemon-hk-stores.json (brand directory, official detail pages and Get Directions coordinates). Store availability, sale terms and checkout success are not inferred from a web listing. Use official product image links with a text fallback; a gray Sojourn illustration is explicitly not Bone. Preserve the agent reader allowlist: generic category entry only. Validate static route/evidence integrity, responsive design, use selection and map filters in browser tests. No new deployment provider or production authority.
