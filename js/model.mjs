// Gaming benchmark bands relative to the i5-12400F and Ryzen 5 5600.
// Sources: Tom's Hardware's Ryzen 5 5600 review, current and legacy CPU
// hierarchies, and TechSpot's 11400F, 12400F and Ryzen 5 5600 testing.
const cpuBands = {
  above: [
    "285k", "265k", "245k", "14900k", "14700k", "14600k", "14400",
    "13900k", "13700k", "13600k", "12900k", "12700k", "12600k",
    "9850x3d", "9950x3d", "9800x3d", "9700x", "9600x", "7950x3d", "7800x3d",
    "7700", "7700x", "7600x3d", "7600", "7600x", "7500f", "5800x3d", "5700x3d",
    "7950x", "7900x", "7900", "9950x", "9900x",
  ],
  near: ["12400", "13400", "11700k", "11600k", "5700x", "5800x", "5900x", "5950x", "5600", "5600x"],
  below: [
    "13100", "12100", "11400", "11320h", "10700k", "10600k", "10400", "10100",
    "9900k", "9700k", "8700k", "5600g", "5500", "3700x", "3600", "3600x", "2600x", "2600",
  ],
};

// Bands use Tom's Hardware desktop rasterization tests. The reference range
// spans the RTX 3060 12 GB and RX 6700 XT, with room for small differences.
const gpuBands = {
  above: [
    "rtx 5090", "rtx 5080", "rtx 5070 ti", "rtx 5070", "rtx 5060 ti 16gb",
    "rtx 5060 ti 8gb", "rtx 5060", "rtx 4090", "rtx 4080 super", "rtx 4080",
    "rtx 4070 ti super", "rtx 4070 ti", "rtx 4070 super", "rtx 4070",
    "rtx 4060 ti 16gb", "rtx 4060 ti 8gb", "rtx 3090 ti", "rtx 3090",
    "rtx 3080 ti", "rtx 3080", "rtx 3070 ti", "rtx 3070",
    "rx 9070 xt", "rx 9070", "rx 9070 gre", "rx 9060 xt 16gb", "rx 9060 xt 8gb",
    "rx 7900 xtx", "rx 7900 xt", "rx 7900 gre", "rx 7800 xt", "rx 7700 xt",
    "rx 7600 xt", "rx 6950 xt", "rx 6900 xt", "rx 6800 xt", "rx 6800",
  ],
  near: [
    "rtx 5050", "rtx 4060", "rtx 3060 ti", "rtx 3060 12gb", "rtx 2080 ti",
    "rtx 2080 super", "rtx 2070 super", "rtx 2070", "rx 7600", "rx 6750 xt",
    "rx 6700 xt", "rx 6700", "rx 6650 xt", "rx 6600 xt", "arc b580", "arc b570",
    "arc a770 16gb", "arc a750",
  ],
  below: ["gtx 1650 laptop", "gtx 1650 super", "gtx 1660", "rx 5500 xt", "rtx 3060 8gb", "rtx 3050 8gb", "rtx 3050 6gb", "rtx 2060 super", "rtx 2060", "rx 6600", "rx 6500 xt"],
};

// Approximate desktop gaming bands around the community's Series X examples.
// A CPU or GPU band describes benchmark proximity, not a Leonida requirement.
const seriesXCpuBands = {
  above: [...cpuBands.above, "12400", "13400", "5700x", "5800x", "5900x", "5950x", "5600x"],
  near: ["3700x", "5600", "11400", "11700k", "11600k", "10700k", "10600k",
    "9900k", "9700k", "13100", "12100", "5600g", "5500"],
  below: ["11320h", "10400", "10100", "3600", "3600x", "2600x", "2600", "8700k"],
};
const seriesXGpuBands = {
  above: gpuBands.above.filter(model => ![
    "rtx 5060 ti 16gb", "rtx 5060 ti 8gb", "rtx 5060", "rtx 4060 ti 16gb",
    "rtx 4060 ti 8gb", "rtx 3070 ti", "rtx 3070", "rx 9060 xt 16gb",
    "rx 9060 xt 8gb", "rx 7600 xt", "rx 6800",
  ].includes(model)),
  near: [
    "rtx 5060 ti 16gb", "rtx 5060 ti 8gb", "rtx 5060", "rtx 4060 ti 16gb",
    "rtx 4060 ti 8gb", "rtx 3070 ti", "rtx 3070", "rtx 3060 ti", "rtx 2080 ti",
    "rx 9060 xt 16gb", "rx 9060 xt 8gb", "rx 7600 xt", "rx 6800", "rx 6750 xt", "rx 6700 xt",
  ],
  below: [...gpuBands.below, "rtx 5050", "rtx 3060 12gb", "rtx 2070 super", "rtx 2070",
    "rx 7600", "rx 6650 xt", "rx 6600 xt", "arc b570", "arc a750"],
};

