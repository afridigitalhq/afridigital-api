/**
 * 🧠 WHATSAPP INBOUND HOOK (SAFE MODE)
 * attaches AI layer without touching system execution
 */

const { toEvent } = require("../governor/whatsapp.adapter");
const { processWhatsApp } = require("./whatsapp.processor");
const { broadcast } = require("../governor/broadcast.safe");

async function handleIncomingWhatsApp(message) {
  const event = toEvent(message);

  // stream inbound event
  broadcast(event);

  // generate safe AI response
  const result = await processWhatsApp(event);

  return result;
}

module.exports = {
  handleIncomingWhatsApp
};
