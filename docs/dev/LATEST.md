# Current development direction

CI mode: **STANDARD_CI**

This public static site contains real purchasing logic: fixed models/sizes, exchange-rate conversion, regional price deltas and internal navigation.

The current cheap validation contract is:

```bash
python3 scripts/validate_site.py
```

Public GitHub Actions runs that validator on pull requests. Vercel remains the website Preview/Production provider; CI does not replace deployment.

The default validator avoids browser dependencies and package-manager setup. It now checks all served HTML entries, shared design ownership and displayed calendar dates alongside the existing purchasing logic. The opt-in exact-candidate browser job verifies all routes, interactive states, light/dark themes and actual token consumers in Chromium/WebKit; its requirements live in [SITE_STANDARDS.md](SITE_STANDARDS.md).
