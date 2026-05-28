const gateway = require('../gateway/whatsappGateway');
const stream = require("../mesh/stream");

module.exports = {
  async handle(req, res) {
    try {
      const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (!msg) return res.sendStatus(200);

      await stream.publish({
        type: "whatsapp.message",
        id: msg.id,
        from: msg.from,
        text: msg.text?.body || ""
      });

      return res.sendStatus(200);
    } catch (e) {
      console.log("Webhook error:", e.message);
      return res.sendStatus(200);
    }
  }
};
