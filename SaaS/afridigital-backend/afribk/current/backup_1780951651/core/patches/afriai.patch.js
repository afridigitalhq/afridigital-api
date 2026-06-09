const { whatsappIntelligence } = require("../afriai/whatsappBrain");

/**
 * SAFE WRAPPER:
 * attaches AI layer without modifying kernel logic flow
 */
async function afriaiHook(event, sendWhatsAppMessage, next){

  // AI FIRST (non-blocking)
  try {
    await whatsappIntelligence(event, sendWhatsAppMessage);
  } catch (e) {
    console.log("⚠️ AfriAI fallback:", e.message);
  }

  // continue kernel execution
  return next();
}

module.exports = { afriaiHook };
