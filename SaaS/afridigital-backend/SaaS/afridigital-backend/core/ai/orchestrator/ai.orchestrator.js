/**
 * 🧠 A3.18.12 AI ORCHESTRATOR CORE
 * REAL-TIME EVENT ROUTER (WhatsApp AI Brain)
 */

const { generateReply } = require("../realtime/reply.engine");
const { queueMessage } = require("../whatsapp/sender/whatsapp.sender");

function handleEvent(event) {

  if (!event || !event.type) return;

  switch (event.type) {

    /**
     * 📥 INCOMING USER MESSAGE
     */
    case "WHATSAPP_INBOUND":
      return generateReply(event);

    /**
     * 🤖 AI GENERATED REPLY
     */
    case "AI_REPLY":
      return queueMessage({
        to: event.payload.to || event.payload.userId,
        message: event.payload.reply
      });

    default:
      return null;
  }
}

module.exports = { handleEvent };
