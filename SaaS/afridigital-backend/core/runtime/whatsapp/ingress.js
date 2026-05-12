const { assertApiVersion } = require("../runtime/safety/api.guard");
const { handleMessage } = require('./engine');
const { sendWhatsAppMessage } = require('./delivery');

async function handleIngress(payload) {
  const msg = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return;

  const from = msg.from;
  const message = msg.text?.body || '';

  console.log('📩 V7 INGRESS:', from, message);

  try {
    const { reply } = await handleMessage({ from, message });

    // NEVER block webhook on delivery
    sendWhatsAppMessage(from, reply).catch(err =>
      console.log('⚠️ DELIVERY ERROR:', err.message)
    );

  } catch (e) {
    console.log('🔥 BRAIN ERROR:', e.message);
  }
}

module.exports = { handleIngress };
