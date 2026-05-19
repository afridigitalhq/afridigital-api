const { onWhatsAppMessage } = require("./whatsapp.bridge.runtime");
const { bus } = require('./bus/event.bus');
const { enqueue } = require('./afri.queue.engine.cjs');

console.log('🚀 AFRI PIPELINE v2 ACTIVE');

bus.subscribe('WHATSAPP_INBOUND', async (event) => {
  enqueue({ from: event.payload.from, message: event.payload.message });
});
