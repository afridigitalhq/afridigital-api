const { assertApiVersion } = require("../runtime/safety/api.guard");
const { dequeueMessage, hasMessages } = require("../queue/message.queue");
const { messageBrain } = require("../runtime/brain/message.brain");
const { sendWhatsAppMessage } = require("../runtime/whatsapp/delivery");

function startWorker() {
  console.log("🧠 V8.2 DISTRIBUTED WORKER ACTIVE");

  setInterval(async () => {
    if (!hasMessages()) return;

    const msg = dequeueMessage();
    if (!msg) return;

    try {
      const reply = await messageBrain(msg);
      await sendWhatsAppMessage(msg.from, reply);
    } catch (e) {
      console.error("V8.2 worker error:", e);
    }
  }, 500);
}

module.exports = { startWorker };
