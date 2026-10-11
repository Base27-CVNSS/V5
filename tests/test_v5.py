# SPDX-License-Identifier: Apache-2.0
# Long Ngo 2026 · Vietflexmap Copyright (c) 2025
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location(
    "v5", Path(__file__).resolve().parents[1] / "src" / "v5.py"
)
v5 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v5)


class TestWeakRefinement(unittest.TestCase):
    def test_root(self):
        self.assertTrue(v5.strict_pentagon(v5.ROOT))

    def test_one_cut(self):
        left, right = v5.split_pentagon(v5.ROOT)
        self.assertTrue(v5.strict_pentagon(left))
        self.assertTrue(v5.strict_pentagon(right))
        self.assertEqual(v5.area2(left) + v5.area2(right),
                         v5.area2(v5.ROOT))

    def test_exact_32_cells(self):
        cells = v5.refine(depth=5)
        self.assertEqual(len(cells), 32)
        report = v5.validate(cells)
        self.assertTrue(report["exact_area_conservation"])
        self.assertTrue(report["all_strict_five_corner_polygons"])

    def test_exact_1024_cells(self):
        cells = v5.refine(depth=10)
        self.assertEqual(len(cells), 1024)
        report = v5.validate(cells)
        self.assertTrue(report["exact_area_conservation"])
        self.assertTrue(report["all_strict_five_corner_polygons"])

    def test_combinatorial_euler_identity(self):
        for level in range(5):
            f = 12 * (32 ** level)
            self.assertEqual(5 * f % 2, 0)
            e = 5 * f // 2
            v = e - f + 2
            self.assertEqual(v - e + f, 2)
            self.assertEqual(f // 2 - 6, 5 * f - 3 * v)


if __name__ == "__main__":
    unittest.main()
