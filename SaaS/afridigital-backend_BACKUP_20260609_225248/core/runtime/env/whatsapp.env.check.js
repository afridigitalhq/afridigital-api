/**
 * 🔐 WHATSAPP PRODUCTION ENV CHECK
 * Ensures Render environment is valid for Meta Cloud API
 */

function checkWhatsAppEnv() {
  const required = [
    "META_TOKEN",
    "META_PHONE_ID",
    "WHATSAPP_VERIFY_TOKEN"
  ];

  const missing = required.filter(k => !process.env[k]);

  if (missing.length > 0) {
    console.error("🔴 WHATSAPP ENV MISSING:", missing);
    return false;
  }

  console.log("🟢 WHATSAPP ENV OK");
  return true;
}

module.exports = { checkWhatsAppEnv };
