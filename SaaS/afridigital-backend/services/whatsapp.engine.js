const queue = [];

function enqueue(job) {
  queue.push(job);
  console.log("📥 QUEUED:", job.from, job.text);
}

async function processJob(job) {
  console.log("🤖 PROCESSING:", job.from, job.text);

  // 🧠 SIMPLE AI LOGIC (TEMP BEFORE REAL LLM)
  const reply = `AfriAI: I received "${job.text}"`;

  console.log("📤 REPLY:", reply);

  // TODO: replace with WhatsApp send API later
  return reply;
}

async function startWorker() {
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
