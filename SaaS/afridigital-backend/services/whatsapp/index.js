const bus = require('../../core/events/bus');
const { normalizeMessage } = require('../../core/schema/message');

function ingestMessage(payload) {
  const msg = normalizeMessage(payload);

  console.log("📩 WHATSAPP IN:", msg);

  bus.emit("message.incoming", msg);
}

module.exports = { ingestMessage };
