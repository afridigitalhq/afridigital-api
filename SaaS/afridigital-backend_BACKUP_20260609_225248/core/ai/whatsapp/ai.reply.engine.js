/**
 * ⚫ AFRIAI AUTO-REPLY ENGINE
 */

const { sendWhatsAppMessage } = require("../../../whatsapp/core/send.message");
const { ingestWhatsApp } = require("../../integrations/chat/chat.ingest");

async function generateAIReply(text) {
  // placeholder AI logic (replace with OpenAI later)
  return "🧠 AfriAI: " + text;
}

async function handleAIFlow(event) {
  const incoming = ingestWhatsApp(event);

  const reply = await generateAIReply(incoming.text);

  await sendWhatsAppMessage({
    to: incoming.from,
    message: reply
  });

  return {
    incoming,
    reply
  };
}

module.exports = {
  handleAIFlow
};
