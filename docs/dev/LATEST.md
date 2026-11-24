# Current development direction

CI mode: **STANDARD_CI**

This public static site contains real purchasing logic: fixed models/sizes, exchange-rate conversion, regional price deltas and internal navigation.

The current cheap validation contract is:

```bash
python3 scripts/validate_site.py
```

Public GitHub Actions runs that validator on pull requests. Vercel remains the website Preview/Production provider; CI does not replace deployment.

The default validator avoids browser dependencies and package-manager setup. It now checks all served HTML entries, shared design ownership and displayed calendar dates alongside the existing purchasing logic. The opt-in exact-candidate browser job verifies all routes, interactive states, light/dark themes and actual token consumers in Chromium/WebKit; its requirements live in [SITE_STANDARDS.md](SITE_STANDARDS.md).

## Vercel Git automatic deployment budget (2026-11-23)

The site uses a pinned Astro 7 / Tailwind 4 static build, shared design tokens and unchanged purchasing logic. GitHub Actions PR CI still performs the exact deterministic Python price/route validation; Vercel remains the Preview + Production provider.

- **Production**: pushes/merges to main continue to create Vercel Production deployments.
- **Normal review**: feat/, fix/, review/, etc. branches continue to receive automatic PR Previews; no existing PR needs renaming. On any branch that does not match the opt-out patterns, Vercel's default remains deploy.
- **Cost-saving work branches**: new wip/ or scratch/ branches are for frequent local/agent iterations when an online Preview is not needed, and vercel.json explicitly prevents Git deployment scheduling for those two patterns. Create a normal feat/ or review/ branch at the reviewed SHA when a link is actually needed; don't require a Vercel check on a wip/ branch.
- **No false fix**: an Ignored Build Step still counts against Vercel daily deployment quota, so it is not used to solve the 100-deploy Hobby limit. Prebuilt VPS output also counts as a deployment. Do local offline build/tests as often as needed, batch commits, reserve a Vercel Preview for decision points.
- **Authority/test**: scripts/validate_site.py owns a cheap exact policy guard in the existing PR GitHub Actions validator; no new runner or provider. This is a new branch-namespace capability, not evidence of saved deployments until a natural wip/ event is observed. The existing website routes, domain, hosting, permissions, and Vercel link remain unchanged.

Rollback: remove git.deploymentEnabled from vercel.json in a reviewed PR; all branches return to Vercel's default auto-deploy policy.

## Astro integration

All route, date, price and Agent reader checks remain mandatory. Use npm ci and npm run check for pinned type/build validation, npm run test:browser for local built output. The exact-SHA browser acceptance lane remains opt-in.
