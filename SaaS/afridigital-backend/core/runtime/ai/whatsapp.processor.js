/**
 * 🧠 WHATSAPP SAFE PROCESSOR
 * routes inbound → AI → response event
 */

const { generateAIResponse, formatAIEvent } = require("./whatsapp.ai");
const { broadcast } = require("../governor/broadcast.safe");

async function processWhatsApp(event) {
  try {
    const reply = await generateAIResponse(event);

    const aiEvent = formatAIEvent(event.from, reply);

    // stream AI response to control tower
    broadcast(aiEvent);

    return {
      success: true,
      reply
    };
  } catch (e) {
    return {
      success: false,
      error: e.message
    };
  }
}

module.exports = {
  processWhatsApp
};
