# V5-32 Technical Specification
## Experimental Hierarchical Pentagonal Geospatial Index — Draft v1.1

**Project:** V5 / Vietflexmap  
**Author / attribution:** Long Ngo · 2026 · Vietflexmap Copyright (c) 2025  
**License:** Apache License 2.0 (repository license)  
**Document status:** Research draft, not a formal standard, not peer reviewed  
**Specification date:** 2026-10-11  
**Reference implementations:** `src/v5.py`, `src/v5id.py`  
**Companion documents:** [Proof audit](PROOF.md), [V5-64 codec](V5-64.md), [English web guide](../technical-specification.html), [Vietnamese mathematical analysis](../mathematical-proof.html)

> **Conformance warning.** This specification documents an implemented *weak planar 32-way pentagon refinement* and a canonical 64-bit path codec. A production global discrete grid composed exclusively of **convex**, **edge-to-edge**, **uniformly shape-regular**, strictly **equal-area** spherical pentagons has **not** been validated. No performance advantage over H3, S2 or raster is claimed.

---

## 0. Status classes and RFC-style requirement language

A requirement marked **MUST / MUST NOT** is normative **within the named subsystem** (for example the implemented V5-64 codec); it does not imply that other proposed subsystems exist. **SHOULD / SHOULD NOT** identify recommended behavior, and **MAY** is optional.

| Maturity | Meaning |
| --- | --- |
| **PROVED (weak)** | Geometric proposition proved under explicit assumptions, not a performance claim |
| **IMPLEMENTED** | Present in repository and callable; test coverage varies |
| **PROTOTYPE** | Demonstration without complete global indexing or conformance |
| **PROPOSED** | Interface, algorithm or acceptance contract awaiting implementation |
| **OPEN** | Mathematical, algorithmic or empirical question without an accepted proof/evaluation |
| **PROHIBITED CLAIM** | Must not be stated as demonstrated |

### 0.1. Authoritative consistency decision

An earlier Vietnamese design note proposed **5-way** branching, **three-bit** child digits, up to **31** resolution levels, strictly equal-area cells and speculative nanosecond benchmarks. That is **a different and internally inconsistent design**, not the executable V5-32 specification:

- A 45-bit payload of 15 three-bit slots supports **at most 15 encoded child steps**, not 31.
- Five-way branching produces `12 × 5^r` cells, **not** the existing `12 × 32^r`.
- Equal-area, homogeneous five-neighbor behavior, WGS84 lookup and the stated nanosecond latencies are **not established**.
- S2 cells are **spherical quadrilaterals**, not triangles, and S2 is **not strictly equal-area**.
- Both H3 and S2 use **64-bit cell identifiers**. The number of polygon sides alone implies no speed advantage.

**Decision V5-ADR-001:** The current repository's **32-way, five-bit, 10-level V5-64 v1** format is authoritative. Treat the old 5-way/3-bit draft as an unimplemented alternative requiring a separately versioned codec.

## 1. Intended use, non-goals and geometry model

V5 investigates a spatial hierarchy motivated by pentagonal cell structure, topological modeling, multiresolution AI tokens and compact parent/child addresses.

**Implemented scope:**
1. A deterministic 32-child **weak** refinement of strict simple pentagons, including potentially concave descendants.
2. Recursive finite-depth refinement of these planar cells.
3. Radial transfer of dodecahedral-face partitions to a mathematical sphere, preserving coverage and interior non-overlap.
4. 64-bit root/path packing, unpacking, immediate parent and child operations.

**Not in scope as existing functionality:** guaranteed convex 32-child refinement; conforming edge-to-edge global topology; equal-area cells; latitude/longitude-to-ID; cell-to-WGS84 polygon; valid geographic neighbors; canonical global dodecahedral orientation; full OGC conformance; production performance; automatic AI model training.

The reference surface is a round 2-sphere `S²_R` unless a section explicitly defines an ellipsoidal earth model. WGS84 geodetic latitude is **not** interchangeable with a spherical/geocentric latitude without a defined conversion.

## 2. Core mathematical and topological contracts

### 2.1. Cell definition

A strict planar pentagon is a simple closed polygon with five distinct corners, no three consecutive corners collinear, positive area, and **not necessarily convex**.

