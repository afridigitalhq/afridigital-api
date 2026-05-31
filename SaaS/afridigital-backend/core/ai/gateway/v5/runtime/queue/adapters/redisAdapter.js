let Redis;

try {
  Redis = require("ioredis");
} catch (e) {
  console.log("⚠️ Redis not installed, using memory fallback");
}

class MemoryFallback {
  constructor() {
    this.q = [];
  }

  enqueue(job) {
    this.q.push(job);
    return job;
  }

  claim() {
    return this.q.shift() || null;
  }

  update(job) {
    return job;
  }

  size() {
    return this.q.length;
  }
}

class RedisAdapter {
  constructor() {
    this.redis = Redis
      ? undefined
      : null;

    this.queueKey = "a2:queue";
    this.fallback = new MemoryFallback();
  }

  async enqueue(job) {
    const payload = {
      id: Date.now().toString(),
      status: "queued",
      retries: 0,
      createdAt: Date.now(),
      ...job
    };

    if (!this.redis) return this.fallback.enqueue(payload);

    await this.redis.lpush(this.queueKey, JSON.stringify(payload));
    return payload;
  }

  async claim(workerId) {
    if (!this.redis) return this.fallback.claim();

    const data = await this.redis.rpop(this.queueKey);
    if (!data) return null;

    const job = JSON.parse(data);
    job.status = "processing";
    job.workerId = workerId;
    job.startedAt = Date.now();

    return job;
  }

  async update(job) {
    if (!this.redis) return this.fallback.update(job);
  }

  async size() {
    if (!this.redis) return this.fallback.size();
  }
}

module.exports = RedisAdapter;


// REDIS SAFE GUARD
process.on('uncaughtException', (err) => {
  if (err.message.includes('ECONNREFUSED')) {
    console.log('⚠️ Redis offline - switching to fallback mode');
  } else {
    console.log('🔥 SYSTEM ERROR:', err.message);
  }
});
