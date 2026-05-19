const { handleWhatsAppMessage } = require('./whatsapp/engine/whatsapp.engine');

async function onWhatsAppMessage(msg) {
  try {
    console.log("📲 INCOMING:", msg);

    const reply = await handleWhatsAppMessage({
      from: msg.from,
      message: msg.message
    });

    console.log("📤 OUTGOING:", reply);
    return reply;

  } catch (e) {
    console.log("❌ BRIDGE ERROR:", e.message);
    return "System error";
  }
}

module.exports = { onWhatsAppMessage };
