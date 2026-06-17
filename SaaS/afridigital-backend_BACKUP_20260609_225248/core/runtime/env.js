require("dotenv").config();

function assertEnv() {
  const required = [
    "META_TOKEN",
    "META_PHONE_ID",
    "WHATSAPP_VERIFY_TOKEN"
  ];

  const missing = required.filter(k => !process.env[k]);

  if (missing.length > 0) {
    console.error("❌ ENV MISSING:", missing.join(", "));
    console.error("👉 SAFE MODE ENABLED");
    process.env.SAFE_MODE = "true";
  } else {
    console.log("🟢 ENV OK — production mode enabled");
    process.env.SAFE_MODE = "false";
  }
}

module.exports = { assertEnv };
