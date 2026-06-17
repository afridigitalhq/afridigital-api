const { processReplay } = require('../kernel/replay.engine');

let running = false;
let interval = null;

/**
 * Safe replay worker loop
 * - non-blocking
 * - render-safe
 * - crash-proof
 */
async function startReplayWorker(handler, config = {}) {
  if (running) return { ok: true, status: 'already_running' };

  const delay = config.interval || 5000;
  const maxAttempts = config.maxAttempts || 3;

  running = true;

  async function tick() {
    try {
      await processReplay(handler, maxAttempts);
    } catch (e) {
      // NEVER crash worker
      console.error('🧨 Replay worker error:', e.message);
    }
  }

  // initial run
  tick();

  interval = setInterval(tick, delay);

  console.log('🟢 REPLAY WORKER STARTED');
  return { ok: true, running: true };
}

function stopReplayWorker() {
  if (interval) clearInterval(interval);
  running = false;
  console.log('🔴 REPLAY WORKER STOPPED');
}

module.exports = {
  startReplayWorker,
  stopReplayWorker
};
