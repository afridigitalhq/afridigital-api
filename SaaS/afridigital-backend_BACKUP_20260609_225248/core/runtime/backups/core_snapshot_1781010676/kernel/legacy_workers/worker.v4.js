
const queue = require('./core/kernel/replay.queue.v3');
const { handleMessage } = require('./core/whatsapp/controller');
const { healFlow } = require('./core/flow/healer.v4');
const analytics = require('./core/kernel/replay.analytics.v4');

async function tick() {
  const batch = await queue.fetchBatch(10);

  for (const item of batch) {
    try {
      const res = await handleMessage(item.payload);
      const healed = healFlow(res);

      if (healed?.outcome?.type === 'success') {
        analytics.track('success');
        await queue.remove(item.id);
      } else {
        item.attempts++;
        analytics.track('retry');

        if (item.attempts > 3) {
          analytics.track('dead');
          await queue.remove(item.id);
        }
      }

    } catch (e) {
      analytics.track('failed');
      console.log('worker v4 error:', e.message);
    }
  }
}

setInterval(tick, 4000);

console.log('🚀 WORKER V4 ENTERPRISE MESH ACTIVE');

