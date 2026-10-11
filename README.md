# V5 — Pentagonal Geospatial Indexing System

**An experimental, mathematically grounded pentagonal spatial indexing research project.**

[Website](https://base27-cvnss.github.io/V5/) · [Mathematical paper](docs/paper.tex) · [Proof notes](docs/PROOF.md) · [Python prototype](src/v5.py) · [H3 comparison](https://h3geo.org/)

> **Research status (2026):** A weak, geometrically nested 32-child refinement exists for simple, nondegenerate planar pentagons and can be transferred to a spherical dodecahedral atlas. The construction allows **nonconvex cells and hanging nodes**. An edge-to-edge, uniformly shape-regular, equal-area V5 grid is **not proven**. Do not describe this as a production DGGS or as faster than H3.

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

## Quick start

Requires Python 3.10+; core prototype uses the Python standard library only.

```bash
python -m unittest discover -s tests -v
python src/v5.py --depth 5 --json > v5-32.json
python src/v5.py --depth 5 --svg > v5-32.svg
```

The prototype uses rational coordinates (via `fractions.Fraction`) for exact planar orientation, areas, and intersection checks. This is intentionally a research prototype, **not** a latitude/longitude lookup library.

## Research roadmap

| Capability | Status |
| --- | --- |
| Finite weak 32-child existence theorem | Proven (under stated geometric assumptions) |
| Deterministic exact-arithmetic planar prototype | Implemented |
| Spherical transfer via a dodecahedral radial projection | Proven as construction |
| 64-bit base-32 hierarchical **encoding proposal** | Specification only |
| Conforming edge-to-edge recursive pentagonal grid | Open |
| Uniformly bounded aspect ratio / cell diameters | Open |
| WGS84 projection, point lookup, neighbor traversal | Not implemented |
| Performance comparison with H3 or S2 | Not measured |

## Suggested V5-64 layout (proposal only)

`version:4 | resolution:4 | root:6 | path:50` = 64 bits. The path contains up to ten 5-bit base-32 digits. This is only a **binary format proposal**, and is not a complete operational 64-bit geospatial index. The number five in `5-bit` does not mathematically imply five polygon edges.

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
