# Wish design — Product selection

The project is intentionally small and covers Osprey backpacks, Apple Watch, iPhone and Mac. [README](../../README.md) owns the current scope and route list.

Each product route should explain the relevant choice: intended use, model/configuration, or practical purchase implication. Regional purchase comparisons should state their configuration, currency, tax and dated exchange-rate assumptions; Osprey routes support use-case selection and series browsing without inventing fit guarantees or local prices.

Wish holds the durable decision goal. Current Apple and Osprey facts belong in the route/source evidence and must be refreshed when guidance changes. Dated evidence remains a snapshot; Osprey catalogue prices have one owner, `osprey/series/catalog.json`. Dev explains how the static site is maintained.

## Open-ended interaction-quality wish (2026-11-20)

Product comparisons should make choices effortless to scan and operate. Links, filters, decision controls and expandable buying evidence need coherent hover, focus, touch and selected-state feedback; icon size, alignment, tap area and relative spacing should help users compare **like-for-like** rather than signal unverified superiority or hide price/tax assumptions.

**Current illustrative reference:** [nuro.dev](https://nuro.dev/) for restrained hover response, consistent icon proportions and layout rhythm, as observed on 2026-11-20. This is *not* a design to copy, a vendor/framework choice, a pixel or animation contract, or a permanent ceiling. Adopt more suitable existing patterns when better evidence emerges.

When implementing later, keep all ten static product routes independent where appropriate, reuse the actual route/design owners, and validate real desktop hover, keyboard focus, 440px phone touch, no overflow/layout shifts, and accurate visible purchase assumptions. **No comparison data, buying recommendation, or production UI changes in this Wish-only PR.**

## Hong Kong Hikelite inventory map (2026-11-26)

Owner goal: replace scattered buying research with one geographic decision surface for 2026 S26 Raven Black 26 L and 28 L. Preserve the prior official dealer addresses, contacts, independent region/station filters and MTR navigation. Map plus compact per-store comparison should answer where to go, what the selected model costs and what evidence exists; group same-building stores at their actual common coordinate. The dated HKD snapshot is owned by `src/data/osprey-hk-stock.json`, distinct from the US series catalogue; public variant/page evidence, not generic product availability, supports each offer. Online stock never implies physical-store stock, no unsupported quantity or discount, and no automatic messages, checkout, polling or production publication. New research should update the single snapshot rather than duplicate prices in prose. Validate the chosen model, availability/region filters, empty results, grouped marker popups, mobile readability and existing contact links.


Evidence intake: external Agent reports are leads, not stock authority. Cross-check exact model generation, colour and barcode where available against the merchant's original variant or visible page. Preserve authoritative product links and dated evidence in the existing stock snapshot; keep official price baselines and other-version / uncertain leads distinct from verified target offers. Store pickup rules should use merchant policy rather than an unverified time guarantee. Do not change map stock status or minimum price based on an unrelated variant.


Promotion evidence: keep the ordinary listed price, conditional single-item discount and multi-item allocation separate. A verified guest cart is not a paid order. A product with the exact requested color selectable and addable but without verified barcode is a distinct candidate (orange on the map), not a confirmed green offer. Keep source links, membership/payment conditions and no-order boundary; expired or unverified offers must not count toward confirmed stock or unconditional lowest price.


Backpack decision constraints: a city-use pack need not look businesslike or have a dedicated laptop compartment; test the laptop in its own protective sleeve. Support, genuine airflow and loaded fit take priority. The current Hong Kong shortlist is ordinary black Hikelite 26 / 28; a limited black edition is no longer required. Preserve the general use-case chooser as exploration, not a final personal recommendation. A purchase decision is not complete until actual fit, model, payment and pickup are confirmed.
