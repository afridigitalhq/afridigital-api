const queue = require('../../storage/queue/file.queue');
const { generateReply } = require('../../core/ai/reply.engine');
const sendMessage = require('../../core/whatsapp/sendMessage');

const run = async () => {
  const jobs = queue.fetchPending();

  for (const job of jobs) {
    try {
      const payload = JSON.parse(job.payload);

      const messages =
        payload.entry?.[0]?.changes?.[0]?.value?.messages || [];

      for (const msg of messages) {
        const from = msg.from;
        const text = msg.text?.body || "";

        console.log("🧠 PROCESSING:", text);

        const reply = await generateReply(text, from);

        await sendMessage(from, reply);
      }

      queue.markDone(job.id);
      console.log("✅ JOB DONE:", job.id);

    } catch (err) {
      console.error("❌ JOB FAILED:", err.message);
      queue.markFailed(job.id);
    }
  }
};

setInterval(run, 3000);

module.exports = run;
