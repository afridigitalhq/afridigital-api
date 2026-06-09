const memoryQueue = [];
let redisClient = null;

/**
 * Optional Redis attach (safe if not present)
 */
async function attachRedis(client) {
  redisClient = client;
}

/**
 * Enqueue failed message for replay
 */
async function enqueueReplay(payload) {
  const item = {
    id: Date.now() + '-' + Math.random().toString(36).slice(2),
    payload,
    attempts: 0,
    createdAt: Date.now()
  };

  if (redisClient) {
    await redisClient.lPush('replay_queue', JSON.stringify(item));
  } else {
    memoryQueue.push(item);
  }

  return item;
}

/**
 * Get next replay batch
 */
async function getReplayBatch(limit = 5) {
  if (redisClient) {
    const items = await redisClient.lRange('replay_queue', 0, limit - 1);
    return items.map(i => JSON.parse(i));
  }
  return memoryQueue.slice(0, limit);
}

/**
 * Remove processed item
 */
async function removeReplay(id) {
  if (redisClient) {
    const items = await redisClient.lRange('replay_queue', 0, -1);
    for (const item of items) {
      const parsed = JSON.parse(item);
      if (parsed.id === id) {
        await redisClient.lRem('replay_queue', 1, item);
      }
    }
  } else {
    const index = memoryQueue.findIndex(i => i.id === id);
    if (index !== -1) memoryQueue.splice(index, 1);
  }
}

/**
 * Safe processor
 */
async function processReplay(handler, maxAttempts = 3) {
  const batch = await getReplayBatch();

  for (const item of batch) {
    if (item.attempts >= maxAttempts) continue;

    try {
      item.attempts++;

      const res = await handler(item.payload);

      if (res?.ok) {
        await removeReplay(item.id);
      }

    } catch (e) {
      // keep in queue
    }
  }
}

module.exports = {
  attachRedis,
  enqueueReplay,
  getReplayBatch,
  removeReplay,
  processReplay
};
