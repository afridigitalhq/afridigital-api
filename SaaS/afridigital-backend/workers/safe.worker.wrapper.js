const dedupe = require('../core/bus/dedupe.engine');
const retry = require('./retry.scheduler');
const dead = require('../storage/queue/dead.letter');

exports.runSafe = async (job, handler) => {
  try {
    const key = job.id || JSON.stringify(job.event);

    // 🧠 DEDUPE GUARD
    if (!dedupe.check(key)) {
      console.log("⚠️ DUPLICATE JOB BLOCKED");
      return;
    }

    await handler(job);

  } catch (err) {
    console.error("❌ SAFE WORKER ERROR:", err.message);

    job.retries = (job.retries || 0) + 1;

    // retry policy
    if (job.retries <= 3) {
      retry.addRetry(job);
    } else {
      dead.push(job);
      console.log("🧱 MOVED TO DEAD LETTER QUEUE");
    }
  }
};
