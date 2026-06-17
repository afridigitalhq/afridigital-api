const { processReplay } = require('../kernel/replay.engine.v3');
const { handleMessage } = require('../whatsapp/controller');

function startWorker(interval = 5000) {
  console.log('🟢 REPLAY WORKER STARTED');

  setInterval(async () => {
    try {
      await processReplay(handleMessage, 3);
    } catch (e) {
      console.error('Replay worker error:', e.message);
    }
  }, interval);
}

module.exports = { startWorker };
