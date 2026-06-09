const Message = require("../db/mongo/Message");
const { isDBConnected } = require("../db/mongo/client");
const { saveMessage } = require("../db/fallbackStore");
const { logEvent } = require("../audit/ledger");

async function ingestWhatsAppMessage(body) {
  await logEvent({ type: "WHATSAPP_RECEIVED", payload: body });

  if (!isDBConnected()) {
    console.log("🟡 WhatsApp → Memory fallback");
    return saveMessage(body);
  }

  return await Message.create(body);
}

module.exports = { ingestWhatsAppMessage };
