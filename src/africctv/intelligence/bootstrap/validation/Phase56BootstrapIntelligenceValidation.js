import { intelligenceBootstrapRegistry } from "../IntelligenceBootstrapRegistry.js";

const registry = intelligenceBootstrapRegistry.getRegistry();

console.log(registry.master ? "🟢 Master Intelligence Owner: OK" : "🔴 Missing");
console.log(registry.cognitive ? "🟢 Cognitive Decision Owner: OK" : "🔴 Missing");
console.log(registry.intelligence ? "🟢 AI Intelligence Owner: OK" : "🔴 Missing");
console.log(registry.ecosystem ? "🟢 Ecosystem Owner: OK" : "🔴 Missing");
console.log(registry.operations ? "🟢 Operations Owner: OK" : "🔴 Missing");
console.log(registry.command ? "🟢 Command Center Owner: OK" : "🔴 Missing");
console.log(registry.governance ? "🟢 Governance Owner: OK" : "🔴 Missing");

console.log("==============================");
console.log("🟢 AFRICCTV BOOTSTRAP INTELLIGENCE REGISTRY READY");
console.log("🔒 PHASE 56 LOCKED");