// Additional ranges follow the community examples, with broad desktop bands.
const ps5GpuBands = {
  above: seriesXGpuBands.above,
  near: [...seriesXGpuBands.near, "rtx 2070 super", "rtx 2080 super", "rtx 3060 12gb", "rx 6700"],
  below: seriesXGpuBands.below.filter(model => !["rtx 2070 super", "rtx 3060 12gb"].includes(model)),
};
const proCpuBands = {
  above: seriesXCpuBands.above.filter(model => !["5700x", "5800x"].includes(model)),
  near: [...seriesXCpuBands.near, "5700x", "5800x"],
  below: seriesXCpuBands.below,
};
const proGpuNear = ["rtx 5060 ti 16gb", "rx 9060 xt 16gb", "rtx 3070 ti", "rtx 2080 ti", "rtx 4060 ti 16gb", "rx 6800", "rx 7700 xt"];
const proGpuAbove = seriesXGpuBands.above.filter(model => !proGpuNear.includes(model));
const proGpuBands = {
  above: proGpuAbove,
  near: proGpuNear,
  uncertain: ["rtx 5060 ti 8gb", "rx 9060 xt 8gb", "rtx 4060 ti 8gb"],
  below: [...new Set([...gpuBands.above, ...gpuBands.near, ...gpuBands.below])].filter(model =>
    ![...proGpuAbove, ...proGpuNear, "rtx 5060 ti 8gb", "rx 9060 xt 8gb", "rtx 4060 ti 8gb"].includes(model)),
};
const seriesSCpuBands = {
  above: [...new Set([...seriesXCpuBands.above, ...seriesXCpuBands.near])],
  near: ["3600", "3600x", "10400", "8700k", "11320h"],
  below: ["10100", "2600x", "2600", "1600"],
};
const seriesSGpuBands = {
  above: [...gpuBands.above, ...gpuBands.near, ...gpuBands.below].filter(model => !["gtx 1650 laptop", "gtx 1650 super", "gtx 1660", "rx 5500 xt"].includes(model)),
  near: ["gtx 1650 super", "gtx 1660", "rx 5500 xt"],
  below: ["gtx 1650 laptop", "gtx 1650", "gtx 1050 ti", "rx 560"],
};
const consoleRanges = {
  "series-x": { name: "Series X", CPU: seriesXCpuBands, GPU: seriesXGpuBands },
  ps5: { name: "PS5", CPU: seriesXCpuBands, GPU: ps5GpuBands },
  "ps5-pro": { name: "PS5 Pro", CPU: proCpuBands, GPU: proGpuBands },
  "series-s": { name: "Series S", CPU: seriesSCpuBands, GPU: seriesSGpuBands },
};

