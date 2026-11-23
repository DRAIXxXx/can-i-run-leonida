import { loadHardwareCatalog } from "./catalog.mjs?v=1";

// Render results immediately; enhance the pickers after their catalog arrives.
await import("./app.mjs?v=8");
await loadHardwareCatalog();
await import("./menus.mjs?v=9");
