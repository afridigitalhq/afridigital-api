const store = require('./queue.store');

exports.process = (handler) => {
  console.log("🔁 V8.15 PERSISTENT RETRY WORKER STARTED");

  setInterval(async () => {
    const queue = store.popAll();

    for (const item of queue) {
      try {
        await handler(item.job);
        console.log("✅ JOB SUCCESS");
      } catch (err) {
        item.retries++;

        console.error("❌ JOB FAILED:", err.message);

        if (item.retries < 3) {
          store.push(item.job);
        } else {
          console.error("💀 DROPPED AFTER 3 FAILS");
        }
      }
    }
  }, 5000);
};
