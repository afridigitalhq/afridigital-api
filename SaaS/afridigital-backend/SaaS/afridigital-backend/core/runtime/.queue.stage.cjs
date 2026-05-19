const Services = require('../registry/services.registry.cjs');
const { handleIncomingMessage } = require('../../modules/chat');
const sendWhatsApp = require('../../services/whatsapp.unified');

const fraudThrottle = Services.security;
const walletLedger = Services.wallet;

console.log('🚀 AFRI QUEUE ENGINE v2 (AUTO-RECOVERED ARS)');

// =========================
// CORE STATE
// =========================
const queue = [];
let processing = false;

// =========================
// ENQUEUE SYSTEM
// =========================
function enqueue(job) {
  queue.push(job);
  processQueue();
}

// =========================
// PROCESSOR
// =========================
async function processQueue() {
  if (processing) return;
  processing = true;

  while (queue.length > 0) {
    const job = queue.shift();

    try {
      const blocked = await fraudThrottle?.check?.(job.from);
      if (blocked) continue;

      const aiResponse = await handleIncomingMessage(job);

      await sendWhatsApp({
        to: job.from,
        message: aiResponse
      });

    } catch (err) {
      console.log('QUEUE_ERROR:', err.message);
    }
  }

  processing = false;
}

// =========================
// EXPORT CORE
// =========================
module.exports = {
  enqueue,
  processQueue
};
