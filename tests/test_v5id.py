# SPDX-License-Identifier: Apache-2.0
# Long Ngo 2026 · Vietflexmap Copyright (c) 2025
import unittest
from src.v5 import ROOT, refine, area2
from src.v5id import encode, decode, parent, child, children, to_hex, geometry_in_example_root


class TestV564Encoding(unittest.TestCase):
    def test_root_roundtrip(self):
        for root in range(12):
            addr = decode(encode(root))
            self.assertEqual(addr.root, root)
            self.assertEqual(addr.path, ())
            self.assertEqual(addr.resolution, 0)

    def test_all_ten_levels(self):
        path = (0, 1, 2, 3, 4, 5, 6, 7, 8, 31)
        a = decode(encode(11, path))
        self.assertEqual(a.path, path)
        self.assertEqual(a.root, 11)
        self.assertEqual(len(to_hex(a.encode())), 18)

    def test_32_unique_children_and_parent(self):
        root = encode(2)
        kids = children(root)
        self.assertEqual(len(set(kids)), 32)
        self.assertEqual(tuple(decode(k).path[0] for k in kids), tuple(range(32)))
        for k in kids:
            self.assertEqual(parent(k), root)

    def test_all_example_geometries_match_order(self):
        polygons = refine(depth=5)
        for d in range(32):
            self.assertEqual(geometry_in_example_root(child(encode(0), d)), polygons[d])
        self.assertEqual(sum((area2(p) for p in polygons)), area2(ROOT))

    def test_reject_invalid(self):
        for args in [(-1, ()), (12, ()), (0, tuple(range(11))), (0, (32,))]:
            with self.assertRaises(ValueError):
                encode(*args)
        with self.assertRaises(ValueError):
            decode(0)
        with self.assertRaises(ValueError):
            decode(encode(0, (1,)) | 1)
        with self.assertRaises(ValueError):
            parent(encode(0))


if __name__ == "__main__":
    unittest.main()
