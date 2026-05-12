const queue = [];
const { sendMessage } = require("./meta.sender");

function enqueue(job) {
  queue.push(job);
  console.log("📥 QUEUED:", job.from, job.text);
}

async function processJob(job) {
  console.log("🤖 PROCESSING:", job.from, job.text);

  // 🧠 REAL AI LOGIC (TEMP)
  const reply = `AfriAI: I received "${job.text}"`;

  // 🚀 SEND BACK TO WHATSAPP
  await sendMessage(job.from, reply);
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
