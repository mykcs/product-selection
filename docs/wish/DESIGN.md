# Wish design — Product selection

The project is intentionally small and covers Osprey backpacks, Apple Watch, iPhone and Mac. [README](../../README.md) owns the current scope and route list.

Each product route should explain the relevant choice: intended use, model/configuration, or practical purchase implication. Regional purchase comparisons should state their configuration, currency, tax and dated exchange-rate assumptions; Osprey routes support use-case selection and series browsing without inventing fit guarantees or local prices.

Wish holds the durable decision goal. Current Apple and Osprey facts belong in the route/source evidence and must be refreshed when guidance changes. Dated evidence remains a snapshot; Osprey catalogue prices have one owner, `osprey/series/catalog.json`. Dev explains how the static site is maintained.

## Open-ended interaction-quality wish (2026-11-20)

Product comparisons should make choices effortless to scan and operate. Links, filters, decision controls and expandable buying evidence need coherent hover, focus, touch and selected-state feedback; icon size, alignment, tap area and relative spacing should help users compare **like-for-like** rather than signal unverified superiority or hide price/tax assumptions.

**Current illustrative reference:** [nuro.dev](https://nuro.dev/) for restrained hover response, consistent icon proportions and layout rhythm, as observed on 2026-11-20. This is *not* a design to copy, a vendor/framework choice, a pixel or animation contract, or a permanent ceiling. Adopt more suitable existing patterns when better evidence emerges.

When implementing later, keep all ten static product routes independent where appropriate, reuse the actual route/design owners, and validate real desktop hover, keyboard focus, 440px phone touch, no overflow/layout shifts, and accurate visible purchase assumptions. **No comparison data, buying recommendation, or production UI changes in this Wish-only PR.**
