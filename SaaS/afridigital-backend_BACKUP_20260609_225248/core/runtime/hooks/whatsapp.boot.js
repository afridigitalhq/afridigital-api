/**
 * 📡 WHATSAPP BOOT SAFETY HOOK
 * Runs before webhook activation
 */

const { checkWhatsAppEnv } =
  require("../env/whatsapp.env.check");

function whatsappBootGuard() {
  const ok = checkWhatsAppEnv();

  if (!ok) {
    console.log("🛑 WHATSAPP SYSTEM BLOCKED (INVALID ENV)");
    return false;
  }

  console.log("🚀 WHATSAPP SYSTEM READY FOR META CLOUD API");
  return true;
}

module.exports = { whatsappBootGuard };
