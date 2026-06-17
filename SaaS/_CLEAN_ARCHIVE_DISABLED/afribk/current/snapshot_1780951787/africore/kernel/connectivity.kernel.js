const whatsapp = require("../bridge/whatsapp/wa.bridge");

module.exports = (app) => {
  app.use("/webhook", whatsapp);
  app.use("/whatsapp", whatsapp);
};
