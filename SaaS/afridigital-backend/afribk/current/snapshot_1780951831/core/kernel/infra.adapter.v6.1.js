
let redis = null;

try {
  redis = null
} catch (e) {
  console.log('⚠️ Infra running MEMORY MODE only');
}

// -----------------------------
// SAFE QUEUE STORAGE (NO LRANGE DEPENDENCY)
// -----------------------------
const memoryQueue = new Map();

function getQueue(key) {
  if (!memoryQueue.has(key)) memoryQueue.set(key, []);
  return memoryQueue.get(key);
}

async function queuePush(key, value) {
  const q = getQueue(key);
  q.push({ id: Date.now() + '-' + Math.random(), value });
  return true;
}

async function queuePop(key, limit = 10) {
  const q = getQueue(key);
  return q.splice(0, limit);
}

// -----------------------------
// LOCK SYSTEM
// -----------------------------
const locks = new Map();

async function lock(key, ttl = 5000) {
  if (locks.has(key)) return false;
  locks.set(key, true);

  setTimeout(() => locks.delete(key), ttl);
  return true;
}

async function unlock(key) {
  locks.delete(key);
}

// -----------------------------
// EVENT EMITTER (SAFE)
// -----------------------------
async function emit(stream, event) {
  return {
    id: Date.now(),
    stream,
    event
  };
}

module.exports = {
  queuePush,
  queuePop,
  lock,
  unlock,
  emit
};

