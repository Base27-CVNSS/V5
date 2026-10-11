# V5 Geo Adapter v0.1 — Evidence-gated upgrade (11 October 2026)

Status: EXPERIMENTAL RESEARCH. Not an OGC-certified DGGS, not equal-area, not proven faster than H3, S2 or A5.

## Implemented
The JavaScript ES module in [web/v5-geo.js](../web/v5-geo.js) adds angular sphere geolocation using the twelve dodecahedral root faces and the previously published 32-child weak refinement.

- latLngToCell(lat,lon,resolution): finite angular degrees to canonical V5-64 hex, geometry levels 0–2.
- cellToBoundary, cellToPoint: five vertices and certified interior sample point (not area centroid).
- cellToGeoJSON: research GeoJSON feature; antimeridian splitting not implemented.
- decodeCell, cellParent, cellChildren: V5-64 v1 format, version and padding validation.
- rootNeighbors: reciprocal five-neighbor graph at resolution zero, **not** deeper levels.
- Standalone browser demonstration: [Geo Lab](../geo-lab.html).
- Deterministic CI tests: [tests/test_geo.mjs](../tests/test_geo.mjs).
- Local benchmark: run `node scripts/benchmark_geo.mjs 200 1`. Reports measured local V5 runtime only; comparisons require equalized accuracy, area scale, datasets and hardware.

## Explicit remaining limitations
1. Weak partitions may contain concave cells and hanging nodes. There is no edge-to-edge, convex, equal-area or uniform shape-regularity proof.
2. Coordinates are angular directions on a unit sphere; no WGS84 ellipsoidal geodesic or authalic transformation is implemented.
3. Numerical stability beyond resolution 2 is not certified, even though V5-64 packs 10 levels.
4. Polygon dateline splitting, root-seam error bounds and complete child-neighbor queries are not implemented.
5. No spherical overlay nonoverlap proof, area CV / max diameter guarantees, zone cover, spatial join or OGC API conformance tests.
6. Benchmark output is empirical for this experiment only: NOT evidence of H3/S2/A5 superiority or third-place global DGGS ranking.

## Evidence gates before an honest 9/10 rating
| Gate | Evidence required | Status |
| --- | --- | --- |
| G1 | Global coordinate-to-ID / ID-to-geometry, poles/seams, levels 0–10 | Partial 0–2 |
| G2 | Independent no-gap/no-overlap spherical overlay and edge-to-edge validation | Open |
| G3 | Quantitative equal-area / shape regularity / max diameter bounds | Open |
| G4 | Complete neighbor / polygon cover / spatial join | Open |
| G5 | Official OGC conformance test suite | Not run |
| G6 | QGIS, PostGIS and MapLibre integration tests | Open |
| G7 | Repeatable matched accuracy benchmark H3/S2/A5 with confidence intervals | Open |
| G8 | Threat model, fuzzing, supply chain security, browser E2E, code review | Partial |
| G9 | Third-party scientific review and documented novelty against A5 | Open |

The core [OGC DGGS standard](https://docs.ogc.org/as/20-040r3/20-040r3.html) and [OGC API DGGS Core](https://docs.ogc.org/is/21-038r1/21-038r1.html) supply the certification framework. OGC API DGGS compliance includes Core plus Zone Query or Zone Data Retrieval; tests are not implied by having GeoJSON output.

### Position
V5 may aspire to rank as a third major indexing system, but no objectively defined third-place ranking or Nobel Prize claim is supported by these results. The best next milestone is geometry certification and true cross-system performance reproducibility.
