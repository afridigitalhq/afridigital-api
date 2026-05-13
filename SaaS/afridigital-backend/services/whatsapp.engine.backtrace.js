console.log("🧠 AFRAI ENGINE BOOT ACTIVE");
const queue = [];
const { sendMessage } = require("./meta.sender");

function enqueue(job) {
  console.log("📥 ENQUEUE CALLED:", job);
(job) {
  queue.push(job);
  console.log("📥 QUEUED:", job.from, job.text);
}

async function processJob(job) {
  try {
    console.log("🤖 PROCESSING:", job.from, job.text);

    const reply = `AfriAI: I received "${job.text}"`;

    const result = await sendMessage(job.from, reply);

    console.log("📤 META RESPONSE:", result);

  } catch (err) {
    console.log("💥 PROCESS ERROR:", err?.response?.data || err.message);
  }
}

  if (sendMessage) {
    await sendMessage(job.from, reply);
  } else {
    console.log("⚠️ No sender configured");
  }
}

function startWorker() {
  console.log("🚀 AfriAI WORKER STARTED");

  setInterval(async () => {
console.log("💓 WORKER HEARTBEAT RUNNING");
    if (queue.length === 0) return;

    const job = queue.shift();
    await processJob(job);
  }, 1000);
}

module.exports = {
  enqueue,
  startWorker
};
console.log("🧪 ENGINE MODULE LOADED");
