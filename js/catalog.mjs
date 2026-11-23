// Search by model number, with or without spaces, punctuation or ™/® marks.
export function matchesModel(name, query) {
  const compact = value => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const haystack = compact(name);
  return query.trim().split(/\s+/).every(token => haystack.includes(compact(token)));
}

const modelNames = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
const ordinal = number => `${number}${number % 100 >= 11 && number % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[number % 10] ?? 'th')}`;

function sectionFor(name, kind) {
  const entry = (brand, family, generation, label, model = 0) => ({ brand, family, generation, label, model });
  if (kind === 'cpu') {
    const ultra = name.match(/Intel Core Ultra\s+[3579]\s+(\d{3})/i);
    if (ultra) {
      const series = Math.floor(Number(ultra[1]) / 100) * 100;
      return entry(0, 3, series, `Intel · Core Ultra ${series} series`, Number(ultra[1]));
    }
    const classic = name.match(/Intel Core\s+[im][3579][-\s]*(\d{1,5})([a-z\d]*)/i);
    if (classic) {
      const digits = classic[1];
      const generation = /^(?:10|11|12|13|14)/.test(digits) && digits.length >= 4 ? Number(digits.slice(0, 2)) : Number(digits[0]);
      return entry(0, 1, generation, `Intel · ${ordinal(generation)} gen Core`, Number(digits));
    }
    const core = name.match(/Intel Core\s+[3579]\s+(\d{3})/i);
    if (core) {
      const series = Math.floor(Number(core[1]) / 100) * 100;
      return entry(0, 2, series, `Intel · Core ${series} series`, Number(core[1]));
    }
    const ai = name.match(/AMD Ryzen AI\b.*?\b(\d{3})\b/i);
    if (ai) {
      const max = /\bmax\b/i.test(name);
      const series = Math.floor(Number(ai[1]) / 100) * 100;
      return entry(1, max ? 1 : 2, series, `AMD · Ryzen AI${max ? ' Max' : ''} ${series} series`, Number(ai[1]));
    }
    const ryzen = name.match(/AMD Ryzen\s+[3579]\s+(?:PRO\s+)?(\d{4})/i);
    if (ryzen) {
      const series = Math.floor(Number(ryzen[1]) / 1000) * 1000;
      return entry(1, 3, series, `AMD · Ryzen ${series} series`, Number(ryzen[1]));
    }
    if (/AMD Ryzen/i.test(name)) return entry(1, 0, 0, 'AMD · Other Ryzen models');
    return entry(2, 0, 0, 'Other CPUs');
  }
  const geforce = name.match(/\b(RTX|GTX|GT|MX)\s*(\d{3,4})/i);
  if (/NVIDIA/i.test(name) && geforce) {
    const family = geforce[1].toUpperCase();
    const model = Number(geforce[2]);
    const series = Math.floor(model / 100) * 100;
    const label = family === 'RTX' ? `${Math.floor(model / 100)} series` : family === 'GTX' && model >= 1000 ? `${Math.floor(model / 100)} series` : `${series} series`;
    return entry(0, { RTX: 4, GTX: 3, GT: 2, MX: 1 }[family], series, `NVIDIA · ${family} ${label}`, model);
  }
  const rx = name.match(/\bRX\s+(\d{3,4})/i);
  if (/AMD/i.test(name) && rx) {
    const model = Number(rx[1]);
    const series = model >= 1000 ? Math.floor(model / 1000) * 1000 : Math.floor(model / 100) * 100;
    return entry(1, 4, series, `AMD · Radeon RX ${series} series`, model);
  }
  if (/AMD.*Radeon VII\b/i.test(name)) return entry(1, 3, 7, 'AMD · Radeon VII');
  if (/AMD.*(?:RX )?Vega\s+(?:56|64)\b/i.test(name)) return entry(1, 2, 0, 'AMD · Radeon RX Vega', Number(name.match(/\b(56|64)\b/)[1]));
  if (/AMD/i.test(name)) return entry(1, 1, 0, 'AMD · Integrated graphics', Number(name.match(/\b(\d{3,4})[ms]\b/i)?.[1] ?? 0));
  const arc = name.match(/\bArc\s+([AB])(\d{3})M?\b/i);
  if (/Intel/i.test(name) && arc) return entry(2, 2, arc[1].toUpperCase() === 'B' ? 2 : 1, `Intel · Arc ${arc[1].toUpperCase()} series`, Number(arc[2]));
  if (/Intel/i.test(name)) return entry(2, 1, 0, 'Intel · Integrated graphics', Number(name.match(/\b(\d{3})[vt]\b/i)?.[1] ?? 0));
  if (/NVIDIA.*TITAN/i.test(name)) return entry(0, 0, 0, 'NVIDIA · TITAN');
  return entry(3, 0, 0, 'Other GPUs');
}

// This is model/series ordering, not a performance ranking. Laptop and desktop
// values stay distinct; suffixes and memory variants remain together.
export function hardwareSections(names, kind) {
  const variant = name => /\bti super\b/i.test(name) ? 5 : /\b(?:ti|xtx)\b/i.test(name) ? 4 : /\b(?:super|xt)\b/i.test(name) ? 3 : /\bgre\b/i.test(name) ? 2 : 0;
  const rows = names.map(name => ({ name, variant: kind === 'gpu' ? variant(name) : 0, ...sectionFor(name, kind) }));
  rows.sort((a, b) => a.brand - b.brand || b.family - a.family || b.generation - a.generation || b.model - a.model || b.variant - a.variant || modelNames.compare(a.name, b.name));
  const sections = new Map();
  for (const row of rows) {
    if (!sections.has(row.label)) sections.set(row.label, []);
    sections.get(row.label).push(row.name);
  }
  return [...sections].map(([label, names]) => ({ label, names }));
}

function organizePicker(select, kind) {
  const selected = select.value;
  const options = [...select.options];
  const byName = new Map(options.filter(option => option.value !== 'custom').map(option => [option.textContent, option]));
  const groups = hardwareSections([...byName.keys()], kind).map(section => {
    const group = document.createElement('optgroup');
    group.label = section.label;
    group.append(...section.names.map(name => byName.get(name)));
    return group;
  });
  const custom = options.find(option => option.value === 'custom');
  select.replaceChildren(...groups, ...(custom ? [custom] : []));
  select.value = selected;
}

export async function loadHardwareCatalog() {
  try {
    const response = await fetch(new URL("../assets/data/hardware.json?v=2", import.meta.url));
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
  } finally {
    for (const kind of ['cpu', 'gpu']) {
      const select = document.getElementById(kind);
      if (select) organizePicker(select, kind);
    }
  }
}