A **weak partition** of a parent `P` is a set of child polygons `{P_i}` with:
- `P = ∪_i P_i`;
- `int(P_i) ∩ int(P_j) = ∅` for `i ≠ j`;
- each child has exactly five genuine corners and positive area;
- hanging vertices along neighboring edges **are permitted**.

An **edge-to-edge partition** has a stricter intersection contract: every intersection of two distinct cells is empty, a shared full edge or a shared vertex. A weak partition does **not** imply this property.

A **spherically convex** pentagon is assumed contained in an open hemisphere, with five short great-circle boundary arcs and the corresponding geodesically convex interior. Radial transfer of an arbitrary concave planar pentagon does **not** make it convex.

### 2.2. Weak subdivision and 32-way hierarchy — PROVED (weak) / IMPLEMENTED

The bent-crosscut lemma divides each strict simple pentagon into two strict simple pentagons. Apply it five times to each resulting cell:

\[
1 \longmapsto 2^5=32,\qquad N(r)=12\cdot 32^r.
\]

Every finite level is geometrically nested. **The construction does not establish a uniform diameter contraction, equal area, uniform aspect ratio or conformity.** See [the proof audit](PROOF.md).

### 2.3. Radial spherical atlas — PROVED as a topological transfer

Take a regular dodecahedron `D` centered at the origin. Its boundary admits the radial homeomorphism

\[
\Phi(x)=R\,x/\|x\|,\quad x\in\partial D.
\]

It preserves cell-incidence topology, union and interior disjointness. Straight edges inside a root plane map to great-circle arcs. It is **not** a metric homothety or an equal-area transform.

### 2.4. Curvature / angular excess — PROVED under stated assumptions

For a positively oriented geodesic spherical pentagon of area `A>0` on `S²_R`,

\[
\sum_{i=1}^{5}\alpha_i-3\pi=A/R^2 >0.
\]

For gap-free cells meeting at an ordinary vertex on the smooth sphere, the **sector angles** total `2π`. These identities are **necessary** geometric conditions, not a standalone construction theorem.

### 2.5. No exact nontrivial Riemannian homothety — PROVED

Let `U,V` be nonempty open subsets of the **same round sphere** with its metric `g`. If a local diffeomorphism `f` satisfies `f^*g=\lambda^2 g` for **constant** `\lambda>0`, curvature invariance gives

\[
1/R^2=K(f^*g)=K(\lambda^2g)=1/(\lambda^2R^2);
\quad \lambda=1.
\]

Therefore `0<\lambda<1` is impossible for an exact metric similarity. **This does not prohibit a weaker bound** `diam(P_i)≤\rho\,diam(P)`, `0<\rho<1`, which must be proved separately for a specific subdivision rule.

### 2.6. Euler and parity — PROVED necessary conditions

For a closed edge-to-edge all-pentagon spherical cell decomposition,

\[
V-E+F=2,\quad 5F=2E,\quad
\sum_v(\deg(v)-3)=F/2-6.
\]

For an edge-to-edge subdivision of a parent into `F=32` pentagons, let `B` count all boundary child-edge segments and `I` count interior edges:

\[
160=2I+B\Longrightarrow B\equiv0\pmod2.
\]

Five uncut parent edges (`B=5`) are impossible. Shared parent boundaries must use a coordinated edge-refinement protocol. If each of five parent edges is bisected, `B=10` and `I=75`; these are counts, **not** a proof of existence of 32 convex pieces.

### 2.7. Strong geometry target — OPEN / proposed acceptance contract

A `strong_refine32(P)` procedure would have to certify, for every admissible parent and at all levels:

1. Exactly 32 children with **strict spherical convexity** and five nondegenerate geodesic sides.
2. Complete coverage, interior disjointness and edge-to-edge conformity **including across neighboring parents**.
3. A fixed `0<\rho<1` with `diam(P_i)≤\rho\,diam(P)`, or a separately specified, weaker global rate `D_r≤C\rho^r`.
4. Controlled shape regularity, numerical robustness and deterministic boundary ownership.
5. Reproducible exact or certified computational predicates and adversarial global tests.

