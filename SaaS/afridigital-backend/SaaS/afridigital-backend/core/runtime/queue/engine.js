const { handleIncomingMessage } = require('../../../modules/ai/handleIncomingMessage');
const sendWhatsApp = require('../../../services/whatsapp.unified');

const queue = [];
let processing = false;

async function processQueue() {
  if (processing) return;
  processing = true;

  while (queue.length > 0) {
    const job = queue.shift();

    try {
      console.log('📥 JOB RECEIVED:', job.from);

      const ai = await handleIncomingMessage(job);

      console.log('🧠 AI PROCESSING:', job.message);
      console.log('📤 SENDING RESPONSE:', ai.reply);

      await sendWhatsApp({
        to: job.from,
        message: ai.reply
      });

      console.log('✅ RESPONSE SENT');

    } catch (err) {
      console.log('❌ PIPELINE ERROR:', err.message);
    }
  }

  processing = false;
}

function enqueue(job) {
  queue.push({
    from: job.from || 'unknown',
    message: job.message || ''
  });

  processQueue();
}

module.exports = {
  enqueue,
  processQueue
};
