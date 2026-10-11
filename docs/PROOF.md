# V5-32: Mathematical claims, assumptions, and proof audit

**Author:** Long Ngo (2026)  
**Copyright:** Vietflexmap Copyright (c) 2025  
**License:** Apache-2.0  
**Status:** Technical research note; not peer reviewed, not an arXiv submission.

## 1. Definitions

A **strict planar pentagon** is the closure of a simple planar polygonal Jordan domain whose boundary has exactly five distinct vertices and five straight segments, with no three consecutive vertices collinear; it need not be convex.

A **weak nested pentagonal partition** is a sequence of finite partitions in which each parent is exactly the union of its children and distinct children have disjoint interiors. At the shared boundaries, a vertex of one cell may fall in the interior of another cell's edge (**hanging node**).

An **edge-to-edge** partition is stricter: the intersection of two distinct cells is empty, a common full edge, or a common vertex. The constructions below do not establish this stronger property.

## 2. Binary pentagon lemma

**Lemma 1.** Every strict simple pentagon P admits a subdivision into two strict simple pentagons P₀ and P₁ with P = P₀ ∪ P₁ and disjoint interiors.

**Proof.** Triangulate P. A triangulation of a simple pentagon uses two internal diagonals and three triangles. The two diagonals share a vertex (otherwise two nonadjacent diagonals of a pentagon intersect). Relabel cyclically so that the diagonals are AC and AD for P=(A,B,C,D,E). Thus ABC, ACD, ADE are the constituent triangles. Pick Q strictly between C and D. The straight segment AQ lies in triangle ACD. Choose T in the interior of triangle ACD arbitrarily close to an interior point of AQ but not on the line AQ; avoid the finite set of lines causing flat angles at A, Q or T. The broken path A–T–Q is a simple proper crosscut of the polygon. It produces boundary cycles (A,B,C,Q,T) and (A,T,Q,D,E). Each has five distinct vertices, and by the choice of T no consecutive triple is collinear. Both are simple; the cut has no area and their interiors are disjoint. ∎

**Important caveat.** The two new pentagons are generally **not both convex**: the cut produces a reflex corner on one of the two sides.

## 3. Finite 32-ary weak refinement

**Theorem 1.** Every strict simple planar pentagon has a weak partition into exactly 32 strict simple pentagons, recursively for any finite number of levels.

**Proof.** Apply Lemma 1 simultaneously to every cell five times. Inductively each current cell is a strict simple pentagon; each step doubles the count while preserving union and pairwise interior disjointness. After five steps the count is 2⁵=32. Reapply the same finite sequence to all parents at the next level. For r 32-ary levels, each initial pentagon has 32ʳ descendants. ∎

The theorem does **not** state a uniform inradius/diameter bound, cell area ratio, or convergence of cells to points as r→∞.

## 4. Transfer to the sphere

Let D be a regular convex dodecahedron centered at O=0, and S²_R the sphere of radius R. For x∈∂D let ρ(x)=R x/||x||. Because D is convex and O is interior, every ray from O intersects ∂D at one point. Hence ρ is a continuous bijection from compact ∂D to Hausdorff S²_R and is therefore a homeomorphism.

**Theorem 2.** For every finite r≥0, S²_R admits a weak nested partition with 12·32ʳ strict (possibly nonconvex) spherical pentagons, with five shorter great-circle arcs per cell.

**Proof.** The twelve faces of D are strict planar pentagons. Apply Theorem 1 independently within each planar root face. The partition covers ∂D and has disjoint cell interiors. The homeomorphism ρ preserves both coverage and disjoint interiors. On a fixed face plane not through O, the radial image of any straight line segment lies on the great circle formed by the sphere and the plane through O containing that line. Each interior non-straight corner remains non-straight because the radial map on each face is a local smooth diffeomorphism. Counting gives 12·32ʳ. ∎

The spherical statement uses the mathematical **sphere**, not a completed ellipsoidal WGS84 geodesic implementation.

## 5. Edge-to-edge topology identity

