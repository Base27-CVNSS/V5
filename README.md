# V5 — Pentagonal Geospatial Indexing System

**V5 Research Reference v1.0.0 (2026-10-11): a versioned experimental weak-pentagon reference implementation, V5-64 address codec and research website — not a production global DGGS.**

[Website](https://base27-cvnss.github.io/V5/) · [English Technical Specification](https://base27-cvnss.github.io/V5/technical-specification.html) · [Comparison H3/S2/V5 (VI)](docs/COMPARISON_H3_S2_V5_VI.md) · [V5-32 specification (Markdown)](docs/TECHNICAL_SPEC_EN.md) · [Chứng minh toán học (VI) — V5/H3/S2](https://base27-cvnss.github.io/V5/mathematical-proof.html) · [3D spherical simulation](https://base27-cvnss.github.io/V5/#simulation3d) · [Mathematical paper](docs/paper.tex) · [Proof notes](docs/PROOF.md) · [Python prototype](src/v5.py) · [V5-64 codec](src/v5id.py) · [H3 comparison](https://h3geo.org/)

> **Research status (2026):** A weak, geometrically nested 32-child refinement exists for simple, nondegenerate planar pentagons and can be transferred to a spherical dodecahedral atlas. The construction allows **nonconvex cells and hanging nodes**. An edge-to-edge, uniformly shape-regular, equal-area V5 grid is **not proven**. Do not describe this as a production DGGS or as faster than H3.

## Interactive 3D spherical simulation

The website now includes a dedicated [V5 Spherical Geometry Lab](https://base27-cvnss.github.io/V5/#simulation3d), implemented with **Three.js WebGL (ES modules)** and mathematically generated twelve-root dodecahedral geometry.

Interactive modes:
- **Spherical excess**: For a simple geodesic pentagon on a sphere, `Σα=3π+A/R²>3π`. Each of the twelve regular dodecahedral root faces has five 120° angles and spherical excess `π/3`; total area excess is `4π`.
- **Vertex closure**: Exactly 20 root vertices, each with three 120° wedges, hence `Σα(v)=2π` with negligible numerical residual.
- **Curvature obstruction**: Compare the circumference `2πR sin(λθ)` after a radial change of geodesic radius with `λ·2πR sin(θ)` expected under a hypothetical metric similarity. The difference illustrates the failure of exact constant-scale spherical similarity for `0<λ<1`. The rigorous proof uses preservation of Gaussian curvature, not the ring example alone.
- **Weak hierarchy visualization**: r=0 (12 roots); r=1 (384 weak cells globally); r=2 (1,024 cells shown inside one selected root, with 12,288 globally inferred). Child cells are **possibly nonconvex, nonconforming, and not uniform-area**.

The Three.js version is pinned in `index.html`; Internet access is required to load its CDN modules. Pure geometry calculations are in [web/v5-sphere-math.js](web/v5-sphere-math.js); the WebGL interface is [web/v5-3d.js](web/v5-3d.js). Run math regression tests with `node --test tests/test_sphere_math.mjs`.

**Distinction:** A 32-child hierarchical partition exists, but no exact contraction similarity with a universal constant `λ<1` exists on spherical open sets. These statements are compatible.

## Key results

For the surface of a convex dodecahedron, each of the twelve root pentagons can be refined into 32 simple pentagons, and this operation can be repeated at every finite level. Radial projection maps the entire nested partition to the sphere:

```text
12 root pentagons → 384 → 12,288 → 393,216 → 12,582,912 → …
N(r) = 12 · 32^r
```

**Proof sketch.** Triangulate any simple nondegenerate pentagon as a fan from a suitable vertex A, terminating at the opposite edge CD. Cut A to an interior point Q of CD by a two-segment path A–T–Q whose middle point T is moved slightly off the straight chord. The two resulting polygons have five noncollinear corners, are simple, and have disjoint interiors. Repeat this binary subdivision five times to obtain 32. Begin from the twelve faces of a regular dodecahedron, and radially project its surface onto the sphere. The projection is a homeomorphism, preserving partition incidence and non-overlap.

The **geometric contraction rate, conformity, numerical quality, and spherical equal-area properties remain open**.

### Established necessary restrictions

* An edge-to-edge spherical pentagonal tiling satisfies `sum_v(deg(v)-3)=F/2-6`. In particular, a tiling by more than twelve pentagons cannot have degree three at every vertex.
* An edge-to-edge 32-child refinement requires an **even number of boundary edges**, because `5F=2I+B`. Five unsplit parent boundary edges cannot suffice.
* A fivefold rotationally symmetric partition into convex cells has orbit sizes 1 or 5, with at most one invariant convex cell; 32 cells cannot respect full fivefold rotational symmetry.
* A sphere cannot be edge-to-edge tiled by more than twelve **congruent regular spherical pentagons** with geodesic edges.

## 50 research use cases (GIS · WebGIS · GeoAI · Spatial LLM · SLAM · LiDAR · BIM)

The [interactive 50-use-case catalog](https://base27-cvnss.github.io/V5/use-cases.html) and [full Vietnamese Markdown scenarios](docs/USE_CASES_50_VI.md) provide seven groups of concrete research cases, each with inputs, workflow, falsifiable V5 hypothesis, required infrastructure, and measured acceptance criteria. Three browser demonstrations cover V5-64 bit encoding, area-weighted means and 32-way hierarchy counts using synthetic data only. The catalog is backed by [a typed JavaScript dataset](web/v5-usecases-data.js), [pure mathematics helpers](web/v5-usecases-math.js) and [Node regression tests](tests/test_usecases.mjs).

**Caution:** equal-area 0%, exactly five neighbors, five-way branching/32 encoded levels, and performance superiority are not validated V5 attributes. Existing [A5 pentagonal global indexing](https://a5geo.org/docs) already describes equal-area cells, 31 levels and 64-bit indexes; V5 does not claim these as unprecedented. Current V5-64 uses **32 children per weak parent**, **5 bits per digit**, and **10 encoded levels**. SLAM/LiDAR/BIM examples require independent 3D/voxel support.

## V5 Research Reference v1.0.0 — security & QA release scope

[Release notes](CHANGELOG.md) · [Release criteria](docs/RELEASE_1.0.0.md) · [Security policy](SECURITY.md) · [Source version](VERSION) · [CI quality gate](.github/workflows/quality.yml) · [Pages deployment gate](.github/workflows/pages.yml)

Release v1.0.0 covers the static research site, documented weak planar/spherical constructions, the experimental 64-bit address codec, and automated geometry/canonical-ID tests. **It does not certify a fully convex, conforming, equal-area or WGS84-ready DGGS.**

GitHub Actions quality checks now include Python and Node tests, browser-source syntax checks, and a static-site security audit; Pages deployment is configured to require successful verification. **Do not mark the actual run as PASS without inspecting the workflow logs.** No Git tag or GitHub Release should be inferred solely from the presence of `VERSION`. Current CSP still allows inline scripts and remote Three.js CDN modules are version-pinned but not cryptographically integrity-pinned.

## Quick start

Requires Python 3.10+; core prototype uses the Python standard library only.

```bash
python -m unittest discover -s tests -v
python src/v5.py --depth 5 --json > v5-32.json
python src/v5.py --depth 5 --svg > v5-32.svg
python -m src.v5id
```

The prototype uses rational coordinates (via `fractions.Fraction`) for exact planar orientation, areas, and intersection checks. This is intentionally a research prototype, **not** a latitude/longitude lookup library.

## 2026-10-11: Mathematical proof and responsible deployment

The [Vietnamese V5-32 proof and comparison page](mathematical-proof.html) presents Gauss–Bonnet, Euler/parity, the spherical Riemannian no-homothety theorem, and the distinction between exact similarity and diameter contraction. It covers application-dependent selection versus H3/S2 and the current 10-level limit of the V5-64 codec. **Strong all-convex conforming 32-child recursive contraction has not been verified in this repository.** V5 performance superiority over H3 or S2 has not been measured.

## English Technical Specification (Draft v1.1 — 2026-10-11)

The [English technical specification](docs/TECHNICAL_SPEC_EN.md) and its [interactive web companion](https://base27-cvnss.github.io/V5/technical-specification.html) are now the architecture reference for **V5-32 / V5-64 v1**. They document the exact implemented 4+4+6+50-bit address, ten 5-bit path digits and 10-level limit, with canonical hex vectors, API maturity statuses, proposed GeoAI models, a H3/S2 comparison, benchmark requirements and an explicit conformance checklist.

The earlier 5-child / 3-bit / 31-level description is treated as a separate **superseded proposal**, not the running codec. Strict equal-area spherical cells, uniform convex edge-to-edge 32-way refinement, WGS84 lookup and any speedup over H3/S2 are **not validated**.

## Research roadmap

| Capability | Status |
| --- | --- |
| Finite weak 32-child existence theorem | Proven (under stated geometric assumptions) |
| Deterministic exact-arithmetic planar prototype | Implemented |
| Spherical transfer via a dodecahedral radial projection | Proven as construction |
| Canonical 64-bit base-32 address pack/unpack/parent/children | Implemented in Python (research only) |
| Conforming edge-to-edge recursive pentagonal grid | Open |
| Uniformly bounded aspect ratio / cell diameters | Open |
| WGS84 projection, point lookup, neighbor traversal | Not implemented |
| Performance comparison with H3 or S2 | Not measured |

## Implemented V5-64 v1 path format (research codec)

`version:4 | resolution:4 | root:6 | path:50` = 64 bits. The path contains up to ten 5-bit base-32 digits. This format is implemented for canonical root/path addresses (not geolocation). The canonical binary path codec is **implemented in [src/v5id.py](src/v5id.py)** and documented in [docs/V5-64.md](docs/V5-64.md), but this is **not** a complete operational geospatial index or coordinate lookup API. The number five in `5-bit` does not mathematically imply five polygon edges.

## Research publication

This repository includes an English-language LaTeX **preprint draft** in [docs/paper.tex](docs/paper.tex), styled as a scholarly manuscript with theorem, proof, limitations and future work. The preprint is **not submitted to, endorsed by, or indexed on arXiv**.

## Attribution and licensing

**Long Ngo · 2026**

**Vietflexmap Copyright (c) 2025**

**V5 is licensed under the Apache 2.0 License.** See [LICENSE](LICENSE) and [NOTICE](NOTICE). H3 is an independent project by Uber, referenced for comparison and inspiration; V5 does not copy H3's implementation.

## References

* [H3 documentation](https://h3geo.org/docs/) and [Uber H3 source](https://github.com/uber/h3)
* [H3 Cell Index format](https://h3geo.org/docs/library/index/cell/)
* [OGC DGGS standard](https://docs.ogc.org/as/20-040r3/20-040r3.html)
* [arXiv](https://arxiv.org/) — archive referenced for scholarly presentation style only