These are research goals, **not current guarantees**. Exact Riemannian self-similarity is explicitly excluded.

## 3. Binary identity scheme: V5-64 version 1 — IMPLEMENTED

### 3.1. Canonical bit positions (big-endian bit numbering)

| Bits | Width | Field | Canonical v1 rule |
| --- | ---: | --- | --- |
| 63..60 | 4 | version | Version MUST equal 1 for both encode and decode; other versions are reserved/unsupported |
| 59..56 | 4 | resolution | Integer 0..10 |
| 55..50 | 6 | root | Integer 0..11, one of twelve mathematical dodecahedral roots |
| 49..0 | 50 | child path | Ten successive 5-bit digits 0..31, **left-aligned**; unused suffix MUST be zero |

Total `4+4+6+50=64` bits. This **is not** the H3 format and does not contain mode, sentinel-7 padding or independent resolution levels beyond 10.

The 64-bit word is an **unsigned** integer. As a portable text representation it SHOULD be a fixed-width lower-case hexadecimal string with `0x` prefix and 16 hexadecimal digits. JSON MUST NOT encode arbitrary UInt64 identities as IEEE-754 Number values when precision loss is possible; use strings or a binary wire format.

**Codec semantics:** A 32-way child digit is the five-bit integer `0..31`. The experimental planar example interprets its high-to-low bits as five binary subdivision choices. A child digit is **not** a bearing, edge index, geodetic coordinate, or five-neighbor count.

### 3.2. Encoding

Let `r=len(path)`. For `root∈[0,11]`, `r∈[0,10]`, and each `d_i∈[0,31]`:

\[
ID=(v\ll60)\;|\;(r\ll56)\;|\;(root\ll50)\;|\;
\bigvee_{i=0}^{r-1}\bigl(d_i\ll(45-5i)\bigr).
\]

Unused path bits are zero. No two canonical tuples (`version, root, path`) encode to the same UInt64.

### 3.3. Decode validation — MUST for v1

1. Reject values outside `[0,2^{64})`, invalid integer types or malformed hex strings.
2. Reject every version other than 1. The v1 decoder MUST NOT interpret future-version payloads under old semantics.
3. Reject resolution greater than 10 or root greater than 11.
4. Reject any nonzero padding bits below the used path prefix.
5. Extract exactly `r` 5-bit digits; reconstruct and compare to the input when validating canonicality.

`0x0000000000000000` is invalid. Hex strings are serialized **unsigned**: SQL signed 64-bit transport and JavaScript Number require explicit care.

### 3.4. Verified arithmetic test vectors

| root | path | resolution | Expected canonical UInt64 hex |
| --- | --- | ---: | --- |
| 0 | [] | 0 | `0x1000000000000000` |
| 11 | [] | 0 | `0x102c000000000000` |
| 7 | [2,0,4] | 3 | `0x131c402000000000` |
| 0 | [7,16,31] | 3 | `0x1300f0f800000000` |
| 11 | [31,31,31,31,31,31,31,31,31,31] | 10 | `0x1a2fffffffffffff` |

These vectors follow the exact shifts currently implemented in `src/v5id.py`. At resolution 10 a child request MUST fail. At resolution 0 a parent request MUST fail. A malformed word with nonzero unused path bits MUST fail.

### 3.5. Complexity and depth

Packing and unpacking are `O(r)` in the **current reference Python** implementation. A specialized fixed-width parent-prefix operation can be `O(1)` on a machine word, but that must not be misrepresented as an existing measured implementation. Enumerating all 32 children is output-size `Θ(32)`.

- Total cells per level `r`: `12·32^r`.
- Maximum encoded depth of **this v1 format**: `r=10`.
- Level 10 count: **13,510,798,882,111,488** globally in the abstract hierarchy.
- Estimated global mean cell area at level 10, if treated as a full sphere with mean Earth area ~510.1 million km²: roughly **0.038 m²**. This is a **mean only**, never a claim that each cell is equal-area or of similar shape.
- Finite UInt64 v1 encoding is separate from mathematically unlimited finite-depth subdivision.

### 3.6. Object identities are not spatial identities

