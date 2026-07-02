/**
 * 📱 WhatsApp AfriAI Gateway
 * Server-side AI bot connected to AfriDigital Economy Brain
 */

const eventbus = require("../../eventbus");
const { processAI } = require("../../ai/brain");
const { runPipeline } = require("../../ai/execution-pipeline");

/**
 * 📡 Handle incoming WhatsApp message
 */
function handleWhatsAppMessage(message) {

  const event = {
    source: "whatsapp",
    user: message.from,
    text: message.text,
    type: "whatsapp_message",
    timestamp: Date.now()
  };

  // STEP 1: Send to AI Brain
  const aiOutput = processAI(event);

  // STEP 2: Run execution pipeline (safe mode)
  const pipeline = runPipeline(event);

  // STEP 3: Emit into system event bus
  eventbus.emit("MARKET_EVENT", event);

  return {
    reply: generateReply(aiOutput, pipeline)
  };
}

/**
 * 🧠 AI response generator
 */
function generateReply(aiOutput, pipeline) {

  const topInsight =
    pipeline?.readyForApproval?.[0]?.insight ||
    "No immediate action required.";

  return `
🧠 AfriAI Response:

📊 Insight:
${topInsight}

⚙️ Status:
Your request has been analyzed by the marketplace AI system.

👑 Next Step:
If approval is required, admin will review it shortly.
  `;
}

/**
 * 🔌 Webhook entry point (for WhatsApp provider like Twilio / Meta Cloud API)
 */
function whatsappWebhook(req, res) {

  const message = req.body;

  const response = handleWhatsAppMessage(message);

  res.json({
    success: true,
    message: response.reply
  });
}

module.exports = {
  handleWhatsAppMessage,
  whatsappWebhook
};
