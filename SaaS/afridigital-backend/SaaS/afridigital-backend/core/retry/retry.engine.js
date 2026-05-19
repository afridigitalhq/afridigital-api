const { assertApiVersion } = require("../runtime/safety/api.guard");
const Redis = require("ioredis");

// SAFE INIT (prevents crash if REDIS_URL missing)
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : null;

const FAILED = "failed_queue";
const DEAD = "dead_letter_queue";

// PUSH FAILED MESSAGE
async function pushFailed(msg) {
  if (!redis) {
    console.warn("⚠️ Redis not configured, retry skipped");
    return;
  }

  await redis.lpush(FAILED, JSON.stringify({
    ...msg,
    timestamp: Date.now(),
    attempts: (msg.attempts || 0) + 1
  }));
}

// POP FAILED MESSAGE
async function popFailed() {
  if (!redis) return null;

  const data = await redis.rpop(FAILED);
  return data ? JSON.parse(data) : null;
}

// DEAD LETTER QUEUE
async function pushDead(msg) {
  if (!redis) return;

  await redis.lpush(DEAD, JSON.stringify({
    ...msg,
    failedAt: Date.now()
  }));
}

module.exports = {
  pushFailed,
  popFailed,
  pushDead
};
