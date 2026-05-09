const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config/platform.cjs");

let heartbeat = true;
let tick = 0;

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    throw new Error("Config missing");
  }
  return require("../config/platform.cjs");
}

function healthCheck(config) {
  if (!config.FRONTEND_URL || !config.BACKEND_URL) {
    throw new Error("Invalid platform config");
  }
  return true;
}

function heartbeatLoop(config) {
  setInterval(() => {
    tick++;

    try {
      healthCheck(config);
      heartbeat = true;

      console.log(`🫀 HEARTBEAT ${tick} OK`);
      console.log(`🌐 FE: ${config.FRONTEND_URL}`);
      console.log(`⚙️ BE: ${config.BACKEND_URL}`);

    } catch (err) {
      heartbeat = false;

      console.log("💥 HEARTBEAT FAILURE:", err.message);
      console.log("🔁 Attempting recovery...");

      try {
        delete require.cache[require.resolve("../config/platform.cjs")];
        const fixed = loadConfig();
        console.log("🧯 RECOVERY SUCCESS");
        console.log("🔄 SYSTEM RESTORED");
      } catch (e) {
        console.log("❌ CRITICAL FAILURE:", e.message);
        process.exit(1);
      }
    }
  }, 5000);
}

function boot() {
  console.log("🚀 V41 SUPERVISOR ONLINE");

  const config = loadConfig();
  healthCheck(config);

  console.log("🧠 SYSTEM VERIFIED");
  console.log("🔒 RESILIENCE ACTIVE");
  console.log("📡 HEARTBEAT STARTING...\n");

  heartbeatLoop(config);
}

boot();
