
let redis;
try {
  redis = null.createClient({ url: process.env.REDIS_URL });
  redis.connect();
} catch (e) {}

async function acquireLock(id) {
  if (!redis) return true;

  const key = `lock:${id}`;
  const exists = await redis.get(key);

  if (exists) return false;

  await redis.set(key, '1', { EX: 60 }); // 60 sec lock
  return true;
}

module.exports = { acquireLock };

