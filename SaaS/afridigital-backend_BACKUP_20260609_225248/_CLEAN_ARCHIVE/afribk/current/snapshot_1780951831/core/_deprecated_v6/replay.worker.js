const { processReplay } = require('../kernel/replay.engine.v2');
const { handleMessage } = require('../whatsapp/controller');

setInterval(async () => {
  await processReplay(handleMessage, 3);
}, 5000);

console.log('🟢 REPLAY WORKER RUNNING');
