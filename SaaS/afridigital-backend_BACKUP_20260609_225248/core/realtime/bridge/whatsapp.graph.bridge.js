const { bus } = require("../afriscan.graph.ws");

/**
 * WhatsApp is READ-ONLY EVENT SOURCE
 * NEVER executes system commands
 */
async function ingestWhatsAppEvent(event) {
  bus.emit("event", {
    type: "whatsapp",
    from: event.from,
    message: event.message
  });

  return { ok: true, mode: "observed" };
}

module.exports = { ingestWhatsAppEvent };
