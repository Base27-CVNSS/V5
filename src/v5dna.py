# SPDX-License-Identifier: Apache-2.0
# Long Ngo 2026 · Vietflexmap Copyright (c) 2025
"""Experimental V5 Spatial DNA sidecar v0.1 (NOT embedded in CellID).

This independently versioned authenticated envelope binds V5-64 v1
with a small array of 2-bit per-level *asserted* metadata marks.
It does not provide encryption, true physical-location verification,
forward error correction, provenance beyond the authorized key holder,
nor enforce data-access permissions.

Binary format (network/big endian):
    MAGIC (4 B = b"V5DN")
    schema_version (1 B = 1)
    atlas_id (4 B uint32)
    key_id (4 B uint32)
    cell_id (8 B uint64, V5-64 v1 canonical)
    epoch_seconds (8 B uint64)
    flags (1 B, only low 2 bits permitted)
    marks (4 B uint32; up to 10 digits x 2 bits, unused bits zero)
    crc32 (4 B, over all preceding 34 B; accidental error detection)
    hmac_tag (16 B, truncated HMAC-SHA256 with domain separator)
Total 54 bytes.

For production use a frozen atlas_id, secure 32+ byte secret,
rotation-aware key management and an explicitly reviewed protocol.
"""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
import hmac
import struct
from typing import Mapping, Sequence
import zlib

from src.v5id import decode as decode_cellid

MAGIC = b"V5DN"
SCHEMA_VERSION = 1
TAG_BYTES = 16
KEY_MIN_BYTES = 32
MARK_NONE = 0
MARK_BOUNDARY = 1
MARK_REVISED = 2
MARK_REVIEW = 3
FLAG_SYNTHETIC = 1
FLAG_REVIEWED = 2
_ALLOWED_FLAGS = FLAG_SYNTHETIC | FLAG_REVIEWED
_STRUCT = struct.Struct(">4sBIIQQBI")
_DOMAIN = b"V5/SPATIAL-DNA-v0.1/HMAC-SHA256\x00"
RECORD_BYTES = _STRUCT.size + 4 + TAG_BYTES
_U32 = (1 << 32) - 1
_U64 = (1 << 64) - 1


@dataclass(frozen=True)
class SpatialDNARecord:
    cell_id: int
    atlas_id: int
    epoch_seconds: int
    flags: int
    marks: tuple[int, ...]
    key_id: int

    @property
    def resolution(self) -> int:
        return len(self.marks)


def _uint(name: str, value: int, max_value: int) -> None:
    if type(value) is not int or not (0 <= value <= max_value):
        raise ValueError(f"{name} must be unsigned integer 0..{max_value}")


def _key(secret: bytes) -> bytes:
    if not isinstance(secret, bytes) or len(secret) < KEY_MIN_BYTES:
        raise ValueError("HMAC key must be bytes of at least 32 bytes")
    return secret


def _mac(secret: bytes, data: bytes) -> bytes:
    return hmac.new(_key(secret), _DOMAIN + data, hashlib.sha256).digest()[:TAG_BYTES]


def pack_dna(
    cell_id: int, *,
    atlas_id: int,
    epoch_seconds: int,
    marks: Sequence[int],
    key_id: int,
    secret: bytes,
    flags: int = 0,
) -> bytes:
    """Pack a signed sidecar; cell_id remains unchanged and standalone."""
    address = decode_cellid(cell_id)
    _uint("atlas_id", atlas_id, _U32)
    _uint("epoch_seconds", epoch_seconds, _U64)
    _uint("key_id", key_id, _U32)
    _uint("flags", flags, _ALLOWED_FLAGS)
    if not isinstance(marks, (tuple, list)) or len(marks) != address.resolution:
        raise ValueError("Exactly one 2-bit mark per encoded cell level required")
    if any(type(v) is not int or not (0 <= v <= 3) for v in marks):
        raise ValueError("Each metadata mark must be 0..3")
    mark_word = sum(value << (i * 2) for i, value in enumerate(marks))
    body = _STRUCT.pack(
        MAGIC, SCHEMA_VERSION, atlas_id, key_id,
        cell_id, epoch_seconds, flags, mark_word,
    )
    checksum = struct.pack(">I", zlib.crc32(body) & _U32)
    return body + checksum + _mac(secret, body + checksum)


def unpack_dna(data: bytes, *, keys: Mapping[int, bytes]) -> SpatialDNARecord:
    """Validate canonicality, CRC and HMAC before exposing metadata."""
    if not isinstance(data, bytes) or len(data) != RECORD_BYTES:
        raise ValueError(f"DNA envelope must be exactly {RECORD_BYTES} bytes")
    body, checksum, signature = (
        data[:_STRUCT.size],
        data[_STRUCT.size:_STRUCT.size+4],
        data[-TAG_BYTES:],
    )
    (magic, version, atlas_id, key_id,
     cell_id, epoch_seconds, flags, mark_word) = _STRUCT.unpack(body)
    if magic != MAGIC or version != SCHEMA_VERSION:
        raise ValueError("Unsupported Spatial DNA envelope")
    _uint("flags", flags, _ALLOWED_FLAGS)
    address = decode_cellid(cell_id)
    if mark_word >> (2 * address.resolution):
        raise ValueError("Noncanonical metadata padding")
    if struct.unpack(">I", checksum)[0] != zlib.crc32(body) & _U32:
        raise ValueError("Checksum mismatch: accidental data corruption")
    if key_id not in keys:
        raise ValueError("Unknown authentication key identifier")
    expected = _mac(keys[key_id], body + checksum)
    if not hmac.compare_digest(expected, signature):
        raise ValueError("Authentication failed: unauthenticated content")
    marks = tuple((mark_word >> (2 * i)) & 3
                  for i in range(address.resolution))
    return SpatialDNARecord(
        cell_id, atlas_id, epoch_seconds, flags, marks, key_id,
    )
