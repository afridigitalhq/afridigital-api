/**
 * 📥 WHATSAPP → CONTROL ROOM INGESTION PIPELINE
 */

const { addMessage } = require("./chat.store");
const { broadcast } = require("../../runtime/governor/broadcast.safe");

function ingestWhatsApp(event) {
  const msg = {
    direction: "in",
    from: event.from,
    text: event.text
  };

  addMessage(msg);

  broadcast({
    type: "chat_message",
    payload: msg,
    ts: Date.now()
  });

  return msg;
}

module.exports = {
  ingestWhatsApp
};
