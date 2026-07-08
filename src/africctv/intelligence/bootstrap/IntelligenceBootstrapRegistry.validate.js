import { intelligenceBootstrapRegistry } from "./IntelligenceBootstrapRegistry.js";

console.log(
 intelligenceBootstrapRegistry.getRegistry()
 ? "🟢 Bootstrap Registry Loaded: OK"
 : "🔴 Bootstrap Registry Failed"
);
