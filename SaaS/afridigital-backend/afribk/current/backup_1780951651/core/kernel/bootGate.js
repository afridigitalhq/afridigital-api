function bootGate(config) {
  const missing = [];

  const whatsapp = config.get("whatsapp") || {};

  if (!whatsapp.token) missing.push("META_ACCESS_TOKEN");
  if (!whatsapp.phoneId) missing.push("META_PHONE_NUMBER_ID");
  if (!whatsapp.verifyToken) missing.push("META_VERIFY_TOKEN");

  if (!process.env.JWT_SECRET) missing.push("JWT_SECRET");
  if (!process.env.AUTH_TOKEN) missing.push("AUTH_TOKEN");

  if (missing.length) {
    console.error("🚨 BOOT GATE BLOCKED");
    missing.forEach(m => console.error(" - " + m));
    throw new Error("BootGateFailure");
  }

  console.log("🧠 Boot Gate Passed");
}

module.exports = { bootGate };
