const queue = [];

const AfriDebugQueue = {
  enqueue(job = {}) {
    const item = {
      id: `QUEUE-${Date.now()}`,
      priority: job.priority || "NORMAL",
      status: "QUEUED",
      createdAt: Date.now(),
      ...job
    };
    queue.push(item);
    return item;
  },

  dequeue() {
    return queue.shift() || null;
  },

  list() {
    return queue;
  },

  stats() {
    return {
      queued: queue.filter(x => x.status === "QUEUED").length,
      total: queue.length
    };
  }
};

export default AfriDebugQueue;
