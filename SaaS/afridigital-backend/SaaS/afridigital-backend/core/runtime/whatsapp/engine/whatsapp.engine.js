const { assertApiVersion } = require("../../safety/api.guard");
const SEND_LOCK = new Set();
const { sendWhatsAppMessage } = require('../sender/whatsapp.sender');
const { messageBrain } = require('../../brain/message.brain');

async function handleWhatsAppMessage({ from, message }) {
  try {

    console.log('📩 WHATSAPP MESSAGE:', from, message);

    const reply = await messageBrain({ from, message });

    console.log('📤 AI RESPONSE:', reply);

    // IMPORTANT: return reply to webhook sender layer
    return reply;

  } catch (err) {
    console.error('❌ WHATSAPP ENGINE ERROR:', err);
    return '⚠️ System temporarily unavailable';
  }
}

module.exports = { handleWhatsAppMessage };
