const queue = [];

async function enqueueReplay(job) {
  queue.push({ job, ts: Date.now(), attempts: 0 });
}

async function getBatch(limit = 10) {
  return queue.splice(0, limit);
}

async function processReplay(handler, limit = 3) {
  const batch = await getBatch(limit);

  for (const item of batch) {
    try {
      await handler(item.job.payload || item.job);
    } catch (e) {
      item.attempts++;
      if (item.attempts < 3) queue.push(item);
    }
  }

  return { processed: batch.length };
}

module.exports = {
  enqueueReplay,
  getBatch,
  processReplay
};
