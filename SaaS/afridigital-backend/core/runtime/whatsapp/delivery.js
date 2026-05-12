const { assertApiVersion } = require("../runtime/safety/api.guard");
const { pushQueue } = require('./store');

const sent = new Set();

async function sendWhatsAppMessage(from, reply) {
  const key = from + ':' + reply;

  if (sent.has(key)) return;
  sent.add(key);

  console.log('📤 V7.1 SENDING:', from, reply);

  try {
    // TODO: real WhatsApp API call here
    // await axios.post(...)

  } catch (e) {
    console.log('⚠️ SEND FAILED → QUEUED:', e.message);

    pushQueue({
      from,
      reply,
      attempts: 0
    });
  }

  setTimeout(() => sent.delete(key), 5000);
}

module.exports = { sendWhatsAppMessage };
