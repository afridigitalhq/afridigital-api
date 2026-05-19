const fs = require('fs');
const path = require('path');

const { handleIncomingMessage } = require('../../modules/ai/handleIncomingMessage');
const { fallbackResponse } = require('../../modules/ai/fallback');
const sendWhatsApp = require('../../services/whatsapp.unified');

console.log('🚀 AFRI QUEUE ENGINE v4.1 (HARDENED PERSISTENT CORE)');

const STORE = path.join(__dirname, 'store.queue.json');

// ------------------------
// SAFE INIT
// ------------------------
if (!fs.existsSync(STORE)) {
  fs.writeFileSync(STORE, JSON.stringify([]));
  console.log('📦 Queue store initialized');
}

function loadQueue() {
  try {
    return JSON.parse(fs.readFileSync(STORE, 'utf8'));
  } catch {
    return [];
  }
}

function saveQueue(q) {
  fs.writeFileSync(STORE, JSON.stringify(q, null, 2));
}

let queue = loadQueue();
let processing = false;

// ------------------------
// CORE PERSISTENCE
// ------------------------
function persist() {
  saveQueue(queue);
}

// ------------------------
// NORMALIZER
// ------------------------
function normalize(job) {
  return {
    id: job.id || Date.now() + '_' + Math.random().toString(36).slice(2),
    from: job.from || 'unknown',
    message: job.message || '',
    status: job.status || 'pending',
    retries: job.retries || 0
  };
}

// ------------------------
// AI SAFETY LAYER
// ------------------------
async function safeAI(job) {
  try {
    const res = await Promise.race([
      handleIncomingMessage(job),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI_TIMEOUT')), 8000)
      )
    ]);

    if (!res?.reply) throw new Error('Invalid AI response');
    return res;

  } catch (e) {
    console.log('⚠️ AI FALLBACK TRIGGERED:', e.message);
    return fallbackResponse(job);
  }
}

// ------------------------
// JOB PROCESSOR
// ------------------------
async function processJob(job) {
  job.status = 'processing';
  persist();

  try {
    const ai = await safeAI(job);

    await sendWhatsApp({
      to: job.from,
      message: ai.reply
    });

    job.status = 'done';
    persist();

  } catch (err) {
    job.retries += 1;

    console.log('❌ JOB ERROR:', err.message);

    if (job.retries <= 3) {
      job.status = 'pending';
      queue.push(job);
    } else {
      job.status = 'failed';
      console.log('💀 DEAD LETTER QUEUE ENTRY:', job.id);
    }

    persist();
  }
}

// ------------------------
// QUEUE LOOP
// ------------------------
async function processQueue() {
  if (processing) return;
  processing = true;

  console.log('🔁 Queue processor started');

  while (queue.length > 0) {
    const job = normalize(queue.shift());
    await processJob(job);
  }

  processing = false;
}

// ------------------------
// ENQUEUE ENTRYPOINT
// ------------------------
function enqueue(job) {
  const safeJob = normalize(job);
  queue.push(safeJob);
  persist();
  processQueue();
}

// ------------------------
// BOOT RECOVERY
// ------------------------
function replay() {
  const before = queue.length;
  queue = queue.filter(j => j.status !== 'done');
  persist();
  console.log(`♻️ Replay complete: ${before} → ${queue.length} active jobs`);
}

replay();

module.exports = {
  enqueue,
  processQueue
};