A CellID identifies a spatial partition cell for a specific **grid version, root orientation, projection and refinement algorithm**. It MUST NOT be reused as a stable cadastral, building, IoT device or vehicle object ID. A separate EntityID (for example UUID/128-bit) MAY map to multiple cells and times.

## 4. Geographic reference, root orientation and coordinate-to-cell — PROPOSED

### 4.1. Reference model

A production specification MUST freeze:
- the earth model (round sphere and radius, or WGS84 ellipsoid);
- dodecahedron orientation/rotation and deterministic root numbering 0..11;
- the mapping from geodetic WGS84 input to the geometric sphere (if used);
- the actual 32-child geometry generator and its version;
- boundary tie-breaking rules;
- precision, error budgets and region-cell intersection predicates.

Without these, identical UInt64 IDs may refer to different geographic regions in separate implementations.

### 4.2. Prospective coordinate lookup contract

`latlng_to_cell(latitude,longitude,resolution)` is **NOT IMPLEMENTED** as a global validated operation.

A proposed implementation should:
1. Validate geodetic coordinates, units and resolution.
2. Map geodetic WGS84 to the chosen reference sphere/ellipsoid transform.
3. Select a unique canonical root face using a documented boundary-owner rule.
4. Traverse the 32-child geometry, selecting exactly one child at each level.
5. Pack with V5-64 v1 only after the root/child contracts have been validated.

`cell_to_boundary` and `cell_to_center` are also proposed global operations. A cell centroid MAY be the surface-area centroid of its real geometry, but cannot be inferred solely by averaging latitude/longitude values.

### 4.3. Boundary semantics

On geometric boundaries the implementation MUST specify a deterministic single-owner rule for point lookup; possible policies include the lowest canonical CellID among touching closed cells. Neighbor/topological intersection logic must still recognize boundary membership in all touching cells. Coordinate wrapping at ±180° and pole handling require conformance tests.

### 4.4. Measurement / error budget

Each cell operation SHOULD disclose:
- numeric predicate precision and geodesic model;
- surface-area calculation method;
- maximum positional error for reported vertices;
- tested range of levels and degenerate/near-edge cases;
- whether an asserted error is theoretical or measured.

The Gauss–Bonnet calculation on a sphere is not a geodesic area formula for WGS84 ellipsoids without additional transformation.

## 5. Topology, adjacency and graph model — PROPOSED

A geometric pentagon has five **sides**, but a weak subdivision with hanging nodes can produce a different number of cells touching its boundary. It is incorrect to assert exactly five adjacent **cells** for all V5 weak cells.

A production graph MUST distinguish:
- `edge_adjacent(A,B)`: nonzero shared boundary arc;
- `vertex_adjacent(A,B)`: at least one common vertex with no shared arc;
- `parent/child`: address-tree relation, not a distance-neighbor relation;
- `within/intersects`: geometric relation according to defined boundary semantics.

Graph edges MAY store shared-boundary length, orientation, bearing, traversal cost, observation uncertainty and effective time. Globally fixed compass slots (north / northeast / etc.) are **not canonical** directions on a curved sphere and MUST NOT be inferred from 5-bit child digits.

For a **verified edge-to-edge, non-degenerate** conforming all-pentagon tiling, each cell has five side-sharing cell neighbors. That conditional fact does not apply to the current weak prototype.

## 6. API design and honest implementation table

### 6.1. Existing Python API (implemented)

| API | Status | Semantics |
| --- | --- | --- |
| `encode(root,path,version=1)` | IMPLEMENTED | Canonical V5-64 UInt64 packing |
| `decode(word)` | IMPLEMENTED | Validates header/padding and returns address |
| `parent(word)` | IMPLEMENTED | Immediate tree ancestor |
| `child(word,digit)` | IMPLEMENTED | One indexed descendant, 0..31 |
| `children(word)` | IMPLEMENTED | All 32 immediate children |
| `to_hex(word)` | IMPLEMENTED | Fixed-width hexadecimal serialization |
| `geometry_in_example_root(word)` | PROTOTYPE | Planar sample only; **not** GPS geometry |
| `split_pentagon(P)` | PROTOTYPE | Bent crosscut weak binary subdivision |

### 6.2. Proposed interoperable geospatial API

