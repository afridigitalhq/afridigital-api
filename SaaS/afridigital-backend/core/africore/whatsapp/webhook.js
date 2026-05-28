const gateway = require("../gateway/whatsappGateway");

module.exports = {
  async handle(req, res) {
    try {
      const result = await gateway.validate(req);

      if (!result.ok) return res.sendStatus(200);

      return res.sendStatus(200);
    } catch (e) {
      console.log("Webhook error:", e.message);
      return res.sendStatus(200);
    }
  }
};
