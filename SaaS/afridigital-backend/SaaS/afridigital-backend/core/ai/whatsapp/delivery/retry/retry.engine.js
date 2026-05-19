/**
 * 🔁 A3.18.13 RETRY ENGINE (STABLE VERSION)
 */

const queue = [];

function addRetry(task) {
  queue.push({
    ...task,
    attempts: task.attempts || 0,
    nextRetry: Date.now()
  });
}

function processRetries(sendFn) {

  const now = Date.now();

  for (const task of queue) {

    if (task.nextRetry > now) continue;
    if (task.attempts >= 3) continue;

    try {
      sendFn(task);

      task.attempts += 1;
      task.nextRetry = now + (task.attempts * 5000);

    } catch (e) {

      task.attempts += 1;
      task.nextRetry = now + (task.attempts * 5000);

      task.lastError = e.message;
    }
  }
}

function getQueue() {
  return queue;
}

module.exports = {
  addRetry,
  processRetries,
  getQueue
};
