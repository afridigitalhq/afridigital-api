const queue = [];
const { sendMessage } = require("./meta.sender");

function enqueue(job) {
  queue.push(job);
  console.log("📥 QUEUED:", job.from, job.text);
}

async function processJob(job) {
  try {
    console.log("🤖 PROCESSING:", job.from, job.text);

    const reply = `AfriAI: I received "${job.text}"`;

    if (sendMessage) {
      await sendMessage(job.from, reply);
    } else {
      console.log("⚠️ SEND DISABLED - missing sender");
    }

  } catch (err) {
    console.log("💥 PROCESS ERROR:", err.message);
  }
}

function startWorker() {
  console.log("🚀 AfriAI WORKER STARTED");

  setInterval(async () => {
    try {
      if (queue.length === 0) return;
      const job = queue.shift();
      await processJob(job);
    } catch (err) {
      console.log("💥 WORKER CRASH:", err.message);
    }
  }, 1000);
}

module.exports = {
  enqueue,
  startWorker
};
