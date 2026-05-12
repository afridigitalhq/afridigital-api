const { assertApiVersion } = require("../runtime/safety/api.guard");
const { popQueue } = require('../runtime/whatsapp/store');
const { sendWhatsAppMessage } = require('../runtime/whatsapp/delivery');

function startRetryWorker() {
  console.log('🔁 V7.1 RETRY WORKER STARTED');

  setInterval(async () => {
    const msg = popQueue();
    if (!msg) return;

    console.log('🔁 RETRYING:', msg.from);

    msg.attempts++;

    if (msg.attempts > 5) {
      console.log('💀 DEAD LETTER:', msg);
      return;
    }

    await sendWhatsAppMessage(msg.from, msg.reply);

  }, 5000);
}

module.exports = { startRetryWorker };
