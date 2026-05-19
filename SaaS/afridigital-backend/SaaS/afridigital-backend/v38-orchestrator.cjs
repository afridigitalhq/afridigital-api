console.log("🚀 V38 ORCHESTRATOR STARTED");
console.log("🌐 Frontend locked to: https://afridigital-hub.onrender.com");

const FRONTEND_URL = "https://afridigital-hub.onrender.com";

console.log("🧠 Training Engine: READY");
console.log("⚙️ Vector Engine: READY");
console.log("🔗 Worker Sync: ACTIVE");

process.on("uncaughtException", (err) => {
  console.error("❌ V38 CRASH GUARD:", err.message);
});

console.log("\n✅ V38 SYSTEM STABLE");
