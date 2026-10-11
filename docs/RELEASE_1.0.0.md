# V5 Research Reference 1.0.0 — Release Criteria

**Date:** 2026-10-11  
**License:** Apache 2.0 · **Author:** Long Ngo 2026 · **Attribution:** Vietflexmap Copyright (c) 2025

## 1. Release scope
Version 1.0.0 is the release baseline for the **static V5 research website, documentation, reproducible weak geometry example, V5-64 path codec and associated regression tests**. It is **not** a production release of a global convex equal-area DGGS, GIS/WebGIS service or complete GeoAI platform.

## 2. Required green gates for honest publication
- [ ] CI Python unit tests including canonical UInt64 vectors and polygon simplicity
- [ ] CI Node mathematical regression and JS syntax tests
- [ ] Static page auditing: CSP meta/referrer, safe target links, local assets, bad dynamic execution patterns
- [ ] Pages deployment passes with QA job dependency
- [ ] Remote GitHub Pages URL visually/functionally verified in a modern browser
- [ ] No math overclaim: weak-vs-strong, Euler, parity, no exact homothety
- [ ] License, NOTICE, README, specification and changelog aligned

> A code commit or static audit is **not** evidence that any unchecked item above has passed. GitHub Actions statuses and remote browser checks must be inspected independently.

## 3. Mathematical open problems
1. A constructive **strict-convex, edge-to-edge, 32-child** spherical refinement algorithm with boundary synchronization.
2. A uniform quantitative contraction/shape-regularity proof on all levels, not just visual nesting.
3. Certified spherical/ellipsoidal geometry operations, global atlas orientation and root seams.
4. Measured benchmark versus H3 and S2 at matched accuracy and cost.

## 4. Release identity and versioning
- Public semver: `1.0.0` for the **research-reference site and codec API baseline**.
- V5-64 wire-format version field: `1` (not the semver).
- Geometry research status: weak partition proved; strong production DGGS **unverified**.
- The exact code commit is authoritative; a Git tag or GitHub Release must be verified separately. Do not infer creation of a `v1.0.0` tag from website branding.

## 5. Follow-up hardening
- Migrate inline JavaScript to reviewed static modules and pin CSP script hashes.
- Vendor Three.js at a pinned reviewed digest / supply-chain integrity strategy.
- Pin GitHub Actions to commit SHAs after verifying official action digests.
- Introduce headless browser smoke tests + WebGL fallback paths and CI link checks.
- Add independent computational geometry overlap certificates.