// Mobile parts are compared with the closest desktop model from Notebookcheck's
// laptop benchmark lists. Laptop performance depends on power limits and
// cooling, so these are approximate bands rather than direct equivalence.
const cpuEquivalents = new Map([
  ["290hx", "14900k"],
  ["285hx", "14900k"],
  ["275hx", "14700k"],
  ["265hx", "14700k"],
  ["255hx", "14700k"],
  ["251hx", "14600k"],
  ["245hx", "14600k"],
  ["285h", "12600k"],
  ["265h", "12600k"],
  ["255h", "12600k"],
  ["225h", "13400"],
  ["14900hx", "14700k"],
  ["13980hx", "14700k"],
  ["13900hx", "14600k"],
  ["14700hx", "14600k"],
  ["14650hx", "14600k"],
  ["13850hx", "12600k"],
  ["13700hx", "12600k"],
  ["13650hx", "12600k"],
  ["13500hx", "13400"],
  ["13450hx", "13400"],
  ["14450hx", "13400"],
  ["12950hx", "12600k"],
  ["12900hx", "12600k"],
  ["12850hx", "13400"],
  ["12800hx", "12600k"],
  ["12700h", "13400"],
  ["12800h", "13400"],
  ["12650h", "13400"],
  ["12500h", "13400"],
  ["12450h", "11400"],
  ["1240p", "11400"],
  ["1260p", "11400"],
  ["1270p", "11400"],
  ["1280p", "13400"],
  ["13900h", "12600k"],
  ["13905h", "12600k"],
  ["13900hk", "12600k"],
  ["13800h", "12600k"],
  ["13705h", "13400"],
  ["13700h", "13400"],
  ["13620h", "13400"],
  ["12900h", "13400"],
  ["12900hk", "13400"],
  ["11800h", "11700k"],
  ["11850h", "11700k"],
  ["11900h", "11700k"],
  ["11950h", "11700k"],
  ["11980hk", "11700k"],
  ["11400h", "11400"],
  ["11300h", "11320h"],
  ["11370h", "11320h"],
  ["11375h", "11320h"],
  ["11390h", "11320h"],
  ["10875h", "10400"],
  ["10750h", "10400"],
  ["10300h", "10100"],
  ["10710u", "10100"],
  ["10510u", "10100"],
  ["1235u", "10100"],
  ["1255u", "10100"],
  ["1265u", "10100"],
  ["9955hx3d", "14900k"],
  ["9955hx", "14900k"],
  ["8945hx", "14700k"],
  ["8940hx", "14700k"],
  ["7945hx3d", "14700k"],
  ["7945hx", "14700k"],
  ["7940hx", "14600k"],
  ["8840hx", "14600k"],
  ["7845hx", "14600k"],
  ["7745hx", "7700"],
  ["7645hx", "7600"],
  ["ai max 395", "14900k"],
  ["ai max 390", "14900k"],
  ["ai 370", "7700"],
  ["ai 375", "7700"],
  ["ai 365", "7600"],
  ["ai 350", "5800x"],
  ["ai 340", "5600"],
  ["8945hs", "5800x"],
  ["8845hs", "5800x"],
  ["8745hs", "5800x"],
  ["8840hs", "5700x"],
  ["8645hs", "5600"],
  ["8640hs", "5600"],
  ["7840hs", "5800x"],
  ["7640hs", "5600"],
  ["7735hs", "5800x"],
  ["6800h", "5800x"],
  ["6800hs", "5800x"],
  ["6900hx", "5800x"],
  ["5900hx", "5800x"],
  ["5900hs", "5800x"],
  ["5980hs", "5800x"],
  ["5800h", "5800x"],
  ["5800hs", "5800x"],
  ["6600h", "3600"],
  ["6600hs", "3600"],
  ["5600h", "3600"],
  ["5600hs", "3600"],
  ["4800h", "3700x"],
  ["4800hs", "3700x"],
  ["4900h", "3700x"],
  ["4900hs", "3700x"],
  ["4600h", "3600"],
  ["5800u", "3600"],
  ["5700u", "3600"],
  ["5600u", "2600x"],
  ["6800u", "3600"],
  ["6600u", "3600"],
  ["7840u", "5800x"],
  ["8840u", "5800x"],
]);

