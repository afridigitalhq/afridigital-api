/**
 * ADD THIS INTO server.js (minimal safe patch)
 */

const {
  verifyWebhook,
  parseIncoming,
  emitWhatsAppEvent
} = require("../runtime/whatsapp/webhook.engine");

const { handleWhatsApp } = require("../runtime/whatsapp/bridge");

// GET VERIFY
// app.get("/webhook", verifyWebhook);

// POST WEBHOOK
// app.post("/webhook", async (req, res) => {
//   const msg = parseIncoming(req);
//   if (!msg) return res.sendStatus(200);
//
//   emitWhatsAppEvent(msg);
//   await handleWhatsApp(msg);
//
//   return res.sendStatus(200);
// });
