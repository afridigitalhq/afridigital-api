const { handleMessage } = require('./engine');
const { sendWhatsAppMessage } = require('./delivery');

async function handleIngress(payload) {

  const msg = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!msg) return;

  const from = msg.from;
  const message = msg.text?.body || '';

  const { reply } = await handleMessage({ from, message });

  await sendWhatsAppMessage(from, reply);
}

module.exports = { handleIngress };
