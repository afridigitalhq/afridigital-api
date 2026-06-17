const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

/**
 * 🧠 UNIVERSAL ENV LOADER
 * Works for:
 * - server.js
 * - node -e
 * - render-entry.js
 */

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    dotenv.config(); // fallback
  }

  const required = ["META_TOKEN", "META_PHONE_ID"];

  const missing = required.filter(k => !process.env[k]);

  process.env.SAFE_MODE = missing.length ? "true" : "false";

  if (missing.length) {
    console.warn("⚠️ SAFE MODE ACTIVE - missing:", missing.join(", "));
  } else {
    console.log("🟢 ENV FULLY LOADED - PRODUCTION MODE");
  }
}

module.exports = { loadEnv };