const laptopGpuEquivalents = new Map([
  ["rtx 5090 laptop", "rtx 4070 ti super"],
  ["rtx 5080 laptop", "rtx 4070 super"],
  ["rtx 5070 ti laptop", "rtx 4070"],
  ["rtx 5070 laptop", "rtx 4060 ti 8gb"],
  ["rtx 5060 laptop", "rtx 3060 ti"],
  ["rtx 5050 laptop", "rtx 3060 12gb"],
  ["rtx 4090 laptop", "rtx 4070 super"],
  ["rtx 4080 laptop", "rtx 4070"],
  ["rtx 4070 laptop", "rtx 3060 ti"],
  ["rtx 4060 laptop", "rtx 2070 super"],
  ["rtx 4050 laptop", "rtx 2060 super"],
  ["rtx 3080 ti laptop", "rtx 3060 ti"],
  ["rtx 3080 laptop", "rtx 2070 super"],
  ["rtx 3070 ti laptop", "rtx 2070 super"],
  ["rtx 3070 laptop", "rtx 2070"],
  ["rtx 3060 6gb laptop", "rtx 2060 super"],
  ["rtx 3060 laptop", "rtx 2060 super"],
  ["rtx 3050 ti laptop", "gtx 1660"],
  ["rtx 3050 6gb laptop", "gtx 1650 super"],
  ["rtx 3050 4gb laptop", "gtx 1650 super"],
  ["rtx 3050 laptop", "gtx 1650 super"],
  ["rtx 2050 laptop", "gtx 1650 laptop"],
  ["rtx 2080 super laptop", "rtx 2070 super"],
  ["rtx 2080 laptop", "rtx 2070"],
  ["rtx 2070 super laptop", "rtx 2060 super"],
  ["rtx 2070 laptop", "rtx 2060"],
  ["rtx 2060 laptop", "gtx 1660"],
  ["gtx 1660 ti laptop", "gtx 1660"],
  ["gtx 1650 ti laptop", "gtx 1650 laptop"],
  ["gtx 1650 laptop", "gtx 1650 laptop"],
  ["gtx 1070 laptop", "gtx 1660"],
  ["gtx 1060 laptop", "gtx 1650 laptop"],
  ["rtx 2080 super max-q", "rtx 2070 super"],
  ["rtx 2080 max-q", "rtx 2060 super"],
  ["rtx 2070 super max-q", "rtx 2060 super"],
  ["rtx 2070 max-q", "rtx 2060"],
  ["rtx 2060 max-q", "gtx 1660"],
  ["gtx 1660 ti max-q", "gtx 1650 super"],
  ["gtx 1650 ti max-q", "gtx 1650 laptop"],
  ["gtx 1650 max-q", "gtx 1650 laptop"],
  ["rx 7900m", "rx 7800 xt"],
  ["rx 6850m xt", "rx 6700 xt"],
  ["rx 6800m", "rx 6700 xt"],
  ["rx 6700m", "rx 6600 xt"],
  ["rx 7600m xt", "rx 6600 xt"],
  ["rx 7600m", "rx 6600 xt"],
  ["rx 7700s", "rx 6600 xt"],
  ["rx 7600s", "rx 6600 xt"],
  ["rx 6800s", "rx 6600 xt"],
  ["rx 6700s", "rx 6600"],
  ["rx 6600m", "rx 6600"],
  ["rx 6600s", "rx 6600"],
  ["rx 5600m", "gtx 1660"],
  ["rx 5500m", "rx 5500 xt"],
]);

const integratedGpuEquivalents = new Map([
  ["radeon 8060s", "rtx 3060 ti"],
  ["radeon 8050s", "rx 6600 xt"],
  ["radeon 8040s", "gtx 1650 super"],
  ["radeon 890m", "gtx 1650 laptop"],
  ["radeon 880m", "gtx 1650 laptop"],
  ["radeon 780m", "gtx 1650 laptop"],
  ["radeon 760m", "gtx 1650 laptop"],
  ["radeon 680m", "gtx 1650 laptop"],
  ["radeon 660m", "gtx 1650 laptop"],
  ["radeon 610m", "gtx 1650 laptop"],
  ["vega 8", "gtx 1650 laptop"],
  ["arc graphics 140v", "gtx 1650 super"],
  ["arc graphics 130v", "gtx 1650 laptop"],
  ["arc graphics 140t", "gtx 1650 laptop"],
  ["iris xe", "gtx 1650 laptop"],
  ["uhd graphics", "gtx 1650 laptop"],
  ["hd graphics", "gtx 1650 laptop"],
  ["intel graphics", "gtx 1650 laptop"],
  ["radeon graphics", "gtx 1650 laptop"],
]);

const gpuEquivalents = new Map([...laptopGpuEquivalents, ...integratedGpuEquivalents]);

