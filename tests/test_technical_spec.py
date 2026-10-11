# SPDX-License-Identifier: Apache-2.0
"""V5-64 v1 specification vectors and canonical serialization checks.

These are codec tests, NOT evidence of a production spherical DGGS.
See docs/TECHNICAL_SPEC_EN.md.
"""
import unittest

from src.v5id import encode, decode, parent, child, children, to_hex


class SpecificationCodecTests(unittest.TestCase):
    VECTORS = (
        (0, (), "0x1000000000000000"),
        (11, (), "0x102c000000000000"),
        (7, (2, 0, 4), "0x131c402000000000"),
        (0, (7, 16, 31), "0x1300f0f800000000"),
        (11, (31,) * 10, "0x1a2fffffffffffff"),
    )

    def test_canonical_hex_vectors(self):
        for root, path, expected in self.VECTORS:
            with self.subTest(root=root, path=path):
                self.assertEqual(to_hex(encode(root, path)), expected)
                decoded = decode(int(expected, 16))
                self.assertEqual(decoded.root, root)
                self.assertEqual(decoded.path, tuple(path))
                self.assertEqual(decoded.resolution, len(path))
                self.assertEqual(decoded.version, 1)

    def test_all_first_level_children(self):
        root_id = encode(3)
        first = children(root_id)
        self.assertEqual(len(first), 32)
        self.assertEqual(len(set(first)), 32)
        for digit, address in enumerate(first):
            self.assertEqual(decode(address).path, (digit,))
            self.assertEqual(parent(address), root_id)
            self.assertEqual(child(root_id, digit), address)

    def test_reject_noncanonical_padding(self):
        # One-child address has 45 low padding bits, which MUST be zero.
        self.assertRaises(ValueError, decode, encode(0, (1,)) | 1)
        self.assertRaises(ValueError, decode, 0)

    def test_reject_invalid_fields(self):
        self.assertRaises(ValueError, encode, 12)
        self.assertRaises(ValueError, encode, -1)
        self.assertRaises(ValueError, encode, 0, (32,))
        self.assertRaises(ValueError, encode, 0, (0,) * 11)
        self.assertRaises(ValueError, decode, (1 << 64) - 1)
        self.assertRaises(ValueError, parent, encode(0))
        self.assertRaises(ValueError, child, encode(0, (31,) * 10), 0)


if __name__ == "__main__":
    unittest.main()
