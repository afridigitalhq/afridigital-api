const aiRouter = require("../../modules/ai-engine/router");
const a2Core = require("../../modules/a2-core");
const logMessage = require("../logging/logger");

async function whatsappPipeline(context) {
  try {
    const { message, user, channel } = context;

    // 1. AI RESPONSE
    const aiResponse = await aiRouter({
      message,
      user,
      channel
    });

    // 2. A2 CORE WRAPPER (logging + future hooks)
    const finalResponse = await a2Core({
      context,
      aiResponse
    });

    return finalResponse || "⚡ System processed your request.";

  } catch (err) {
    console.error("WhatsApp Pipeline Error:", err);
    return "⚡ Temporary system issue. Please try again.";
  }
}

module.exports = whatsappPipeline;