const armCpu = /\b(?:snapdragon|qualcomm|mediatek|dimensity|exynos|oryon|arm64|aarch64)\b|\bapple\s+m\d+\b|^m[1-9]\d*(?:\s+(?:pro|max|ultra))?$/i;
const armGpu = /\b(?:adreno|mali|powervr)\b|\bapple\s+m\d+\b/i;
const memoryVariants = new Set(["rtx 5060 ti", "rtx 4060 ti", "rtx 3060", "rtx 3050", "rx 9060 xt", "arc a770"]);
const laptopGraphics = /\b(?:laptop|mobile|max[ -]?q)\b/i;

// Published Leonida shader runs in issue #166. Keep desktop and laptop models
// distinct, and keep capacity when the report identifies a specific variant.
const shaderTestPlatforms = new Map([
  ["rtx 5090", "Windows 11 and Linux"],
  ["rtx 5080", "Windows 11"],
  ["rtx 5080 laptop", "Windows 11"],
  ["rtx 5070 ti", "Windows 11"],
  ["rtx 5070", "Windows 11"],
  ["rtx 4090", "Windows 11"],
  ["rtx 4080 super", "Windows 11 and Linux"],
  ["rtx 4080", "Windows 11"],
  ["rtx 4070 ti super", "Windows 11"],
  ["rtx 4070 super", "Windows 11"],
  ["rtx 4060 laptop", "Windows 11"],
  ["rtx 3090", "Windows 11"],
  ["rtx 3080 ti", "Windows"],
  ["rtx 3080", "Windows 11 and Linux"],
  ["rtx 3070", "Windows 11 and Linux"],
  ["rtx 3060 12gb", "Windows 11"],
  ["rtx 3050 laptop", "Windows 11"],
  ["rtx 2080 ti", "Windows 11"],
  ["rtx 2070 super", "Windows 11"],
  ["rtx 2070", "Windows 10"],
  ["rtx 2060 super", "Linux"],
  ["gtx 1060 6gb", "Windows 10 and 11"],
  ["rx 9070 xt", "Windows 11 and Linux"],
  ["rx 9070", "Windows 11"],
  ["rx 7900 xtx", "Windows 11 and Linux"],
  ["rx 7800 xt", "Windows"],
  ["rx 7600", "Windows 11 and Linux"],
  ["rx 6750 xt", "Linux"],
  ["rx 6700 xt", "Linux"],
  ["rx 6700", "Windows 11"],
  ["rx 5700 xt", "Linux"],
  ["arc b580", "Windows"],
]);

export function graphicsMemory(graphics) {
  return graphics.match(/\b(\d+)\s*gb\b/i)?.[1];
}

function cpuKey(processor) {
  if (/\bryzen\s+ai\b/i.test(processor)) {
    const number = processor.match(/\b(\d{3})\b/)?.[1];
    if (!number) return;
    return `ai ${/\bmax\b/i.test(processor) ? "max " : ""}${number}`;
  }
  if (/\b(?:ryzen|core\s+ultra)\b/i.test(processor)) {
    const key = processor.match(/\b\d{3,5}[a-z\d]*\b/i)?.[0].toLowerCase();
    return /\bcore\s+ultra\b/i.test(processor) ? key?.replace(/k[fs]$/, "k") : key;
  }
  const key = processor.match(/\bi[3579][\s-]*(\d{4,5}[a-z]*)\b/i)?.[1].toLowerCase().replace(/k[fs]$/, "k").replace(/f$/, "");
  // These desktop suffix variants share a broad comparison band. Preserve
  // laptop suffixes and the materially different i5-12600 versus 12600K.
  const aliases = { "14900": "14900k", "14700": "14700k", "14600": "14600k",
    "13900": "13900k", "13700": "13700k", "13600": "13600k",
    "12900": "12900k", "12700": "12700k", "11700": "11700k",
    "11600": "11600k", "10700": "10700k", "10600": "10600k",
    "9900": "9900k", "9700": "9700k", "8700": "8700k" };
  return aliases[key] ?? key;
}

