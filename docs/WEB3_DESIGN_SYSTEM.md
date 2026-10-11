# V5 Web3 Design System · Research Reference 1.0.0

**Long Ngo 2026 · Vietflexmap Copyright (c) 2025 · Apache-2.0**

Visual inspiration: user-supplied black-and-magenta Optiquest screenshot; the V5 orb is a newly authored original SVG.

## Identity & layout

- Main colors: black `#07040e`, surface `#131020`, magenta `#eb42e2`, violet `#ac5aff`, cyan `#6ddbea`.
- Shared assets: `web/v5-web3.css`, `web/v5-orb.svg`, `web/v5-i18n.js`.
- Desktop: two-column immersive hero, actual subdivision SVG preview, scientific chart lab.
- Mobile: stacked hero, aria-expanded navigation, single-column cards, touch-friendly buttons.
- Accessibility: visible focus, prefers-reduced-motion, textual numbers next to bars, native MathML, alt="" on decorative assets, no hidden marketing claims.
- Scope: Web3 is a visual style, not a blockchain custody or security promise.

## Scientific data visualizations

| Metric | H3 | S2 | V5-32 | Caveat |
| --- | ---: | ---: | ---: | --- |
| Resolution-0 root cells | 122 | 6 | 12 | Different atlas constructions |
| Branching | aperture 7 | 4 | 32 | V5 geometry is a WEAK construction |
| Maximum identifier level | 15 | 30 | 10 | Not identical ground resolution |
| CellID bits | 64 | 64 | 64 | Not evidence of a speed benefit |

The capability matrix uses "available / limited / research / N/A" instead of fabricated percentage scores, and compares practical shipped APIs rather than theoretical optimality. Data are defined in `web/v5-metrics.js` and rendered by `web/v5-compare.js`.

### Curvature simulation

For a convex geodesic pentagon on a sphere:

\[
\sum_{i=1}^5 \alpha_i=3\pi+\frac{A}{R^2}
\]

With R = 6371 km, the demo maps hypothetical area A to interior-angle sum in degrees, `540 + A/R²·180/π`. This is a sphere calculation, **not** an observed V5 cell area and **not** a proof of a strong global pentagonal subdivision. The equation is displayed with native browser MathML, backed by numerical tests.

## English / Vietnamese coverage

The overview, hero/navigation/metric charts and Gauss–Bonnet simulator switch between EN and VI without network calls. The detailed documents retain explicitly identified original languages: **English technical specification** and **Vietnamese mathematical proof/use cases**. Cross-links provide navigation; deeper content is not falsely presented as a complete translation. Language preference is stored locally in a browser if available.

## WebGL and progressive enhancement

The existing 3D Three.js research globe retains root/cell mode switching and mathematical constraints. It uses purple/magenta shades, reduced rendering pixel density on smaller screens, respects motion preferences and avoids offscreen render work. An SVG-based fallback displays while remote modules cannot load; the 2D explorer remains independent of the CDN.

## Security, ethics and release gates

- No dark patterns or false measured speed/memory/precision advantages.
- CSP and referrer meta, safe outbound links, no injected user-generated HTML in visualizations.
- No fonts shipped or downloaded; no tracking/personal-data collection.
- Existing Three.js CDN import is version pinned but not cryptographically integrity-pinned; local vendoring and strict CSP remain future work.
- Tests: `tests/test_v5_web3.mjs` plus Node syntax, Python geometry/codec tests and `scripts/audit_site.py`.
- A commit is not a verified GitHub Pages deployment or independent WCAG/mobile browser audit.

### Future checks

Run Lighthouse/Core Web Vitals, headless Chrome/Firefox/Safari tests on mobile/desktop, axe accessibility analysis, keyboard-only WebGL fallback tests, full long-document translation review, and independently benchmark H3/S2/V5 at matched geodesic accuracy. None are claimed completed.

**Scientific provenance:** 32-child weak research, V5-64 v1. Strong all-convex edge-to-edge uniform-area DGGS, WGS84 geolocation and superiority to H3/S2 are not verified.
