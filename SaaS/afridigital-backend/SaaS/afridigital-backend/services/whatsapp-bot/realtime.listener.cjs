const { enqueue } = require('../../core/runtime/afri.queue.engine.cjs');

console.log('📡 WHATSAPP REALTIME LISTENER ACTIVE');

async function onIncomingMessage(msg = {}) {
  try {
    const from = msg.from || msg.sender || 'unknown';
    const body = msg.message || msg.body || msg.text || '';

    if (!body.trim()) return;

    console.log('📥 INCOMING:', from, body);

    enqueue({
      from,
      message: body
    });

  } catch (err) {
    console.log('❌ REALTIME LISTENER ERROR:', err.message);
  }
}

module.exports = {
  onIncomingMessage
};
