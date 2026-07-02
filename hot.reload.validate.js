const loader = require("./core/afriai/plugins/loader/manifest.loader");
const registry = require("./core/afriai/plugins/manifest/manifest.registry");
const activator = require("./core/afriai/plugins/activator/manifest.activator");
const lifecycle = require("./core/afriai/plugins/lifecycle/plugin.lifecycle");

console.log("=== STEP 1: LOAD MANIFESTS ===");
const load = loader.load("./core/afriai/plugins/manifests");
console.log(load);

console.log("\n=== STEP 2: REGISTRY ===");
console.log(registry.list());

console.log("\n=== STEP 3: ACTIVATE ===");
const result = activator.activate("AfriSports");
console.log(result);

console.log("\n=== STEP 4: LIFECYCLE ===");
console.log(lifecycle.get("AfriSports"));
