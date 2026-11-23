# Dev — Product selection site

CI mode: **STANDARD_CI**

- [LATEST.md](LATEST.md) — current development direction.
- [DESIGN.md](DESIGN.md) — why the site uses a tiny public CI lane plus Vercel deployment.
- [CI_PASSPORT.md](CI_PASSPORT.md) — current validation contract.
- [ARCHIVE.md](ARCHIVE.md) — replaced decisions only.
- [Shared Dev protocol](https://github.com/mykcs/.agents/blob/main/docs/agents/DEV_PROTOCOL.md)
- [Shared CI standard](https://github.com/mykcs/.agents/blob/main/docs/agents/CI_STANDARD.md)

The website source is static HTML. Vercel remains the deployment/hosting role; repository correctness is checked independently by a dependency-free Python validator.


## Git / CI / Preview / Production contract

- **GitHub source:** `suiyue77/product-selection` (Public), integration branch `main`. The `mykcs` account has collaborator Write; a successful push proves Git authorization, not deployment.
- **Required PR CI:** GitHub Actions `Price and route validation` under the existing ruleset; current authority in [CI_PASSPORT.md](CI_PASSPORT.md).
- **Current hosting:** Vercel `suiyue77-team/product-selection` (Hobby), connected through the GitHub App using **Only select repositories** with `suiyue77/product-selection` selected. The new site's domain is `product-selection-delta.vercel.app`.
- **Access:** the new site's Vercel Authentication was observed with **All Deployments** and an anonymous SSO redirect on 2026-11-23. Verify the actual live provider setting before any later privacy claim. **GitHub source remains public.**
- **Legacy:** `wangrui92-team/product-selection` had its old Git source disconnected, but still serves `mykcs-product-selection.vercel.app` and `apple-watch-series-12-price-compare.vercel.app` publicly as of that check. New-project SSO does not protect those domains.

If `main` advances but the **new** production site does not:

1. compare GitHub `main` SHA and GitHub Actions required-check provenance; a successful merge, Git commit status or Preview alone is not the new Production SHA/readback;
2. inspect the **correct** Vercel team's Git connection and deployment details to identify the Production deployment's source SHA, environment and `Ready` state;
3. verify Vercel GitHub App's selected repository remains `suiyue77/product-selection`, and the active Vercel browser/CLI/connector identity has access to **suiyue77-team**; an old `wangrui92` CLI login is not proof of access to the new team;
4. verify the new site's protected routes as an authorized team member and independently confirm that anonymous requests redirect to login;
5. if an authenticated Vercel project readback is unavailable (for example 403 / wrong browser account), report **Production exact-SHA NOT VERIFIED** and retain the GitHub status as a separate, lower-level observation. Do not use the legacy project's GitHub Deployment records as the new project's evidence.

Do not create synthetic probe commits, change commit authors, relax SSO, move old domains or repoint Production merely to turn a status green. Prefer a real, meaningful PR and the existing [cross-account qualification contract](DESIGN.md#cross-account-preview-qualification). A manual Vercel CLI deploy is only a separately authorized recovery option after verifying the actual target project and account.
