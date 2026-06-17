const { whatsappIntelligence } = require("../afriai/whatsappBrain");

/**
 * CLEAN MIDDLEWARE LAYER
 * No kernel edits required
 */
async function afriaiMiddleware(event, sendWhatsAppMessage, next) {
  try {
    // AI enhancement layer
    await whatsappIntelligence(event, sendWhatsAppMessage);
  } catch (e) {
    console.log("⚠️ AfriAI fallback:", e.message);
  }

  // continue pipeline
  return next();
}

module.exports = { afriaiMiddleware };
