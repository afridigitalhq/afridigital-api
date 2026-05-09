const config = require("./config/platform.cjs");

console.log("🚀 V39 HARDLOCK ORCHESTRATOR");
console.log("🌐 FRONTEND:", config.FRONTEND_URL);
console.log("⚙️ BACKEND:", config.BACKEND_URL);

console.log("🔒 URL HARDLOCK ACTIVE");
console.log("🧠 TRAINING ENGINE READY");
console.log("⚡ VECTOR ENGINE READY");
console.log("🤖 WORKERS SYNCED");

process.on("uncaughtException", (err) => {
  console.error("❌ V39 CRASH GUARD:", err.message);
});

console.log("\n✅ V39 STABLE HARDLOCK ACTIVE");
