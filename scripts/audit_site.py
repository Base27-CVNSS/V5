#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
"""Static V5 website release audit. No network calls or third-party libraries."""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = ("index.html", "technical-specification.html", "mathematical-proof.html", "use-cases.html", "geo-lab.html")
REQUIRED_DOCUMENTS = (
    "README.md", "LICENSE", "NOTICE", "SECURITY.md",
    "CHANGELOG.md", "docs/PROOF.md", "docs/TECHNICAL_SPEC_EN.md",
    "docs/V5-64.md", "src/v5.py", "src/v5id.py", "web/v5-geo.js", "web/v5-geo-lab.js", "docs/GEO_ADAPTER_V0_1.md",
    "web/v5-sphere-math.js", "web/v5-3d.js",
    "web/v5-usecases-data.js", "web/v5-usecases.js", "web/v5-usecases-math.js",
    "docs/USE_CASES_50_VI.md",
    "docs/SPATIAL_DNA_V0_1.md", "src/v5dna.py",
    "web/v5-entropy.js", "web/v5-entropy-ui.js",
    "web/v5-web3.css", "web/v5-orb.svg", "web/v5-i18n.js",
    "web/v5-compare.js", "web/v5-metrics.js",
)
DANGEROUS_ATTRS = {"onload", "onerror", "onclick", "onfocus", "onmouseover"}
UNSAFE_CALLS = (r"\beval\s*\(", r"\bnew\s+Function\s*\(", r"\bdocument\.write\s*\(")


class Inspector(HTMLParser):
    def __init__(self, page: str):
        super().__init__(convert_charrefs=True)
        self.page = page
        self.errors: list[str] = []
        self.scripts = 0
        self.has_title = False
        self.has_csp = False
        self.has_referrer = False
        self.current = None
        self.fragment_ids = set()
        self.links = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self.has_title = True
        if a.get("id"):
            if a["id"] in self.fragment_ids:
                self.errors.append("duplicate id: " + a["id"])
            self.fragment_ids.add(a["id"])
        for name, _ in attrs:
            if name in DANGEROUS_ATTRS:
                self.errors.append(f"inline event attribute {name} on <{tag}>")
        if tag == "meta" and a.get("http-equiv", "").lower() == "content-security-policy":
            self.has_csp = True
            policy = a.get("content", "")
            if "object-src 'none'" not in policy or "base-uri 'self'" not in policy:
                self.errors.append("CSP missing object-src/base-uri restrictions")
        if tag == "meta" and a.get("name", "").lower() == "referrer":
            self.has_referrer = True
        if tag in ("object", "embed", "iframe"):
            self.errors.append(f"unexpected active embed <{tag}>")
        if a.get("target") == "_blank":
            rel = set(a.get("rel", "").split())
            if "noopener" not in rel or "noreferrer" not in rel:
                self.errors.append(f"target=_blank requires noopener noreferrer ({a.get('href')})")
        if tag == "script":
            self.scripts += 1
            src = a.get("src")
            if src:
                if src.startswith(("http:", "//")):
                    self.errors.append("insecure script source: "+src)
                if src.startswith("https:") and not re.search(r"[@/]v?\d+\.\d+\.\d+", src):
                    self.errors.append("unversioned external script: " + src)
                if not src.startswith(("http:", "https:", "//")):
                    self._check_local(src)
        if tag in ("a", "link") and a.get("href"):
            self.links.append(a["href"])

    def _check_local(self, value):
        url = urlsplit(value)
        path = url.path
        if not path or path.startswith("/"):
            return
        normalized = (ROOT / path.removeprefix("./")).resolve()
        if not normalized.is_relative_to(ROOT):
            self.errors.append("path traverses repository: "+value)
        elif not normalized.exists():
            self.errors.append("missing local script: "+value)

    def finish(self):
        if not self.has_title:
            self.errors.append("missing title")
        if not self.has_csp:
            self.errors.append("missing Content-Security-Policy meta")
        if not self.has_referrer:
            self.errors.append("missing referrer policy")
        for link in self.links:
            u = urlsplit(link)
            if u.scheme or u.netloc:
                if u.scheme not in ("https", "mailto"):
                    self.errors.append("insecure link protocol: "+link)
                continue
            path = u.path.removeprefix("./")
            if path and path.endswith((".html", ".js", ".css")):
                local = (ROOT / path).resolve()
                if not local.is_relative_to(ROOT) or not local.exists():
                    self.errors.append("missing local asset: "+link)
            if not path and u.fragment and u.fragment not in self.fragment_ids:
                self.errors.append("unknown local fragment: "+link)


def main():
    errors = []
    for path in REQUIRED_DOCUMENTS:
        if not (ROOT / path).is_file():
            errors.append("missing required file: "+path)
    for name in PAGES:
        file = ROOT / name
        if not file.is_file():
            errors.append("missing HTML: "+name)
            continue
        content = file.read_text(encoding="utf-8")
        inspector = Inspector(name)
        inspector.feed(content)
        inspector.finish()
        errors += [name + ": " + item for item in inspector.errors]
        for pattern in UNSAFE_CALLS:
            if re.search(pattern, content):
                errors.append(name+": forbidden dynamic execution pattern "+pattern)
        if "V5" not in content:
            errors.append(name+": missing project identity")
    js = ROOT / "web/v5-sphere-math.js"
    if js.exists():
        text = js.read_text(encoding="utf-8")
        if "segmentsIntersect" not in text or "strictPentagon" not in text:
            errors.append("JS geometry requires the robust simple-polygon predicate")
    if errors:
        print("V5 SITE AUDIT FAILED ("+str(len(errors))+" issues)")
        for item in errors:
            print(" - "+item)
        return 1
    print(f"V5 SITE AUDIT PASS: {len(PAGES)} pages, local links, CSP meta, referrer policy, basic JS safety and critical source files.")
    print("LIMITATIONS: static-only; does NOT establish third-party JS integrity, a browser/WebGL E2E test, penetration testing, or a global DGGS geometry proof.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
