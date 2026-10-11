# SPDX-License-Identifier: Apache-2.0
"""Spatial DNA sidecar tests: integrity is NOT error correction or encryption."""
import struct
import unittest
import zlib

from src.v5id import encode, to_hex, parent
from src.v5dna import (
    pack_dna, unpack_dna, RECORD_BYTES, FLAG_SYNTHETIC,
    MARK_BOUNDARY, MARK_REVISED, MARK_REVIEW,
)

DEMO_KEY = b"v5-dna-test-key-not-for-production-" + bytes(range(32))


class SpatialDNATests(unittest.TestCase):
    def _pack(self, **changes):
        values = dict(
            cell_id=encode(7, (2, 0, 4)), atlas_id=42,
            epoch_seconds=1_789_000_000,
            marks=(MARK_BOUNDARY, MARK_REVISED, MARK_REVIEW),
            key_id=7, secret=DEMO_KEY, flags=FLAG_SYNTHETIC,
        )
        values.update(changes)
        return pack_dna(**values)

    def test_roundtrip_and_fixed_size_and_unchanged_v5_cellid(self):
        blob = self._pack()
        self.assertEqual(len(blob), RECORD_BYTES)
        self.assertEqual(RECORD_BYTES, 54)
        record = unpack_dna(blob, keys={7: DEMO_KEY})
        self.assertEqual(record.cell_id, encode(7, (2, 0, 4)))
        self.assertEqual(to_hex(record.cell_id), "0x131c402000000000")
        self.assertEqual(parent(record.cell_id), encode(7, (2, 0)))
        self.assertEqual(record.resolution, 3)
        self.assertEqual(record.marks, (1, 2, 3))
        self.assertEqual(record.epoch_seconds, 1_789_000_000)
        self.assertEqual(record.atlas_id, 42)
        self.assertEqual(record.flags, FLAG_SYNTHETIC)

    def test_all_resolutions_zero_and_ten(self):
        for path in [(), (31,) * 10]:
            with self.subTest(resolution=len(path)):
                blob = self._pack(cell_id=encode(11, path), marks=(0,) * len(path))
                self.assertEqual(unpack_dna(blob, keys={7: DEMO_KEY}).resolution, len(path))

    def test_corruption_detected_without_claimed_recovery(self):
        blob = self._pack()
        for pos in (0, 5, 9, 17, 27, 33):
            data = bytearray(blob)
            data[pos] ^= 0x01
            with self.subTest(byte=pos):
                with self.assertRaises(ValueError):
                    unpack_dna(bytes(data), keys={7: DEMO_KEY})

    def test_forged_checksum_not_valid_authentication(self):
        data = bytearray(self._pack())
        data[25] ^= 1  # alter authenticated epoch/metadata
        checksum = zlib.crc32(data[:34]) & 0xffffffff
        data[34:38] = struct.pack(">I", checksum)
        with self.assertRaisesRegex(ValueError, "Authentication failed"):
            unpack_dna(bytes(data), keys={7: DEMO_KEY})

    def test_wrong_or_missing_key_rejected(self):
        blob = self._pack()
        with self.assertRaises(ValueError):
            unpack_dna(blob, keys={})
        with self.assertRaisesRegex(ValueError, "Authentication failed"):
            unpack_dna(blob, keys={7: b"a" * 32})

    def test_reject_noncanonical_metadata_and_invalid_header(self):
        with self.assertRaises(ValueError):
            self._pack(marks=(0,))
        with self.assertRaises(ValueError):
            self._pack(marks=(0, 1, 4))
        with self.assertRaises(ValueError):
            self._pack(marks=(True, 1, 1))
        with self.assertRaises(ValueError):
            self._pack(secret=b"short")
        with self.assertRaises(ValueError):
            self._pack(flags=4)
        with self.assertRaises(ValueError):
            self._pack(cell_id=encode(7, (2, 0, 4)) | 1)
        with self.assertRaises(ValueError):
            self._pack(epoch_seconds=-1)
        with self.assertRaises(ValueError):
            unpack_dna(b"bad", keys={7: DEMO_KEY})

    def test_authentication_binds_position_atlas_and_time(self):
        a = self._pack()
        b = self._pack(atlas_id=43)
        c = self._pack(epoch_seconds=1_789_000_001)
        d = self._pack(cell_id=encode(8, (2, 0, 4)))
        self.assertNotEqual(a[-16:], b[-16:])
        self.assertNotEqual(a[-16:], c[-16:])
        self.assertNotEqual(a[-16:], d[-16:])


if __name__ == "__main__":
    unittest.main()