function gpuModel(graphics) {
  const model = graphics.match(/\b(rtx|gtx|rx|arc)\s*([ab]\d{3}|\d{4})(?:\s+(ti super|xtx|super|gre|ti|xt))?\b/i);
  return model?.slice(1).filter(Boolean).join(" ").toLowerCase();
}

function integratedGpuKey(graphics) {
  const lower = graphics.toLowerCase();
  return [...integratedGpuEquivalents.keys()].find(name => lower.includes(name));
}

function gpuKey(graphics) {
  const integrated = integratedGpuKey(graphics);
  if (integrated) return integrated;
  const mobileRadeon = graphics.match(/\brx\s*(\d{4})([ms])\b(?:\s*(xt))?/i);
  if (mobileRadeon) {
    const suffix = mobileRadeon[3] ? ` ${mobileRadeon[3].toLowerCase()}` : "";
    return `rx ${mobileRadeon[1]}${mobileRadeon[2].toLowerCase()}${suffix}`;
  }
  const model = gpuModel(graphics);
  if (!model) return;
  const memory = graphicsMemory(graphics);
  const key = memoryVariants.has(model) && memory ? `${model} ${memory}gb` : model;
  if (/max[ -]?q/i.test(graphics)) return `${key} max-q`;
  return laptopGraphics.test(graphics) ? `${key} laptop` : key;
}

export function shaderTestPlatform(graphics) {
  const model = gpuModel(graphics);
  if (!model) return;
  if (laptopGraphics.test(graphics)) return shaderTestPlatforms.get(`${model} laptop`);
  const memory = graphicsMemory(graphics);
  const variant = memory ? shaderTestPlatforms.get(`${model} ${memory}gb`) : undefined;
  return variant ?? shaderTestPlatforms.get(model);
}

function bandFor(key, bands, equivalents) {
  const model = equivalents.get(key) ?? key;
  return Object.keys(bands).find(band => bands[band].includes(model)) ?? "unknown";
}

export function assessHardware(cpu, gpu, ram, reference = "low", ramType = "ddr4") {
  const processor = cpu.trim();
  const graphics = gpu.trim();
  const memory = Number(ram);
  const consoleRange = consoleRanges[reference];
  const consoleComparison = Boolean(consoleRange);
  const ddr5 = ramType === "ddr5";
  const memoryTarget = ddr5 ? 16 : consoleComparison ? 32 : 16;
  let ramStatus = !Number.isFinite(memory) || memory < 1 ? "empty" : "near";
  if (ramStatus !== "empty") {
    if (memory < memoryTarget) ramStatus = consoleComparison || ddr5 ? "uncertain" : "below";
    if (memory > memoryTarget) ramStatus = "above";
  }
  const statuses = {
    CPU: !processor ? "empty" : armCpu.test(processor) ? "outside" : bandFor(cpuKey(processor), consoleRange?.CPU ?? cpuBands, cpuEquivalents),
    GPU: !graphics ? "empty" : armGpu.test(graphics) ? "outside" : bandFor(gpuKey(graphics), consoleRange?.GPU ?? gpuBands, gpuEquivalents),
    RAM: ramStatus,
  };

  const parts = Object.values(statuses);
  if (parts.includes("outside")) return { verdict: "Your PC is outside Leonida’s x64 target", statuses };
  if (parts.includes("empty")) return { verdict: "Enter your PC specs", statuses };
  if (consoleComparison) {
    const name = consoleRange.name;
    if (parts.includes("below")) return { verdict: `Below the ${name} hardware range`, statuses };
    if (parts.includes("unknown")) return { verdict: `Partial ${name} comparison`, statuses };
    if (parts.includes("uncertain")) return { verdict: `Uncertain ${name} comparison`, statuses };
    if (statuses.CPU === "above" && statuses.GPU === "above") {
      return { verdict: `Above the ${name} hardware range`, statuses };
    }
    return { verdict: `Around the ${name} hardware range`, statuses };
  }
  if (parts.includes("below")) return { verdict: "Your PC may struggle to run Leonida", statuses };
  if (parts.includes("unknown")) return { verdict: "Your PC’s outlook is unclear", statuses };
  if (parts.includes("uncertain")) return { verdict: "Your PC’s outlook is unclear", statuses };
  return { verdict: "Your PC could run Leonida", statuses };
}
