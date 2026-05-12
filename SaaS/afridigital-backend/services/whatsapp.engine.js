const queue = [];
const { sendMessage } = require("./meta.sender");

function enqueue(job) {
  queue.push(job);
  console.log("📥 QUEUED:", job.from, job.text);
}

async function processJob(job) {
  console.log("🤖 PROCESSING:", job.from, job.text);

  const reply = `AfriAI: I received "${job.text}"`;

  if (sendMessage) {
    await sendMessage(job.from, reply);
  } else {
    console.log("⚠️ No sender configured");
  }
}

function startWorker() {
  console.log("🚀 AfriAI WORKER STARTED");

  setInterval(async () => {
    if (queue.length === 0) return;

    const job = queue.shift();
    await processJob(job);
  }, 1000);
}

module.exports = {
  enqueue,
  startWorker
};
