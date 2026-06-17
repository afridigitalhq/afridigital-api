const eventBus = require("../../kernel/events/eventBus");

function initWhatsAppPipeline() {
  console.log("🟢 WhatsApp PIPELINE ACTIVE");

  eventBus.on("WHATSAPP_MESSAGE", async (event) => {
    console.log("📩 WhatsApp Event:", event.type);

    // future: store in DB
    // future: trigger AI processing
  });
}

module.exports = { initWhatsAppPipeline };
