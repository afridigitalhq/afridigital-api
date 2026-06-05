const webhook = require("./webhook");

function mountWhatsApp(app) {
  app.use("/webhook/whatsapp", webhook);
  console.log("📡 WhatsApp module mounted");
}

module.exports = { mountWhatsApp };
