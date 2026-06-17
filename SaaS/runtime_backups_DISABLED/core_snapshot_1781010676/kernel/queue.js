const queue = [];

function push(job) {
  queue.push(job);
  console.log("📥 QUEUED:", job.traceId);
}

function pop() {
  return queue.shift();
}

function size() {
  return queue.length;
}

module.exports = { push, pop, size };
