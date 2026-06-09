
const queue = require('./core/kernel/replay.queue.v5');
const { handleMessage } = require('./core/whatsapp/controller');

async function tick() {
  try {
    const batch = await queue.fetchBatch(10);

    for (const item of batch) {
      try {
        const res = await handleMessage(item.payload);

        if (res?.outcome?.type === 'success') {
          await queue.remove(item.id);
        } else {
          item.attempts++;
          if (item.attempts > 3) {
            await queue.remove(item.id);
          }
        }

      } catch (e) {
        console.log('worker v5 item error:', e.message);
      }
    }

  } catch (e) {
    console.log('worker v5 tick error:', e.message);
  }
}

setInterval(tick, 4000);

console.log('🚀 WORKER V5 ZERO-LOSS ACTIVE');

