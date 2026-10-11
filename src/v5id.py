# SPDX-License-Identifier: Apache-2.0
# Long Ngo 2026 · Vietflexmap Copyright (c) 2025
"""V5-64 canonical HIERARCHICAL PATH encoding (research format v1).

This module does NOT map geographic coordinates to cells, calculate global
neighbors, or claim global geospatial interoperability. It maps 12 root
indices and base-32 subdivision paths to 64-bit integers.
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import Sequence

VERSION_BITS = 4
RESOLUTION_BITS = 4
ROOT_BITS = 6
PATH_BITS = 50
MAX_RESOLUTION = 10
ROOT_COUNT = 12
MAX_WORD = 1 << 64
FORMAT_VERSION = 1


@dataclass(frozen=True)
class CellAddress:
    version: int
    root: int
    path: tuple[int, ...]

    @property
    def resolution(self) -> int:
        return len(self.path)

    def encode(self) -> int:
        return encode(self.root, self.path, self.version)


def encode(root: int, path: Sequence[int] = (), version: int = FORMAT_VERSION) -> int:
    """Pack root, resolution, and path in version:4|res:4|root:6|path:50."""
    path = tuple(path)
    if not (1 <= version <= 15):
        raise ValueError("Version must be in 1..15")
    if not (0 <= root < ROOT_COUNT):
        raise ValueError("Root must be in 0..11")
    if len(path) > MAX_RESOLUTION:
        raise ValueError("Path holds at most 10 base-32 digits")
    if any(not isinstance(d, int) or not (0 <= d < 32) for d in path):
        raise ValueError("Every path digit must be an integer in 0..31")
    word = (version << 60) | (len(path) << 56) | (root << 50)
    for i, digit in enumerate(path):
        word |= digit << (PATH_BITS - 5 * (i + 1))
    return word


def decode(word: int) -> CellAddress:
    """Reject invalid or noncanonical words, including padding garbage."""
    if not isinstance(word, int) or not (0 <= word < MAX_WORD):
        raise ValueError("Expected an unsigned 64-bit integer")
    version = (word >> 60) & 15
    resolution = (word >> 56) & 15
    root = (word >> 50) & 63
    if version == 0 or resolution > MAX_RESOLUTION or root >= ROOT_COUNT:
        raise ValueError("Invalid V5-64 header")
    suffix_bits = PATH_BITS - 5 * resolution
    if suffix_bits and word & ((1 << suffix_bits) - 1):
        raise ValueError("Noncanonical nonzero unused path padding")
    path = tuple((word >> (PATH_BITS - 5 * (i + 1))) & 31
                 for i in range(resolution))
    return CellAddress(version, root, path)


def parent(word: int) -> int:
    cell = decode(word)
    if cell.resolution == 0:
        raise ValueError("Root cells do not have a parent in this format")
    return encode(cell.root, cell.path[:-1], cell.version)


def child(word: int, digit: int) -> int:
    cell = decode(word)
    if cell.resolution == MAX_RESOLUTION:
        raise ValueError("Maximum resolution already reached")
    return encode(cell.root, cell.path + (digit,), cell.version)


def children(word: int) -> tuple[int, ...]:
    return tuple(child(word, digit) for digit in range(32))


def to_hex(word: int) -> str:
    decode(word)
    return f"0x{word:016x}"


def geometry_in_example_root(word: int):
    """Resolve an ID within the planar reference pentagon only.

    This does NOT determine a WGS84 coordinate or a global root-face transform.
    Each base-32 digit is interpreted as five binary left/right split choices.
    """
    from src.v5 import ROOT, split_pentagon
    cell = decode(word)
    polygon = ROOT
    for digit in cell.path:
        for shift in (4, 3, 2, 1, 0):
            left, right = split_pentagon(polygon)
            polygon = right if ((digit >> shift) & 1) else left
    return polygon


if __name__ == "__main__":
    sample = encode(0, (7, 16, 31))
    print(to_hex(sample))
    print(decode(sample))
