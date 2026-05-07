console.log("\n🚀 V15 AUTONOMOUS ECONOMIC AI MESH BOOT\n");

const bus = require("./bus.cjs");
const { startLearningLoop } = require("../learning/loop.cjs");
const { handleMessage } = require("../sync/gateway.cjs");

startLearningLoop();

console.log("🌐 FRONTEND:", bus.services.frontend);
console.log("🧠 AI MODE:", bus.ai.mode);

console.log("\n✅ V15 SYSTEM ONLINE (ECONOMIC MESH ACTIVE)\n");

module.exports = { handleMessage };
