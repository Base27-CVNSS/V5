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


## 13. Local spherical angles and global similarity obstruction

**Proposition 13.1 (Girard–Gauss–Bonnet, sphere).** Let \(P\subset S_R^2\) be a positively oriented, simple geodesic spherical pentagon bounding a topological disk of area \(A\), with geodesic edges and interior angles \(\alpha_1,\ldots,\alpha_5\) measured inside the disk. Its signed spherical excess satisfies

\[
\sum_{i=1}^{5}\alpha_i-3\pi=\int_P K\,dA=\frac{A}{R^2}>0,
\qquad K=\frac{1}{R^2}.
\]

The inequality assumes a nondegenerate positively oriented interior of positive area. Do not apply it unqualified to self-intersecting polygons or arbitrary chosen exterior regions.

**Proposition 13.2 (vertex closure).** At an ordinary vertex of a gapless, non-overlapping partition of a smooth sphere into piecewise smooth cells, the sector angles around that point add to \(2\pi\). The original dodecahedral atlas has twenty vertices, each incident to three pentagonal roots; each root corner is \(2\pi/3\), giving \(3(2\pi/3)=2\pi\). At a weak-grid *hanging node*, a neighboring polygon can have a straight-through sector and must be included in the local angle accounting, even if that point is not a stored vertex of that polygon.

**Proposition 13.3 (no nontrivial spherical metric homothety).** Suppose \(U,V\) are nonempty open subsets of the **same** round sphere \(S_R^2\) with metric \(g\), and \(f:U\to V\) is a smooth local diffeomorphism satisfying \(f^*g=\lambda^2g\) for constant \(\lambda>0\). The Gaussian curvature of the pullback metric is \(K(f^*g)=K(g)\circ f=1/R^2\). For the constantly scaled metric, \(K(\lambda^2g)=K(g)/\lambda^2=1/(\lambda^2R^2)\). Therefore

\[
\frac{1}{R^2}=\frac{1}{\lambda^2R^2}
\quad\Longrightarrow\quad
\boxed{\lambda=1}.
\]

Consequently a nontrivial exact uniform local or global distance-scaling similarity with \(0<\lambda<1\) is impossible on open pieces of one fixed-radius sphere. This **does not** rule out topological refinement, unequal-area pentagons, general conformal maps with *variable* scale, or approximate scaling as cell diameters tend toward zero.

For an educational radial map from a pole taking geodesic radius \(\theta\) to \(\lambda\theta\), the circumference of the resulting parallel is \(2\pi R\sin(\lambda\theta)\), whereas an exact homothety would require \(2\pi\lambda R\sin\theta\). At \(\theta=\pi/3,\lambda=1/2\), the relative discrepancy is \(\sin(\pi/6)/[(1/2)\sin(\pi/3)]-1=2/\sqrt3-1\approx15.47\%\). This is a visualization, not the general nonexistence proof.

**Numerical checks in the 3D simulation:** The [pure JS geometry module](../web/v5-sphere-math.js) constructs the spherical dodecahedral atlas through the dual of a regular icosahedron. [Node tests](../tests/test_sphere_math.mjs) verify twelve root faces, twenty triple junctions, five 120° corner angles per root, total spherical excess \(4\pi\), the 32-child weak partition, and the radial circumference discrepancy.

**Research implication:** A single exact homothety ratio \(\lambda=32^{-1/2}\) is incompatible with the positive constant curvature of the sphere, even though such a ratio is meaningful as an **approximate characteristic diameter scaling** in non-similar hierarchical refinements.


## 14. Deployment theorem versus workload-specific optimality (2026-10-11)

The project distinguishes **three logically different propositions**:

1. **Established weak refinement:** a simple, generally nonconvex 32-child partition of any strict simple pentagon (Sections 2–4).
2. **Established metric obstruction:** no nontrivial fixed-factor Riemannian homothety between open subsets of the same round sphere (Proposition 13.3).
3. **Not yet verified in the repository:** a single recursive algorithm producing precisely 32 **convex**, fully edge-to-edge spherical pentagons per parent with a uniform one-step diameter reduction and adequate shape regularity.

The positive existence of a conforming convex 32-child scheme, even if separately established as an abstract result, **must not be presented as a verified algorithm in this repository until an explicit construction and validation suite have been supplied**. In particular, the weak pentagonal prototype does not become convex by radial projection. A global convergence estimate \(D_n\le C\rho^n\) also does not *alone* imply the stronger one-step contraction \(D_{n+1}\le\rho D_n\).

### 14.1 Necessary and sufficient condition for beating H3 / S2 — for a specified workload only

There is no application-independent geometric theorem that five-sided cells are faster than four- or six-sided cells. Fix a workload \(W\), geometry/accuracy constraints, a common computing environment, and a **predeclared** normalized scalar cost \(J_G(W)\) per grid system \(G\). Examples of cost components are latency, peak memory, persistent storage, reconstruction cost, and geodesic approximation error.

Writing \(\mathcal F_G(W)\) for all functionality and accuracy requirements being met, the strict winner condition is, **by definition**,

\[
\mathcal F_{\mathrm{V5}}(W)
\quad\land\quad
J_{\mathrm{V5}}(W)< J_G(W)
\quad\text{for every other feasible }G\in\{\mathrm{H3,S2}\}.
\]

This is a necessary-and-sufficient **workload-relative decision rule**, not an empirical claim of V5 superiority. Without fixed weights or a scalar objective, use Pareto dominance instead. The experiment must match dataset, nominal resolution and accuracy, CPU/GPU, memory budget, and report confidence intervals over repeat runs.

**Potential research niches:** deterministic base-32 path operations, local computations defined on a five-edge graph, offline compressed telemetry, novel geospatial primitives, and geometric / topological educational applications. None of these currently justify an unmeasured speed multiplier.

**Safer operational defaults today:** use production H3 for well-supported hexagonal-neighborhood aggregation; use production S2 for hierarchical region coverage and parent-child containment. Prototype V5 against these established baselines only when the application's special constraints motivate it.

### 14.2 64-bit limitations

The implemented Python codec layout is

\[
\underbrace{4}_{\mathrm{version}}+
\underbrace{4}_{\mathrm{resolution}}+
\underbrace{6}_{\mathrm{root}}+
\underbrace{50}_{\mathrm{path}}=64\,\mathrm{bits}.
\]

At 5 bits per base-32 child digit, this provides **10 levels**, regardless of the unlimited mathematical *finite-stage* refinement. H3 and S2 **also** have 64-bit index representations. Compact IDs do not demonstrate superior query speed, and a spatial CellID is not a stable real-world EntityID.

### 14.3 Website and operational decision guide

The site now provides a dedicated Vietnamese [theorem and deployment dossier](../mathematical-proof.html), covering Gauss–Bonnet, Euler/parity, the no-homothety theorem, the exact weak/strong status, H3/S2 criteria, the 10-level V5-64 budget, and the limitations of convex 32-child spherical pentagonal subdivision.

Sources: [H3 indexing](https://h3geo.org/docs/highlights/indexing/), [S2CellId hierarchy](https://s2geometry.io/devguide/s2cell_hierarchy), [OGC DGGS Topic 21](https://docs.ogc.org/as/20-040r3/20-040r3.html).