| Function | Status | Prerequisite |
| --- | --- | --- |
| `latlng_to_cell(lat,lon,res)` | PROPOSED | Stable earth model, global root atlas, canonical boundary rule |
| `cell_to_boundary(id)` | PROPOSED | Versioned geometry and geodesic output |
| `cell_to_center(id)` | PROPOSED | Declared centroid convention |
| `cell_to_neighbors(id,kind)` | PROPOSED | Verified edge graph |
| `polygon_to_cells(polygon,res)` | PROPOSED | Validated spherical/ellipsoidal intersection |
| `is_ancestor(parent,child)` | PROPOSED API (derivable from path) | Validated codec and version/root equality |
| `cell_area(id)` | PROPOSED | Spherical/ellipsoidal area method |
| `cells_to_tensor(ids)` | PROPOSED | Defined tensor and sparse-index representation |

No C/C++/CUDA functions, PyTorch package or global WGS84 API should be represented as currently shipping unless added and tested.

### 6.3. Error contract

Suggested stable error categories: `INVALID_ID`, `UNSUPPORTED_VERSION`, `INVALID_RESOLUTION`, `INVALID_COORDINATE`, `GEOMETRY_UNAVAILABLE`, `AMBIGUOUS_BOUNDARY`, `TOPOLOGY_NOT_CONFORMING`, `NUMERICAL_UNCERTAINTY`. Define their wire representations in a later API version; they are not implemented constants today.

## 7. AI, GeoAI and World Models — PROPOSED

### 7.1. Hierarchical tokenization

A cell address (`root,path,resolution,version`) can be tokenized into discrete root/digit embeddings. This is an **architectural possibility**, not evidence of more accurate foundation models. Fixed-length one-hot vectors over all level-10 cells would be computationally infeasible; use sparse/multilevel embeddings, sampled tiles, compact token vocabularies or hashed embeddings with measured collision rates.

### 7.2. Irregular-area loss

For spherical polygons of unequal area, an area-weighted objective reduces sampling biases when the target is a surface-area integral:

\[
L_{\mathrm{area}}=
\frac{\sum_i A_i \ell_i}{\sum_i A_i}.
\]

Any benchmark MUST report whether unweighted per-cell loss or area-weighted loss is used. An equal-area guarantee is **not** available for V5.

### 7.3. Graph learning

A graph neural network MUST use the **actual certified neighbor graph**, not assume a fixed 5-neighbor matrix for weak cells. Sparse CSR/COO adjacency is a portable reference representation. Padding/masking to 5 slots is acceptable only in explicitly validated edge-to-edge level sets.

### 7.4. Multi-resolution training

Parent and child address relations are implementable now; cross-scale data aggregation requires geometry, coverage weights and appropriate uncertainty propagation. A fine-to-coarse sum for extensive variables differs from area-weighted averages for intensive variables.

### 7.5. Space-time and privacy

A CellID has **no time field**. Use external timestamps/time bins and observation tables. Any proposed privacy-preserving CellID encoding MUST NOT confuse obfuscation or an unsigned integer with cryptographic encryption or access control.

## 8. Data interchange and storage — PROPOSED

| System | Recommended representation | Caveat |
| --- | --- | --- |
| Python | native integer in range 0..2^64−1 | Caller validates canonical ID |
| Arrow / Parquet | UInt64 or fixed-width binary + schema metadata | Record codec_version, atlas_version and resolution |
| DuckDB | UBIGINT | Measure index selectivity and range scans |
| PostgreSQL | BIGINT where encoded ID ≤ 2^63−1; otherwise 8-byte BYTEA or a lossless decimal/hex representation | Future version fields 8..15 may set the sign bit |
| BigQuery | INT64 only when within signed range; otherwise STRING/BYTES | Do not silently reinterpret unsigned values |
| JavaScript | BigInt or canonical hex string | Number is only exact through 2^53−1 |
| JSON / APIs | canonical fixed-width hex string | Preserve leading zeros and use declared schema |

The version-1 encoder creates IDs beginning with hex digit `1`, so these values fit signed BIGINT; future version digits 8..15 may not. A conventional integer sort order is not guaranteed to be a spatial locality curve or a prefix range compatible with other systems.

