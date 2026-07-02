const { AfriAI } = require("../unified.brain");

async function handleWhatsAppMessage(msg, userId) {
  return AfriAI(msg, {
    channel: "whatsapp",
    userId
  });
}

module.exports = { handleWhatsAppMessage };