Let F be the number of pentagonal faces in an edge-to-edge cell decomposition of the sphere. Since each edge is counted twice and each face five times, 5F=2E. By Euler, V−E+F=2, so V=3F/2+2. If deg(v) counts edge incidences at a vertex, the handshaking lemma gives Σ_v deg(v)=2E=5F. Consequently,

**Σ_v (deg(v) − 3) = F/2 − 6.**

When every vertex has degree three, F=12. At F=12·32ʳ, the required excess-degree budget equals **6(32ʳ−1)**. This identity is a **necessary restriction** for an edge-to-edge all-pentagon tiling, not evidence of an edge-to-edge construction.

## 6. Boundary parity condition

Inside one parent, suppose F pentagons meet edge-to-edge, B is the number of child edges on the parent boundary, and I counts internal child edges. By counting edge incidences, **5F=2I+B**, therefore **B≡F (mod 2)**. At F=32, B must be even. Five wholly unsplit parent edges give B=5 and are impossible; boundary subdivisions need coordination across adjacent parents.

## 7. Fivefold rotational symmetry obstruction

Consider a pentagonal parent invariant under a rotation of 72° and a partition into **convex** child polygons invariant as a set under that rotation. The cyclic rotation group C₅ acts on children; every orbit has cardinality 1 or 5. An invariant convex child contains the rotation center in its interior, hence at most one child can be invariant under a non-overlapping convex partition. The number N of cells thus satisfies N≡0 or 1 (mod 5). Since 32≡2 (mod 5), **no such 32-cell fully fivefold-symmetric convex partition exists**. This does not forbid asymmetric 32-child partitions.

## 8. Equal regular spherical pentagons obstruction

For a convex regular spherical pentagon bounded by great-circle arcs, Girard's formula reads A/R² = 5α−3π, so α>3π/5=108°. As a convex spherical polygon, α<π. In an edge-to-edge tiling by congruent such pentagons, dα=2π at every vertex, with integer d≥3. It follows that d=3; the topology identity yields F=12. Hence there is no such 384-cell or 12,288-cell globally regular tiling.

## 9. Numerical prototype and reproducibility

`src/v5.py` implements Lemma 1 with exact rational coordinates and outputs a sample of 32 or 1024 cells. `tests/test_v5.py` checks five distinct non-flat vertices and exact total area. The code is an **illustration of the constructive proof**, not an exhaustive geometry-verification framework; it does not independently certify all non-overlaps or spherical edge incidences.

```bash
python -m unittest discover -s tests -v
python src/v5.py --depth 5 --json > example-32.json
python src/v5.py --depth 5 --svg > example-32.svg
```

## 10. Strong V5 research conjecture — UNSOLVED

Seek a single refinement scheme `D32` satisfying simultaneously:

1. Exactly 32 strict **convex** pentagons per parent.
2. Full edge-to-edge conformity across all parents and levels.
3. Uniform shape regularity, bounded area ratio independent of level.
4. Maximal cell diameter O(32^(−r/2)) on the sphere.
5. Deterministic spherical coordinate-to-cell lookup and neighborhood algorithms.

No proof for the simultaneous existence of these properties is supplied here.

## 11. Prior art and attribution

* [H3 introduction](https://h3geo.org/docs/), [H3 cell index layout](https://h3geo.org/docs/library/index/cell/), and [Uber H3 source](https://github.com/uber/h3). H3 uses an independent largely hexagonal aperture-7 hierarchy, not V5's weak 32-ary construction.
* [OGC DGGS standard](https://docs.ogc.org/as/20-040r3/20-040r3.html).
* Classical triangulation of simple polygons; Euler's polyhedral formula; Girard's spherical excess formula. These are **prior mathematical results**.

## 12. Academic integrity

This repository proposes a particular synthesis and implementation, **not the discovery of polygon triangulation, Euler's theorem, or spherical projection**. The constructive weak result does not by itself establish a new practical DGGS, a performance advance, or a peer-reviewed mathematical discovery.
