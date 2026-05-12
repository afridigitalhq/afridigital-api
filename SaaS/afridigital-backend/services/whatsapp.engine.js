const sendWhatsAppMessage = require("./whatsapp.send");

const queue = [];

console.log("⚙️ ENGINE ACTIVE - QUEUE SIZE:", queue.length);
function enqueue(job) {
  console.log("📦 QUEUE RECEIVED:", job);
  queue.push(job);
}

async function startWorker() {
  console.log("🚀 ENGINE LOOP STARTED");

  while (true) {
    try {
      if (queue.length === 0) {
        await new Promise(r => setTimeout(r, 300));
        continue;
      }

      const job = queue.shift();

      console.log("⚙️ PROCESSING JOB:", job);

      const reply = `🤖 AfriAI: ${job.text}`;

      console.log("📤 SENDING:", job.from, reply);

      await sendWhatsAppMessage(job.from, reply);

      console.log("✅ SENT SUCCESSFULLY:", job.from);

    } catch (err) {
      console.error("❌ ENGINE ERROR:", err.message);
    }
  }
}

module.exports = {
  enqueue,
  startWorker
};
