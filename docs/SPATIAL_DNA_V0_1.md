# V5 Spatial DNA v0.1 — Entropy, Security, Recovery and Evolution

**Project:** V5 Research Reference 1.0.0 · Long Ngo 2026 · Vietflexmap Copyright (c) 2025 · Apache-2.0  
**Status:** Experimental, separately authenticated metadata sidecar, not a new V5 CellID codec or completed security standard.  
**Prototype:** [src/v5dna.py](../src/v5dna.py) · [tests/test_v5dna.py](../tests/test_v5dna.py) · [Web theorem](../mathematical-proof.html#spatial-dna)

> **Critical distinction:** The claimed **77.4% entropy efficiency / 22.6% redundancy** refers ONLY to an alternative **five-way** tree digit alphabet encoded into fixed **3-bit slots**. Current V5-32 has **32 choices in 5 bits**, and no unused path codewords at all. The 22.6% is not a spare-bit pool in V5-64 v1.

## 1. Mathematical capacity audit

For an *alternative five-child hierarchy* with valid digits 0..4 stored using three bits per digit, the maximum information efficiency at uniformly distributed child choices is:

\[
\eta_5 = \frac{\log_2 5}{3} = 0.773976\ldots \approx 77.4\%,
\quad 1-\eta_5 \approx 22.6\%.
\]

This compares symbol-alphabet capacity to allocated bits, **not** the measured Shannon entropy of a GIS dataset. If the five choices are not equiprobable, the true entropy `H(D)=-\sum_i p_i\log_2p_i` can be smaller.

At **15 levels** of the hypothetical five-way tree:
- Fixed-width path: 15 × 3 = **45 bits**.
- Theoretical information: 15 × log₂(5) ≈ **34.829 bits**.
- Lossless fixed binary packing for all 5¹⁵ sequences needs ceil(34.829) = **35 bits**.
- Hence **10 physical bits** could be freed by re-encoding the **entire 45-bit path** as a dense base-5 rank. NOT 15 metadata bits, and not three free bits per level.

Reserved bit patterns 5, 6, 7 in a three-bit slot mean **invalid digit values**. One three-bit word cannot simultaneously encode a valid child from 0..4 and a separate extra metadata bit without changing the codebook or using more physical bits.

**Current V5-32 v1** (`src/v5id.py`) uses 12 roots, 32 child digits per parent, 10 levels, and `4 version + 4 resolution + 6 root + 50 path = 64`. Each of the 32 child values 0..31 uses exactly **5 bits**, with maximum alphabet capacity efficiency `log₂(32)/5=100%` at any given level. There are **zero unused digit codewords**. At resolution 10, all 50 path bits are occupied. Padding at a shallower level is required to be zero for canonicality, NOT a free metadata channel.

### When does inefficiency matter?

| Workload | Impact of 77.4% five-way three-bit coding |
| --- | --- |
| One fixed uint64 per stored identifier | **Not automatically a RAM/network penalty:** IDs still use 8 bytes, regardless of path entropy |
| Billions of densely packed path digits | **Potential real bit-budget cost:** a 45-bit fixed path can be encoded losslessly in 35 bits with dense base-5 ranking |
| Versioned deep indexes | The 10-bit avoidable gap, *if adopted*, can shift depth/metadata capacity |
| SIMD/GPU bitwise operations | Fixed 3-bit digit extraction is simple; dense base-5 packing introduces arithmetic/decoding cost. Benchmark, do not assume a winner |
| Current V5-32 5-bit digits | **77.4% does not apply.** No 22.6% reserved pattern capacity in v1 |

## 2. Audit of unsupported security and error-correction claims

| Original proposal | Mathematical / security correction |
| --- | --- |
| "15 allele–epigenetic pairs with 3+3 bits per level inside 64-bit" | 15 × 6 = **90 bits**, before version/root header. Impossible in a 64-bit word |
| "Patterns 5, 6, 7 hold hidden epigenetic values alongside a valid 3-bit child digit" | They are reserved *invalid codewords*, not simultaneous extra fields |
| "Signature 15-bit enough against forgery" | A uniformly guessed 15-bit tag succeeds with probability **1/32768** per try. Not safe for production authentication |
| "0xFFFF, 0xAAAA, 0x5555 are 15-bit watermarks" | These are **16-bit** values; tags/labels do not prove authenticity |
| "Hamming(5,3) corrects any 1-bit error for 3 unrestricted data bits" | Hamming bound: 2³ × (1+5) = **48 > 32 = 2⁵**. Therefore no such binary 5-bit single-error-correcting code exists |
| "Lineage bit or CRC is digital signature" | CRC verifies accidental integrity only. A one-bit hash is trivial to forge. Use cryptographic MAC/signatures with keys |
| "Self-healing interpolates an entirely lost child path from parent and next level" | **Not uniquely recoverable** without a separately stored redundant copy or parity/erasure code |
| "Metadata bits provide ACL" | Bit flags are claims. Permissions require enforced RBAC/ABAC policy and authenticated principals |
| "Watermark prevents LLM hallucination" | A provenance label does not establish factual accuracy of generated answers |
| "H3/S2 cannot do metadata, security or temporal lineage" | They can be used with external signed metadata just like V5. Spatial DNA is a project architecture, **not an exclusive physical capability of pentagons** |

## 3. Correct architecture — spatial identity + signed epigenetic sidecar

`
  V5-64 v1 CellID (8 bytes, unchanged)
    version:4 | resolution:4 | root:6 | child path:50
        |
        +-- optional Spatial DNA v0.1 envelope (54 bytes total)
        |    - atlas_id / key_id / epoch / flags
        |    - 2-bit metadata mark for each actual level (0..10)
        |    - CRC32 to detect accidental changes
        |    - HMAC-SHA256/128 tag to authenticate the envelope
        |
        +-- external history / provenance / authority
             - EntityID, spatial atlas geometry hash
             - signed observation hashes and producer identity
             - time-series events, access policy, recovery backups
             - key rotation, replay prevention and IAM
`

The sidecar avoids modifying existing CellIDs, so V5-64 roots/paths and all parent–child APIs remain backward compatible.

**Storage trade-off:** 54 bytes of sidecar versus 8 bytes for a standalone ID means **6.75 times the bytes** if attached to every dense record, before database overhead. Thus the ADN is an *opt-in metadata layer*, not a 64-bit "free feature". Keep densely stored cell IDs alone and materialize sidecars only for records that need authentication/provenance.

### Per-level "epigenetic" marks (2 bits each)

| Value | Meaning | Nature |
| --- | --- | --- |
| 0 | Unspecified | No evidence |
| 1 | Boundary candidate | Producer assertion, not certified geometry |
| 2 | Revision recorded | Requires separately stored event history |
| 3 | Needs human review | Quality-control status, not an ACL role |

The sidecar can also carry two *asserted* flags: `FLAG_SYNTHETIC` (producer claims synthetic origin) and `FLAG_REVIEWED` (producer claims reviewed). Authentication binds the assertion to a key holder but does not prove it is true. Valid level marks require **exactly the cell's resolution**; unused bits remain zero.

### Wire format v0.1 (network byte order, exactly 54 bytes)

| Offset | Bytes | Field | Notes |
| --- | ---: | --- | --- |
| 0–3 | 4 | ASCII `V5DN` | Magic |
| 4 | 1 | Schema version | Exactly 1 |
| 5–8 | 4 | `atlas_id` | Frozen GIS atlas reference supplied by application |
| 9–12 | 4 | `key_id` | Symmetric key lookup |
| 13–20 | 8 | `cell_id` | Unchanged, canonical V5-64 v1 uint64 |
| 21–28 | 8 | `epoch_seconds` | UTC time label (not secure freshness) |
| 29 | 1 | `flags` | 0..3 |
| 30–33 | 4 | `marks` | Up to 10 × 2-bit marks, zero high padding |
| 34–37 | 4 | CRC32 | Accidental corruption detection over bytes 0..33 |
| 38–53 | 16 | HMAC-SHA256 tag | First 16 bytes of tag over domain prefix and bytes 0..37 |

Tag input is `b"V5/SPATIAL-DNA-v0.1/HMAC-SHA256\\x00" + body + crc`. Use secure 32+ byte keys and constant-time tag comparison. HMAC 128-bit tags are vastly more appropriate than a 15-bit checksum, but the application still needs key rotation, replay controls, secure enrollment and protocol review. CRC does **not** add authentication. Neither mechanism encrypts the ID or metadata.

### Reproducible Python sample

```python
from src.v5id import encode, to_hex
from src.v5dna import pack_dna, unpack_dna, FLAG_SYNTHETIC

# DEMO KEY ONLY: production systems must use protected key management.
secret = bytes(range(32))
cell = encode(7, (2, 0, 4))
assert to_hex(cell) == "0x131c402000000000"
envelope = pack_dna(
    cell, atlas_id=42, epoch_seconds=1_789_000_000,
    marks=(1, 2, 3), flags=FLAG_SYNTHETIC,
    key_id=7, secret=secret
)
assert len(envelope) == 54
result = unpack_dna(envelope, keys={7: secret})
assert result.cell_id == cell
assert result.marks == (1, 2, 3)
```

## 4. Security, recovery and temporal evolution — honest capability levels

### 4.1. Authentication and integrity

The prototype HMAC authenticates the **sidecar bytes** to holders of a shared key. It does not identify a signer individually, prove an image is real, or verify external LiDAR/BIM files that are not included in the tag. For multiple independent producers, use **digital signatures (such as Ed25519) over payload hashes, CellID, atlas ID and time**, with producer identity and a trust registry. **Not implemented.**

### 4.2. Repair, backup and ECC

CRC32 detects many accidental errors but cannot reconstruct damaged bits. HMAC detects tampering when the key is trusted; it also cannot reconstruct data. To recover destroyed content, introduce **independent** FEC/redundant blocks, snapshots, parity, or erasure coding. An arbitrary lost path digit cannot be determined uniquely from a parent prefix. **Self-healing/ECC is not implemented.**

### 4.3. Privacy and access control

Keep private attributes in protected storage with service-side IAM/RBAC/ABAC checks. A CellID can reveal geographic region; hashing it without a secret or adding a two-bit ACL label does not prevent location disclosure. Encryption requires an authenticated encryption scheme such as AES-GCM with secure nonce/key management (separate future work).

### 4.4. Lineage, atlas migration, temporal events

The path itself determines topological **address ancestry**, not an authenticated history of edits. For new geometry versions, register a new atlas/version and migrate IDs explicitly. Maintain timestamped records in an append-only signed event log; do not mutate historical CellID bits. Epigenetic marks are compact quality hints, not compressed full time series.

### 4.5. GeoAI and World Models

Attach authenticated provenance, observation time, quality flags and entity IDs to tokens; train using actual geometry and error budgets. Labels like synthetic/reviewed may assist filtering, but cannot guarantee correct ML labels or remove LLM hallucinations.

## 5. Alternative base-5 successor codec (a separate research proposal)

A true 5-child geometric hierarchy would be **a new tree**, not the existing 32-child V5. Its 15 three-bit digits take 45 bits, but 15 base-5 digits could be represented by a fixed 35-bit integer rank. A revised protocol might use the 10 bits recovered **inside the original 45-bit path budget** for flags or short error-detection. Do **not** claim those 10 bits are a secure HMAC or 15 metadata bits.

Decoding dense base-5 ranks uses positional division/modulus instead of fixed 3-bit shifts; benchmark actual speed. A new codec must carry an explicit wire-format version and full atlas migration, not silently reuse V5-64 v1 canonical padding.

## 6. Research acceptance tests and limitations

- [x] Prototype with immutable 64-bit CellID and separately authenticated 54-byte metadata envelope.
- [x] Canonical level marks and version checks; reject nonzero metadata padding.
- [x] CRC32 corruption detection; truncated 128-bit HMAC with constant-time verification.
- [x] Regression tests for altered records, forged CRCs, wrong keys, invalid cell IDs and ten-level path.
- [ ] Real cryptographic signature / trusted multi-producer provenance.
- [ ] Encryption, IAM/ACL enforcement, replay protection, secure key custody.
- [ ] Bit-error *correction*, erasure recovery, backup restores.
- [ ] Binding hash of actual spatial payload and trusted WGS84 geometry.
- [ ] External penetration test / protocol review / measured performance.

**Important:** H3, S2 and V5 may all use authenticated sidecars. Spatial DNA is a potential *data architecture* for V5 research, not a theorem that V5 beats other grids.

### References

- [V5-64](V5-64.md) · [V5 technical specification](TECHNICAL_SPEC_EN.md) · [Security policy](../SECURITY.md)
- [RFC 2104: HMAC](https://www.rfc-editor.org/rfc/rfc2104)
- [Python hmac module](https://docs.python.org/3/library/hmac.html)
- [OGC DGGS](https://docs.ogc.org/as/20-040r3/20-040r3.html)

**V5 Spatial DNA v0.1 — experimental research extension, not a production GIS or cryptographic standard.**
