# Agent documentation index

This repository is intentionally small. This file is navigation-only and does not duplicate page content.

## Project map

| Task | Read / verify |
|---|---|
| Overall site scope | `README.md` |
| Homepage/navigation | `src/pages/index.astro` |
| Apple Watch comparison | `src/pages/watch/index.astro` |
| Osprey backpack use-case chooser | `src/pages/osprey/index.astro` |
| Hong Kong Hikelite stock, discounts and MTR guide | [feature intent](../wish/DESIGN.md#hong-kong-hikelite-inventory-map-2026-11-26), `src/data/osprey-hk-stock.json` (dated HKD offers), `src/components/HkStockSummary.astro`, `src/pages/osprey/hong-kong/index.astro`; [refresh and verification](../dev/DESIGN.md#hong-kong-offer-verification) |
| Osprey series and price catalogue | `src/pages/osprey/series/index.astro`, `app.js`, `catalog.json`; evidence: `docs/decisions/2026-10-14-osprey-series-us-prices.md` |
| iPhone comparison | `src/pages/iphone/index.astro` |
| iPhone 香港换机话术与分支 | `src/pages/iphone/trade-in-guide/index.astro`, `model.js`, `ui.js`, `app.js` |
| iPhone 2026-10-13 实际购机路线 | `docs/decisions/2026-10-13-iphone-hk-actual-route.md` + `src/pages/iphone/trade-in-guide/index.astro#actual-route-20261013` |
| Mac chooser | `src/pages/mac/index.astro` and the relevant `src/pages/mac/*/index.astro` route |
| All-page typography, spacing, width and displayed dates | `assets/site.css`, `assets/calendar-date.js`; contract: `docs/dev/SITE_STANDARDS.md`; guard: `scripts/audit_site_design.py` |
| Current Apple price/spec/config claim | current official Apple source first, then the route HTML |
| Osprey model/fit/capacity claim | current official Osprey product and Size & Fit pages first |
| Exchange-rate conversion | the dated snapshot stated in `README.md` / route copy |
| Deployment status | live Vercel state + public route |

## Knowledge boundary

The site contains both durable structure and time-sensitive purchasing facts.

Treat:
- route structure and explanation design as repository-owned;
- current product availability, prices, specs and education-store state as external/live facts that must be refreshed;
- dated exchange rates and dated Osprey US prices as snapshots, not timeless truth.

## Human navigation

[Project Wiki](https://github.com/suiyue77/product-selection/wiki) and [Wish and Dev](https://github.com/suiyue77/product-selection/wiki/Wish-and-Dev) provide public reader navigation. Repository README, Wish/Dev and route/source evidence remain authoritative; Wiki is a reader projection.

## Agent continuity

Shared cross-tool Agent architecture and handoff semantics live in:

- `mykcs/.agents/docs/agents/KNOWLEDGE-ARCHITECTURE.md`
- `mykcs/.agents/docs/agents/HANDOFF_PATTERN.md`

Do not create a project-local copy of those shared rules.


### Fleece
- [用户选购意图及待研究问题](../wish/DESIGN.md#选购品质与设计价值后续深化意图2026-11-27) — 修改抓绒衣页面前先读；研究与实现尚未启动。
- /fleece/ — src/pages/fleece/index.astro; dated product facts in src/data/fleece-comparison.json.
- /fleece/hong-kong/ — src/pages/fleece/hong-kong/index.astro; store facts in src/data/lululemon-hk-stores.json.
- Both share assets/fleece.css and existing site design tokens; use the same checks and preview workflow.