## 9. Performance and benchmarking — NOT MEASURED

No authoritative V5 nanosecond latency, GPU bandwidth, 100× vector speedup or superiority over H3/S2 has been measured. Report an absent result as **TBD**, not as a prediction.

**Required comparisons:** H3 v4 and a pinned S2 implementation, plus a suitable raster/vector baseline, using matching spatial accuracy and validated geometry. Measure:
1. latitude/longitude → cell;
2. ID → polygon/centroid and exact area;
3. parent and children;
4. edge-neighbor query and graph traversal;
5. polygon covering/spatial joins;
6. observation aggregation and multilevel reconstruction;
7. batch CPU/GPU throughput including host-device transfer.

**Report:** p50/p95/p99 latency, throughput, peak RAM, bytes/cell, number of cells per target region, area distortion, boundary error, topology failures, confidence interval and complete hardware/software versions. Include polar regions, antimeridian, root seams, arbitrarily close-to-edge points and deep-level degeneration. When a V5 global operation is not implemented, report **N/A**, not a fabricated result.

For a declared workload `W` and pre-specified scalar cost `J` with feasibility constraint `F_G(W)`, V5 is a **strict best choice among feasible V5/H3/S2 options** exactly when `F_V5(W)` holds and `J_V5(W)<J_G(W)` for every other feasible option `G`. This is a *decision definition*, not a benchmark outcome. Use Pareto frontiers when scalarization is unjustified.

## 10. Security, privacy, provenance and compatibility

- CellID is a **public spatial locator**, not secret or personal-data protection.
- Large GeoAI tensors SHOULD preserve input observation provenance, spatial reference and exact mapping algorithm version.
- Any future change to root numbering, geometry, bit layout or boundary ownership MUST increment a versioned format/atlas identifier and provide migration behavior.
- Lossless roundtrips and consistency across implementations are mandatory before cross-language interoperation is advertised.
- Batch GPU interfaces SHOULD surface geometry errors rather than silently returning plausible invalid IDs.
- The normative scope of the OGC DGGS specification must be tested before any OGC conformance assertion.

## 11. Conformance matrix and implementation milestones

| Test ID | Mandatory check | Current status |
| --- | --- | --- |
| ENC-001 | Encode/decode preserves root, path, resolution and version for all canonical cases | Implemented; expand tests |
| ENC-002 | Reject nonzero suffix, root ≥12, depth >10 and version 0 | Implemented |
| ENC-003 | Reject child creation at depth 10 and parent of root | Implemented |
| ENC-004 | Cross-language test vectors reproduce section 3.4 UInt64 words | Not yet cross-language validated |
| GEO-001 | Each 32-child weak cell union equals parent; positive area, five genuine corners | Proof + example prototype |
| GEO-002 | Non-overlap and boundary topology independently certified under exact predicates | Incomplete |
| GEO-003 | Every child is strictly spherically convex and global edge-to-edge | OPEN |
| GEO-004 | Uniform contraction theorem with explicit `ρ<1` | OPEN |
| GEO-005 | Stable atlas: lat/lon→ID→boundary with seam/pole tests | Not implemented |
| GEO-006 | Equal area within a chosen tolerance, if ever claimed | Not established |
| API-001 | Neighbor graph reciprocity and shared-edge verification | Not implemented |
| AI-001 | Area-weighted loss matches integral on controlled synthetic fields | Proposed |
| PERF-001 | Fair H3/S2 benchmark and reproducible performance report | Not measured |
| STD-001 | OGC DGGS applicable conformance classes / report | Not evaluated |

### Milestone gates

**G0 — Codec consistency:** freeze bit format, generated test vectors, protocol serialization and invalid-ID behavior.  
**G1 — Root atlas:** freeze Earth model and root orientation, boundary ownership and deterministic globe rendering.  
**G2 — Geometry:** certify 32-child subdivision / conformity / convexity / geometric convergence as **separate** gates.  
**G3 — Spatial API:** implement point lookup, polygon boundaries, neighbors, covering, areas and geodesic error reporting.  
**G4 — GPU / AI:** implement sparse graph + multilevel tokenization and batch kernels with correctness-first tests.  
**G5 — Benchmark and compliance:** externally repeat performance evaluation and applicable OGC standard conformance.

