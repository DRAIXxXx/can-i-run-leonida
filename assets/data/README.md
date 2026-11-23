# Hardware names

Data from [TechAPI](https://github.com/GetTechAPI/TechAPI), licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
The derived `hardware.json` dataset is released under the same license.

This is a names-only extract of the CPU and GPU records. We add manufacturer
prefixes where missing, remove empty parentheses, sort, and deduplicate names.
The upstream commit is recorded in `hardware.json`. No upstream benchmark
scores or claims of verification are imported. Inclusion in this list does not
confirm Leonida support, performance, or even Windows compatibility.

To refresh, check out a reviewed TechAPI revision and run:

```
python scripts/import-hardware.py /path/to/TechAPI
```

The checker retains its curated choices and accepts manually entered models
as well. This snapshot is broad but cannot promise every chip ever produced.
