# Hardware names

Data from [TechAPI](https://github.com/GetTechAPI/TechAPI), licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
The derived `hardware.json` dataset is released under the same license.

This is a names-only extract of the CPU and GPU records. We add manufacturer
prefixes where missing, normalize GB spacing, remove CPU architecture
parentheses, sort, and deduplicate names. We include desktop/laptop Intel Core
and Ryzen CPUs released from 2015, plus consumer GeForce GTX/RTX/MX/GT 1030,
Radeon RX/VII and Intel Arc GPUs released from 2014. Server, datacenter and
legacy families are excluded, as are obscure GPU die/OEM/rebrand variants.
The original curated laptop and integrated choices are retained separately.
The upstream commit is recorded in `hardware.json`. No upstream benchmark
scores or claims of verification are imported. Inclusion in this list does not
confirm Leonida support, performance, or even Windows compatibility.

To refresh, check out a reviewed TechAPI revision and run:

```
python scripts/import-hardware.py /path/to/TechAPI
```

The checker retains its curated choices and accepts manually entered models
as well. This snapshot is broad but cannot promise every chip ever produced.
