const { enqueue } = require('../queue/engine');

async function handleIngress(payload) {
  const msg = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!msg) return;

  const from = msg.from;
  const message = msg.text?.body || '';

  console.log('📲 WHATSAPP INCOMING:', from, message);

  enqueue({
    from,
    message
  });
}

module.exports = {
  handleIngress
};
