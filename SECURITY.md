# Security Policy — V5 Research v1.0.0

**Versioned scope:** The static documentation website, JavaScript 3D demo, exact rational Python weak-refinement research code, and the V5-64 v1 hierarchical-address codec.

## Reporting vulnerabilities

Please use GitHub's **private vulnerability reporting / Security Advisory** feature on this repository if it is enabled. If unavailable, contact the repository maintainers through a non-public channel; **do not post exploit details, private data, keys or user-specific security issues in public issues.** No response-time SLA is implied.

## Security architecture

- This is a static GitHub Pages site: no login, backend database, payment flow, secrets or personal data collection is intended.
- CellIDs are spatial identifiers, **not** authentication, access control, encryption, private location masking or anonymity.
- Input root/resolution/path validation applies to the Python codec. Static research geometry can consume arbitrary-precision rationals; callers SHOULD cap depth and total output size to control CPU/memory exhaustion.
- Browser-supplied V5-64 paths must be validated; BigInt is required for exact UInt64 handling in JavaScript. Do not parse a 64-bit ID as JavaScript Number.
- The site uses a baseline CSP **meta policy**, restrictive referrer policy and noopener/noreferrer external links. **Current CSP permits inline scripts** for the legacy single-file interface and is not as strong as a hash-only or external-script CSP. GitHub Pages meta tags also cannot implement response-header-only protection such as frame-ancestors.
- The Three.js import map pins the CDN package to v0.160.0, but remote module resources are **not cryptographically integrity-pinned**. A compromised CDN or its dependency path remains a residual software-supply-chain risk. Before high-assurance usage, vendor reviewed Three.js assets locally, pin artifact digests and use a strict script CSP.
- No claim is made that WebGL/browser E2E or penetration testing was performed.

## Supported versions

| Component | Supported version | Status |
| --- | --- | --- |
| V5 research website and technical specification | 1.0.0 | Scope-limited baseline; static site |
| V5-64 codec wire format | Version field 1 | Experimental, 10 levels, not global WGS84 |
| Strong convex 32-way DGGS or GeoAI SDK | None | Not implemented; unsupported |

## Threat model and release controls

| Threat | Defense and residual limitation |
| --- | --- |
| XSS from future dynamic content | No interpolation of untrusted HTML; avoid innerHTML/eval; static code audit. Inline CSP allowance remains. |
| Tabnabbing | All target=_blank links require rel=noopener noreferrer |
| CDN script substitution | Pinned version and CSP allowlist; **SRI/self-hosting outstanding** |
| Integer precision/identifier forgery | Codec range checks, canonical padding, BigInt or hex serialization; CellID is not authentication |
| Resource exhaustion | Research depth bounds; no untrusted remote geometry upload accepted by the static site |
| Spherical numeric degeneracy | Explicit research limits, exact planar arithmetic, browser regression and CI; global proof unavailable |
| CI / deployment compromise | Minimal GitHub Actions permissions, test-gated Pages publishing; actions pinned by major tags rather than full digests (outstanding hardening) |

Security testing does not imply correctness of an unimplemented global DGGS, OGC conformance or privacy protection.
