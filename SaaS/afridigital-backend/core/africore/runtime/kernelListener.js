const bus = require('../../events/apiEventBus');
const kernel = require('./kernel');

bus.on('api.ai', async (payload) => {
  try {
    await kernel.run({
      ...payload,
      traceId: Date.now().toString()
    });
  } catch (e) {
    console.log("⚠️ Kernel event error:", e.message);
  }
});

console.log("🧠 Kernel Listener ACTIVE");
