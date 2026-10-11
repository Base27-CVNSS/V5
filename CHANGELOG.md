# Changelog — V5

All notable changes to the *research reference implementation and documentation* are recorded here. This version scheme does **not** imply that strong convex DGGS geometry, WGS84 lookup or OGC conformance has been achieved.

## [1.0.0] — 2026-10-11

**Release name:** V5 Research Reference 1.0.0 (scope-limited).

### Added
- Experimental **Spatial DNA v0.1** optional 54-byte CRC/HMAC-authenticated sidecar with versioned marks per level and regression tests; CellID v1 remains unchanged.
- Entropy-capacity comparison: the often-quoted 77.4% applies to an alternative five-child/3-bit format, not the implemented 32-child/5-bit path. A 15-level base-5 path needs 35 densely encoded bits rather than 45 fixed-digit bits.
- Browser-side entropy capacity calculator and detailed mathematical/security caveats (no encryption/ECC/ACL/provenance proof).
- 50-case research catalog covering GIS, WebGIS, GeoAI, Spatial LLM, SLAM, LiDAR and BIM, with falsifiable hypotheses, readiness gates and three offline synthetic demo labs.
- Node tests for data completeness, canonical V5-64 vectors, area weighting, hierarchy count and new website links.

- Release scope, mathematical status labels and explicit API maturity matrix.
- English V5-32 Technical Specification and Vietnamese proof/decision guide.
- Canonical 4+4+6+50-bit V5-64 codec test vectors and 32-child recursive weak-geometry examples.
- Security policy, release checklist, static website audit and CI-gated deployment.
- Cross-language JS/Python tests for malformed pentagon geometry, including self-crossing shapes.

### Corrected
- Reject self-intersecting five-corner polygons instead of relying solely on signed area.
- Restrict V5-64 v1 codec to version 1 and reject boolean values as numeric IDs/fields.
- Distinguish metric homothety impossibility from diameter-convergence research.
- Resolve 5-way vs 32-way ambiguity: V5-64 v1 encodes 10 × 5-bit base-32 digits, depth 0..10.
- Replace unsupported exact equal-area, always-five-neighbors and speedup assertions.
- Include English/Vietnamese specification page changes in GitHub Pages deployment.

### Deferred: not production-ready
- Uniformly convex edge-to-edge 32-child spherical refinement with a certified global contraction constant.
- Deterministic WGS84 root orientation, spatial index lookup and global neighbor graph.
- Geodesic area / error certificates, independent geometry overlay verification, performance benchmarks vs H3 and S2, verified GPU/GeoAI SDK.
- Full browser/WebGL end-to-end tests, SRI-pinned or self-hosted Three.js, external security audit and OGC conformance.

**Release identity:** Website/documentation/codec **1.0.0**; codec binary **v1**. No claim that V5-DGGS core geometry is v1.0 production-complete.
