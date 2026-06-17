
const { fetchBatch, remove } = require('./core/kernel/replay.queue.v3');
const { handleMessage } = require('./core/whatsapp/controller');
const { pushDead } = require('./core/kernel/deadletter.v3');
const { acquireLock } = require('./core/kernel/replay.lock.v3');

async function tick() {
  const batch = await fetchBatch(10);

  for (const item of batch) {
    try {
      const locked = await acquireLock(item.id);
      if (!locked) continue;

      const res = await handleMessage(item.payload);

      if (res?.outcome?.type === 'success') {
        await remove(item.id);
      } else {
        item.attempts++;

        if (item.attempts > 3) {
          await pushDead(item);
          await remove(item.id);
        }
      }

    } catch (e) {
      console.log('worker error:', e.message);
    }
  }
}

setInterval(tick, 5000);

console.log('🚀 WORKER V3 ONLINE (SAAS SCALE HARDENED)');

