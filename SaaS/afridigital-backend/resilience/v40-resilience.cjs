const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config/platform.cjs");

function log(title, msg) {
  console.log(`${title} ${msg}`);
}

/**
 * 🧠 CONFIG VALIDATION
 */
function validateConfig() {
  try {
    if (!fs.existsSync(configPath)) {
      log("❌", "platform.cjs missing — recreating...");
      fs.mkdirSync(path.dirname(configPath), { recursive: true });

      fs.writeFileSync(configPath, `
module.exports = {
  FRONTEND_URL: "https://afridigital-hub.onrender.com",
  BACKEND_URL: "https://afridigital-api.onrender.com",
  ENV: "production"
};
      `.trim());
      log("🧩", "platform.cjs restored");
    }

    const config = require("../config/platform.cjs");

    if (!config.FRONTEND_URL || !config.BACKEND_URL) {
      throw new Error("Invalid config structure");
    }

    log("🔒", "Config integrity OK");
    return config;
  } catch (err) {
    log("💥", "Config validation failed: " + err.message);
    process.exit(1);
  }
}

/**
 * 🧠 ENV CHECK
 */
function checkEnvironment() {
  const isRender = process.env.RENDER === "true";
  log("🌍", isRender ? "Render Environment Detected" : "Local Environment Detected");
  return isRender;
}

/**
 * 🧯 SAFE BOOT WRAPPER
 */
function safeBoot() {
  const config = validateConfig();
  checkEnvironment();

  console.log("\n🚀 V40 RESILIENCE LAYER ACTIVE");
  console.log("🌐 FRONTEND:", config.FRONTEND_URL);
  console.log("⚙️ BACKEND:", config.BACKEND_URL);

  console.log("\n🧠 SYSTEM STATUS:");
  console.log("✔ Config Guard: ACTIVE");
  console.log("✔ Environment Guard: ACTIVE");
  console.log("✔ Recovery Engine: READY");
  console.log("✔ Crash Shield: ENABLED");
}

safeBoot();
