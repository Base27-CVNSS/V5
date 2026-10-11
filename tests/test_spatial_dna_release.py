# SPDX-License-Identifier: Apache-2.0
"""Static release invariants for Spatial DNA v0.1 entropy and sidecar docs."""
from pathlib import Path
import unittest
from src.v5id import encode, decode, MAX_RESOLUTION, PATH_BITS, FORMAT_VERSION
from src.v5dna import RECORD_BYTES, TAG_BYTES, SCHEMA_VERSION


ROOT = Path(__file__).resolve().parents[1]


class SpatialDNADocumentationTests(unittest.TestCase):
    def test_format_version_and_sidecar_are_separate(self):
        self.assertEqual(MAX_RESOLUTION, 10)
        self.assertEqual(PATH_BITS, 50)
        self.assertEqual(FORMAT_VERSION, 1)
        self.assertEqual(SCHEMA_VERSION, 1)
        self.assertEqual(RECORD_BYTES, 54)
        self.assertEqual(TAG_BYTES, 16)
        self.assertEqual(decode(encode(7, (2, 0, 4))).path, (2, 0, 4))

    def test_new_links_and_math_caveats_exist(self):
        page = (ROOT / "mathematical-proof.html").read_text(encoding="utf-8")
        technical = (ROOT / "technical-specification.html").read_text(encoding="utf-8")
        index = (ROOT / "index.html").read_text(encoding="utf-8")
        spec = (ROOT / "docs/SPATIAL_DNA_V0_1.md").read_text(encoding="utf-8")
        for token in ('id="spatial-dna"', 'id="dna-depth"', 'web/v5-entropy-ui.js',
                      '77,4%', '22,6%', '54 byte'):
            self.assertIn(token, page)
        self.assertIn('href="#dna"', technical)
        self.assertIn('href="mathematical-proof.html#spatial-dna"', index)
        for token in ('35 bits', '10 physical bits', 'HMAC', 'CRC', '90 bits'):
            self.assertIn(token, spec)

    def test_v1_padding_is_still_canonical(self):
        address = encode(1, (3,))
        with self.assertRaises(ValueError):
            decode(address | 1)


if __name__ == "__main__":
    unittest.main()
