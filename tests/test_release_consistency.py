# SPDX-License-Identifier: Apache-2.0
"""Release v1.0.0 documentation and UInt64 safety invariants."""
from pathlib import Path
import unittest

from src.v5id import encode, decode, ROOT_COUNT, MAX_RESOLUTION, PATH_BITS

ROOT = Path(__file__).resolve().parents[1]


class TestReleaseConsistency(unittest.TestCase):
    def test_version_and_wire_layout(self):
        self.assertEqual((ROOT / "VERSION").read_text(encoding="utf-8").strip(), "1.0.0")
        self.assertEqual((ROOT_COUNT, MAX_RESOLUTION, PATH_BITS), (12, 10, 50))

    def test_unsupported_wire_versions_and_bools_rejected(self):
        for version in (0, 2, 15, True):
            with self.subTest(version=version):
                with self.assertRaises(ValueError):
                    encode(0, (), version=version)
        with self.assertRaises(ValueError):
            decode((2 << 60))
        with self.assertRaises(ValueError):
            encode(True)
        with self.assertRaises(ValueError):
            encode(0, (True,))
        with self.assertRaises(ValueError):
            decode(True)

    def test_comparison_is_linked_to_weak_proof_and_docs(self):
        page = (ROOT / "mathematical-proof.html").read_text(encoding="utf-8")
        compare = (ROOT / "docs/COMPARISON_H3_S2_V5_VI.md").read_text(encoding="utf-8")
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        for fragment in ('id="weak"', 'id="compare"', 'id="bits"'):
            self.assertIn(fragment, page)
        for phrase in ("H3", "S2", "V5", "50 bit", "10 cấp", "uint64"):
            self.assertIn(phrase, page.lower() if phrase == "uint64" else page)
        self.assertIn("0x131c402000000000", compare)
        self.assertIn("COMPARISON_H3_S2_V5_VI.md", readme)

    def test_deployment_requires_verification(self):
        wf = (ROOT / ".github/workflows/pages.yml").read_text(encoding="utf-8")
        self.assertIn("needs: verify", wf)
        self.assertIn("python -m unittest discover -s tests -v", wf)
        self.assertIn("python scripts/audit_site.py", wf)
        self.assertTrue((ROOT / "SECURITY.md").is_file())


if __name__ == "__main__":
    unittest.main()
