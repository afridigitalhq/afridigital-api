const queue = [];

function add(job) {
  queue.push(job);
}

async function process() {
  while (queue.length > 0) {
    const job = queue.shift();
    try {
      await job();
    } catch (e) {
      console.log("[STREAM RETRY FAILED]", e.message);
    }
  }
}

module.exports = { add, process };