## 12. Source-document migration audit

The uploaded Vietnamese text is retained as a **design input**; where it conflicts with executable source or verified third-party documentation, it is treated as a *legacy proposal*, not silently implemented.

| Earlier assertion | Disposition in V5-32 v1.1 |
| --- | --- |
| "5 children" / "5-ary hierarchy" | **Superseded** by 32 children and five **bits** per child digit |
| "15 × 3-bit digits" | **Superseded** by 10 × 5-bit digits |
| "31–32 levels in 64 bits" | **Rejected** for the implemented layout; resolution 0..10 |
| "All cells exactly equal area (0%)" | **Unproven** and omitted from mandatory guarantees |
| "S2 uses triangles and equal area" | **Corrected:** spherical quadrilaterals, not exactly equal area |
| "Always five adjacent cells" | **Conditional** on strict conforming grid, not the weak prototype |
| "latlng_to_cell currently available" | **Proposed** (unimplemented global lookup) |
| "GPU latency ~50ns; 100× speedup" | **Removed** pending reproducible measurements |
| "Root centers at the poles" | **Unspecified** until stable atlas orientation is frozen |
| "One-hot globally at fine levels" | **Discouraged**; use sparse/hierarchical model design |

## 13. External references and intellectual honesty

- [H3 documentation — indexing and aperture 7](https://h3geo.org/docs/highlights/indexing/)
- [H3 cell index 64-bit format](https://h3geo.org/docs/library/index/cell/)
- [Google S2 Geometry — spherical quadrilateral cell decomposition](https://github.com/google/s2geometry/blob/master/src/s2/s2coords.h)
- [OGC DGGS standards landing page](https://www.ogc.org/standards/dggs/)
- [OGC Topic 21 — DGGS Reference System and Operations](https://docs.ogc.org/as/20-040r3/20-040r3.html)
- Local proof and caveats: [`docs/PROOF.md`](PROOF.md)

**Original mathematical facts (Euler, Gauss–Bonnet, curvature scaling and polygon triangulation) belong to established prior art.** V5 proposes a synthesis and a research implementation; authorship of these classical results is not claimed.

---

**V5 · Long Ngo 2026 · Vietflexmap · Apache-2.0 · Experimental technical specification, subject to revision.**

## 14. H3/S2/V5 decision matrix and v1.0.0 comparison update

The user-facing [Vietnamese multi-criteria comparison and UInt64 rationale](COMPARISON_H3_S2_V5_VI.md) and its interactive [website sections `#weak, `#compare and `#bits](../mathematical-proof.html#weak) extend the selection guidance with separate columns for **GIS accuracy, geographic inclusion, root/cell count, index bits, adjacency, production APIs, area weighting, edge/CPU/GPU costs and GeoAI suitability**.

**Technical clarifications:**
- H3 has 122 resolution-0 cells (110 hexagons + 12 pentagons), aperture-7 behavior for hexagon refinement, and 64-bit indexes with resolutions 0–15. Its parent-child index nesting is exact, but geographic containment of cell boundaries is approximate.
- S2 has six quadrilateral spherical root cells, four children per parent, levels 0–30, and 64-bit `S2CellId` indexing along Hilbert curves. S2 does not guarantee equal-area cells.
- V5 research v1 has 12 root labels and a weak 32-child hierarchy with a canonical `4+4+6+50` UInt64 field layout, only levels 0–10, and no verified global WGS84 locator or edge-neighbor graph.
- Five geometric sides are **not** five encoded child levels, nor necessarily five distinct adjacent cells in the current weak topology. H3 and S2 already use 64-bit indexes; V5 cannot claim that UInt64 is a new intrinsic performance advantage.

The V5-64 codec version 1 is restricted to `version=1` for both encoding and decoding. Cross-language serializations MUST preserve all 64 bits, e.g. fixed-width hex string or binary unsigned integer; JavaScript Number is insufficient.

**Release maturity:** Version 1.0.0 labels the research reference site, mathematical weak-refinement prototype and codec, **not** full strong pentagonal DGGS capabilities. Future comparative claims require accuracy-matched, externally repeatable benchmarks.
