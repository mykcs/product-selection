# CI Passport

Status: **active — lightweight required PR gate**

Repository: `suiyue77/product-selection`\
Integration branch: `main`  
CI mode: `STANDARD_CI`

## Contract

- command: `python3 scripts/validate_site.py`
- provider: public GitHub Actions
- runner: Ubuntu
- expected runtime: seconds
- required external services: none
- secrets: none
- deployment side effects: none
- required main check: `Price and route validation` (GitHub Actions, integration ID `15368`; strict ruleset `24133819`)

The pull-request workflow checks out the exact PR head SHA before validation. The required check is bound to the GitHub Actions app and blocks stale candidates when `main` advances. Vercel remains independent deployment evidence.

## Site design acceptance

The required cheap gate includes the source/date contract and its negative fixtures. For a sitewide design change, additionally dispatch `Repository CI` on the reviewed branch with `browser=true` and its full `expected_sha`. `Site design browser acceptance` checks 10 routes in both engines, both themes and desktop/440px viewports, including interactive states. It is an explicit 20-minute lane with 3-day screenshots/JSON artifacts. The default PR gate remains dependency-free and required; no ruleset or deployment setting changes are implied.

## Cross-account qualification

- GitHub repository owner: `suiyue77`; the `mykcs` collaborator has write access, not repository-admin authority.
- Vercel hosting owner: `suiyue77-team/product-selection` (Hobby). Its Git connection points to `suiyue77/product-selection`, not the former `mykcs/product-selection`.
- This passport defines the **GitHub merge gate**, not a Vercel deployment guarantee. Validate whether a `mykcs`-authored PR actually receives a Vercel Preview; do not infer that from successful GitHub Actions.
- The evidence checklist and production/privacy boundaries are in [DESIGN.md](DESIGN.md#cross-account-preview-qualification).
