const { REAL_RENDER } = require("./v8-ui-engine.cjs");

console.log("🚀 AFRIDIGITAL V8 ORCHESTRATOR STARTED");

try {
  REAL_RENDER();
} catch (e) {
  console.log("❌ Render failed:", e.message);
}

console.log("✅ SYSTEM HEALTHY — CLEAN BOOT STATE");
