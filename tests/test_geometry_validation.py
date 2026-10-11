# SPDX-License-Identifier: Apache-2.0
"""Security/correctness regression tests: research-geometry scope only."""
import unittest
from fractions import Fraction as F
from src import v5


def transform(poly, sx=1, sy=1, dx=0, dy=0):
    return tuple((sx*x + dx, sy*y + dy) for x, y in poly)


class GeometryValidationTests(unittest.TestCase):
    def test_positive_area_self_crossing_pentagram_is_not_simple(self):
        # Signed area and five distinct non-flat corners are insufficient.
        star = tuple(v5.point(x,y) for x,y in [
            (0,5),(-3,-3),(5,2),(-5,2),(3,-3)
        ])
        self.assertGreater(v5.area2(star), 0)
        self.assertFalse(v5.strict_pentagon(star))
        with self.assertRaises(ValueError):
            v5.split_pentagon(star)

    def test_rejects_repeated_collinear_or_clockwise_vertices(self):
        self.assertFalse(v5.strict_pentagon(v5.ROOT[::-1]))
        self.assertFalse(v5.strict_pentagon(v5.ROOT[:4] + v5.ROOT[:1]))
        p=(v5.point(0,0), v5.point(1,0), v5.point(2,0),
           v5.point(2,2), v5.point(0,2))
        self.assertFalse(v5.strict_pentagon(p))

    def test_affine_transforms_preserve_weak_32_count_and_exact_area(self):
        for sx,sy,dx,dy in [(1,1,0,0),(2,3,5,-7),
                            (F(1,3),F(2,5),F(7,3),F(-2,7))]:
            with self.subTest(transform=(sx,sy,dx,dy)):
                root=transform(v5.ROOT,sx,sy,dx,dy)
                children=v5.refine(root,depth=5)
                self.assertEqual(len(children), 32)
                self.assertTrue(all(v5.strict_pentagon(p) for p in children))
                self.assertEqual(sum(map(v5.area2,children)),v5.area2(root))

    def test_refine_bad_depth_and_input(self):
        for d in (-1,13):
            with self.assertRaises(ValueError):
                v5.refine(depth=d)
        with self.assertRaises(ValueError):
            v5.refine(v5.ROOT[::-1],depth=1)


if __name__=="__main__":
    unittest.main()
