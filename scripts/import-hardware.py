"""Build the local, names-only catalog from a checked-out TechAPI dataset.

Usage: python scripts/import-hardware.py /path/to/TechAPI
No upstream code is executed and no benchmark scores are imported.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

source = Path(sys.argv[1]).resolve()
target = Path(__file__).resolve().parents[1] / "assets" / "data"
target.mkdir(parents=True, exist_ok=True)
revision = subprocess.check_output(["git", "-C", str(source), "rev-parse", "HEAD"], text=True).strip()
catalog = {"source": "https://github.com/GetTechAPI/TechAPI", "revision": revision}
for kind in ("cpu", "gpu"):
    names = set()
    for file in sorted((source / "data" / kind).rglob("*.json")):
        record = json.loads(file.read_text())
        name = re.sub(r"\s*\(\s*\)\s*", " ", record["name"])
        name = " ".join(name.split())
        vendor = {"amd": "AMD", "ati": "ATI", "nvidia": "NVIDIA", "intel": "Intel"}.get(record["manufacturer"], record["manufacturer"].title())
        if not name.lower().startswith(vendor.lower() + " "):
            name = vendor + " " + name
        if not 1 <= len(name) <= 180 or any(ord(c) < 32 for c in name):
            raise ValueError(f"Invalid model name in {file}")
        names.add(name)
    catalog[kind] = sorted(names, key=str.casefold)
(target / "hardware.json").write_text(json.dumps(catalog, ensure_ascii=False, separators=(",", ":")) + "\n")
print({kind: len(catalog[kind]) for kind in ("cpu", "gpu")})
