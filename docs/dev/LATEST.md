# Current development direction

CI mode: **STANDARD_CI**

This public static site contains real purchasing logic: fixed models/sizes, exchange-rate conversion, regional price deltas and internal navigation.

The current cheap validation contract is:

```bash
python3 scripts/validate_site.py
```

Public GitHub Actions runs that validator on pull requests. Vercel remains the website Preview/Production provider; CI does not replace deployment.

The existing Python price validator intentionally remains independent of npm and browser packages. The required CI also checks the pinned static build and output parity. Browser tests run against local dist; no additional hosted browser farm or deployment provider. It protects only high-value deterministic logic that has actually been easy to break during edits.

## Vercel Git automatic deployment budget (2026-11-23)

The site remains a static multi-route site. The Astro/Tailwind migration adds pinned build dependencies, not a client application framework or server-side runtime. GitHub Actions PR CI still performs the exact deterministic Python price/route validation; Vercel remains the Preview + Production provider.

- **Production**: pushes/merges to main continue to create Vercel Production deployments.
- **Normal review**: feat/, fix/, review/, etc. branches continue to receive automatic PR Previews; no existing PR needs renaming. On any branch that does not match the opt-out patterns, Vercel's default remains deploy.
- **Cost-saving work branches**: new wip/ or scratch/ branches are for frequent local/agent iterations when an online Preview is not needed, and vercel.json explicitly prevents Git deployment scheduling for those two patterns. Create a normal feat/ or review/ branch at the reviewed SHA when a link is actually needed; don't require a Vercel check on a wip/ branch.
- **No false fix**: an Ignored Build Step still counts against Vercel daily deployment quota, so it is not used to solve the 100-deploy Hobby limit. Prebuilt VPS output also counts as a deployment. Do local offline build/tests as often as needed, batch commits, reserve a Vercel Preview for decision points.
- **Authority/test**: scripts/validate_site.py owns a cheap exact policy guard in the existing PR GitHub Actions validator; no new runner or provider. This is a new branch-namespace capability, not evidence of saved deployments until a natural wip/ event is observed. The existing website routes, domain, hosting, permissions, and Vercel link remain unchanged.

Rollback: remove git.deploymentEnabled from vercel.json in a reviewed PR; all branches return to Vercel's default auto-deploy policy.

## Astro and Tailwind migration — compatibility stage

- Build route components with one shared Astro layout; keep the existing reviewed HTML as the sole content and business-script source during parallel page PRs. The adapter does not execute source inline scripts at build time or reinterpret product facts. The layout emits an accessible keyboard skip link using real Tailwind utilities and no Preflight reset.
- Copy only approved site assets and public-safe Agent files. Exact source head/body (apart from adding a main anchor if needed), script content and asset bytes are checked; no documentation or other repository files are copied into the static output. The existing Python validator remains authoritative for price/date snapshots and Agent content.
- Current acceptance includes every emitted route on Chromium/WebKit at desktop 1440×900 and mobile 440×956 DPR3, with keyboard and Osprey interaction checks. This is local synthetic/browser evidence, not production acceptance.
- Follow-up: integrate active typography/interaction and Osprey route PRs before converting their source HTML into dedicated Astro components and mapping the final shared semantic CSS to Tailwind utilities. The adapter is deliberately transitional, not full elimination of legacy markup. Re-run route/output tests after integrating the active branches. Do not use legacy public domains as a way around the protected canonical site.
