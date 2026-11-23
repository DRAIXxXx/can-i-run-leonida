"""Build a focused gaming-PC catalog from a checked-out TechAPI dataset.

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

def relevant(kind, record, file):
    name = record["name"]
    year = int((record.get("release_date") or "0000")[:4])
    if kind == "cpu":
        return (
            record.get("segment") in ("desktop", "laptop")
            and year >= 2015
            and bool(re.match(r"(?:Intel Core |AMD Ryzen (?:[3579]|AI))", name))
            and not re.search(r"embedded|threadripper", name, re.I)
        )
    return (
        "consumer" in file.parts
        and year >= 2014
        and bool(re.match(r"(?:GeForce (?:GTX|RTX|GT 1030|MX)|Radeon (?:RX |VII)|Arc )", name, re.I))
        and not re.search(r"\b(?:GA\d+|AD\d+|GP\d+|TU\d+|OEM|Rebrand|\d+SP|Mac|X2|GME)\b", name, re.I)
    )

for kind in ("cpu", "gpu"):
    names = set()
    for file in sorted((source / "data" / kind).rglob("*.json")):
        record = json.loads(file.read_text())
        if not relevant(kind, record, file):
            continue
        name = re.sub(r"\s*\(\s*\)\s*", " ", record["name"])
        if kind == "cpu":
            name = re.sub(r"\s*\([^)]*\)", "", name)
        name = re.sub(r"(\d)\s*GB\b", r"\1 GB", name, flags=re.I)
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
