/**
 * 📡 WS WHATSAPP SEND BRIDGE
 */

const { sendWhatsAppMessage } = require("../../../whatsapp/core/send.message");

function attachSendRoute(app) {
  app.post("/whatsapp/send", async (req, res) => {
    try {
      const { to, message } = req.body;

      const result = await sendWhatsAppMessage({ to, message });

      return res.json(result);
    } catch (e) {
      console.error("WhatsApp send error:", e.message);
      return res.sendStatus(500);
    }
  });
}

module.exports = {
  attachSendRoute
};
