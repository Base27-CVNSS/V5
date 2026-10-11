# SPDX-License-Identifier: Apache-2.0
# Long Ngo 2026 · Vietflexmap Copyright (c) 2025
"""
V5 weak pentagonal subdivision: an EXACT planar research prototype.

Five binary subdivisions give 32 simple pentagonal children. The cells may be
concave, may contain hanging nodes, and are NOT quality-controlled DGGS cells.
No lat/lon indexing, globe tessellation, GPU acceleration, or H3 comparison is
implemented in this module.

Use: python src/v5.py --depth 5 --json
     python src/v5.py --depth 5 --svg
     python -m unittest discover -s tests -v
"""
from __future__ import annotations

import argparse
from fractions import Fraction as F
import json
from typing import Sequence

Point = tuple[F, F]
Polygon = tuple[Point, ...]


def point(x: int | F, y: int | F) -> Point:
    return F(x), F(y)


ROOT: Polygon = (
    point(0, -5), point(5, -2), point(3, 4),
    point(-3, 4), point(-5, -2),
)


def add(p: Point, q: Point) -> Point:
    return p[0] + q[0], p[1] + q[1]


def mid(p: Point, q: Point) -> Point:
    return (p[0] + q[0]) / 2, (p[1] + q[1]) / 2


def orient(a: Point, b: Point, c: Point) -> F:
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])


def area2(poly: Sequence[Point]) -> F:
    return sum(
        (poly[i][0] * poly[(i + 1) % len(poly)][1]
         - poly[(i + 1) % len(poly)][0] * poly[i][1])
        for i in range(len(poly))
    )


def strict_pentagon(poly: Sequence[Point]) -> bool:
    return (
        len(poly) == 5 and len(set(poly)) == 5 and area2(poly) > 0
        and all(orient(poly[i - 1], poly[i], poly[(i + 1) % 5]) != 0
                for i in range(5))
    )


def fan_vertex(poly: Polygon) -> tuple[Point, Point, Point, Point, Point]:
    """Find a triangulation-fan pivot for a CCW simple pentagon.

    For a five-vertex simple polygon every triangulation has two diagonals
    sharing a pivot. Positively oriented fan triangles determine a valid pivot.
    """
    if not strict_pentagon(poly):
        raise ValueError("Expected a simple CCW pentagon without flat corners")
    for i in range(5):
        a, b, c, d, e = poly[i:] + poly[:i]
        if (orient(a, b, c) > 0 and orient(a, c, d) > 0
                and orient(a, d, e) > 0):
            return a, b, c, d, e
    raise ValueError("No fan pivot found; invalid polygon or numerical bug")


def in_triangle_strict(p: Point, a: Point, b: Point, c: Point) -> bool:
    return (orient(a, b, p) > 0 and orient(b, c, p) > 0
            and orient(c, a, p) > 0)


def split_pentagon(poly: Polygon) -> tuple[Polygon, Polygon]:
    """Exact rational construction P5 -> two strict, generally nonconvex P5.

    Choose a valid fan from A; Q is on the opposite edge CD. Perturb the
    midpoint of AQ inside triangle ACD to obtain a bent internal A-T-Q cut.
    """
    a, b, c, d, e = fan_vertex(poly)
    q = mid(c, d)
    m = mid(a, q)
    dx, dy = q[0] - a[0], q[1] - a[1]
    for power in range(5, 120):
        for sign in (1, -1):
            eps = F(sign, 2 ** power)
            t = point(m[0] - eps * dy, m[1] + eps * dx)
            if not in_triangle_strict(t, a, c, d):
                continue
            left: Polygon = (a, b, c, q, t)
            right: Polygon = (a, t, q, d, e)
            if (strict_pentagon(left) and strict_pentagon(right)
                    and area2(left) + area2(right) == area2(poly)):
                return left, right
    raise ArithmeticError("Failed to find admissible bent cut")


def refine(poly: Polygon = ROOT, depth: int = 5) -> list[Polygon]:
    """Return 2**depth exact-rational pentagons (depth=5 -> 32)."""
    if depth < 0 or depth > 12:
        raise ValueError("Research prototype supports depths 0..12")
    cells = [poly]
    for _ in range(depth):
        children = []
        for parent in cells:
            children.extend(split_pentagon(parent))
        cells = children
    return cells


def validate(cells: Sequence[Polygon], root: Polygon = ROOT) -> dict:
    """Verify exact areas and geometric non-flat-corner conditions.

    The nonoverlap assertion follows from the constructive proof; this function
    does NOT perform a full pairwise polygon-overlay intersection check.
    """
    valid = all(strict_pentagon(c) for c in cells)
    total = sum((area2(c) for c in cells), F(0))
    root_area = area2(root)
    areas = [area2(c) for c in cells]
    return {
        "count": len(cells),
        "all_strict_five_corner_polygons": valid,
        "exact_area_conservation": total == root_area,
        "minimum_area": float(min(areas) / 2),
        "maximum_area": float(max(areas) / 2),
        "area_ratio": float(max(areas) / min(areas)),
        "note": "Weak construction; concave cells and hanging nodes permitted.",
    }


def render_svg(cells: Sequence[Polygon], root: Polygon = ROOT) -> str:
    coords = [p for c in cells for p in c]
    xmin = min(float(p[0]) for p in coords)
    xmax = max(float(p[0]) for p in coords)
    ymin = min(float(p[1]) for p in coords)
    ymax = max(float(p[1]) for p in coords)
    w, h = 900, 740
    scale = min((w - 90) / (xmax - xmin), (h - 90) / (ymax - ymin))
    ox = (w - (xmax - xmin) * scale) / 2
    oy = (h - (ymax - ymin) * scale) / 2

    def coord(p: Point) -> str:
        return f"{ox + (float(p[0]) - xmin) * scale:.5f},{h - (oy + (float(p[1]) - ymin) * scale):.5f}"

    colors = ("#a6ddd8", "#a7c6e8", "#d9d3f8", "#a8dfb3",
              "#ffd9a8", "#b1dee9", "#f6bcce")
    shapes = []
    for i, cell in enumerate(cells):
        pts = " ".join(coord(p) for p in cell)
        shapes.append(
            f'<polygon points="{pts}" fill="{colors[i % len(colors)]}" '
            'stroke="#183b55" stroke-width="1.5" stroke-linejoin="round"/>'
        )
    outline = " ".join(coord(p) for p in root)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="740" '
        'viewBox="0 0 900 740" role="img">'
        '<rect width="900" height="740" fill="#f8fbff"/>'
        + "".join(shapes)
        + f'<polygon points="{outline}" fill="none" stroke="#0b243b" stroke-width="4"/>'
        + '</svg>'
    )


def main() -> None:
    ap = argparse.ArgumentParser(description="V5 exact weak pentagon subdivision")
    ap.add_argument("--depth", type=int, default=5, help="binary depth; 5 = 32")
    group = ap.add_mutually_exclusive_group()
    group.add_argument("--svg", action="store_true", help="write stand-alone SVG")
    group.add_argument("--json", action="store_true", help="write polygon JSON")
    args = ap.parse_args()
    cells = refine(depth=args.depth)
    summary = validate(cells)
    if args.svg:
        print(render_svg(cells))
    elif args.json:
        print(json.dumps({
            "metadata": {"project": "V5", "author": "Long Ngo 2026",
                         "copyright": "Vietflexmap Copyright (c) 2025",
                         "license": "Apache-2.0"},
            "summary": summary,
            "cells": [[[float(x), float(y)] for x, y in poly] for poly in cells],
        }, indent=2))
    else:
        print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
