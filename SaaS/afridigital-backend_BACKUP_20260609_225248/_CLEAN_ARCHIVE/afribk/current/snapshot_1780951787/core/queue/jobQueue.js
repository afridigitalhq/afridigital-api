const Redis = require("../redis/safeClient");

const memoryQueue = [];
const seen = new Map();

let redis = null;

function attachRedis(client) {
  redis = client;
}

function isSeen(id) {
  if (!id) return false;
  if (seen.has(id)) return true;

  seen.set(id, Date.now());
  setTimeout(() => seen.delete(id), 3600000);

  return false;
}

async function enqueue(event) {
  try {
    if (redis && redis.isReady?.()) {
      await redis.xadd(
        "afri:events",
        "*",
        "data",
        JSON.stringify(event)
      );
      return { mode: "redis" };
    }
  } catch (e) {}

  memoryQueue.push(event);
  return { mode: "memory" };
}

async function dequeue(limit = 10) {
  try {
    if (redis && redis.isReady?.()) {
      return await redis.xreadgroup(
        "GROUP",
        "afri-group",
        "worker-1",
        "COUNT",
        limit,
        "BLOCK",
        100,
        "STREAMS",
        "afri:events",
        ">"
      );
    }
  } catch (e) {}

  return memoryQueue.splice(0, limit);
}

module.exports = {
  enqueue,
  dequeue,
  attachRedis,
  isSeen
};
