import { loadHardwareCatalog } from "./catalog.mjs?v=2";

// Render results immediately; enhance the pickers after their catalog arrives.
await import("./app.mjs?v=9");
await loadHardwareCatalog();
await import("./menus.mjs?v=10");
