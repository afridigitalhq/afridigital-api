let redisClient = null; // redis fallback safe mode enabled
const memoryStore = new Map();

function initRedis() {
  try {
    const redis = require("../../redis");
    redisClient = redis?.client || null;
  } catch (e) {
    redisClient = null;
  }
}

async function set(key, value) {
  if (redisClient?.set) {
    try { return await redisClient.set(key, JSON.stringify(value)); } catch {}
  }
  memoryStore.set(key, value);
  return true;
}

async function get(key) {
  if (redisClient?.get) {
    try {
      const v = await redisClient.get(key);
      return v ? JSON.parse(v) : null;
    } catch {}
  }
  return memoryStore.get(key) || null;
}

async function pushStream(stream, payload) {
  if (redisClient?.xAdd) {
    try { return await redisClient.xAdd(stream, "*", payload); } catch {}
  }

  if (!memoryStore.has(stream)) memoryStore.set(stream, []);
  memoryStore.get(stream).push({ id: Date.now(), payload });

  return true;
}

initRedis();

module.exports = {
  set,
  get,
  pushStream,
  memoryStore
};
