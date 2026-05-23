function memoryKey(agent, userId) {
  return `agent:memory:${agent}:${userId}`;
}

async function getMemory(redis, agent, userId) {
  const data = await redis.get(memoryKey(agent, userId));
  return data ? JSON.parse(data) : { score: 0, hits: 0, flags: [] };
}

async function updateMemory(redis, agent, userId, update) {
  const key = memoryKey(agent, userId);
  const current = await getMemory(redis, agent, userId);

  const merged = {
    ...current,
    ...update,
    hits: (current.hits || 0) + 1
  };

  await redis.set(key, JSON.stringify(merged), { EX: 60 * 60 * 24 * 7 }); // 7 days
  return merged;
}

module.exports = { getMemory, updateMemory };
