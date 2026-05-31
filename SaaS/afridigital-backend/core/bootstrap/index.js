console.log("🧠 KAV2 BOOTSTRAP STARTING");

require("../workers/streamWorker");

const stream = require("../whatsapp/streamBridge");
const typing = require("../whatsapp/typingBridge");

if (stream?.startWhatsAppStreamBridge) stream.startWhatsAppStreamBridge();
if (typing?.startTypingBridge) typing.startTypingBridge();

console.log("🚀 SUBSYSTEMS READY");

module.exports = function bootstrap(app) {
  return app;
};
