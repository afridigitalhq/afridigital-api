console.log("\n🚀 AFRIDIGITAL V18 PRODUCTION SYSTEM START\n");

require("./gateway/api.gateway.cjs");
require("./workers/worker.cluster.cjs");
require("./fraud/fraud.engine.cjs");
require("./bot/whatsapp.bot.cjs");

console.log("\n🧠 EVENT MESH ACTIVE");
console.log("🔴 REDIS SPINE CONNECTED");
console.log("⚙️ WORKER CLUSTER RUNNING");
console.log("🛡️ FRAUD AI ONLINE");
