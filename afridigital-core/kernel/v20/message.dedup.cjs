async function isDuplicate(redis, messageId) {
  const key = `wa:dedup:${messageId}`;
  const exists = await redis.get(key);

  if (exists) return true;

  // mark as processed with TTL (24h)
  await redis.set(key, "1", { EX: 86400 });

  return false;
}

module.exports = { isDuplicate };
