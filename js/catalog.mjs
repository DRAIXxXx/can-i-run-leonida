// Search by model number, with or without spaces, punctuation or ™/® marks.
export function matchesModel(name, query) {
  const compact = value => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const haystack = compact(name);
  return query.trim().split(/\s+/).every(token => haystack.includes(compact(token)));
}

export async function loadHardwareCatalog() {
  try {
    const response = await fetch(new URL("../assets/data/hardware.json?v=1", import.meta.url));
    if (!response.ok) throw new Error("Catalog unavailable");
    const data = await response.json();
    for (const kind of ["cpu", "gpu"]) {
      const select = document.getElementById(kind);
      if (!Array.isArray(data[kind])) continue;
      const known = new Set([...select.options].map(option => option.value.toLowerCase()));
      const group = document.createElement("optgroup");
      group.label = "More models · comparison may be unavailable";
      for (const name of data[kind]) {
        if (typeof name !== "string" || name.length > 180 || known.has(name.toLowerCase())) continue;
        group.append(new Option(name, name));
        known.add(name.toLowerCase());
      }
      select.insertBefore(group, select.querySelector('option[value="custom"]'));
    }
  } catch {
    // Keep the original list and manual entry usable if the catalog fails.
  }
}
