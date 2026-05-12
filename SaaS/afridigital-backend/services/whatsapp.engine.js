const queue = [];

function enqueue(job) {
  queue.push(job);
}

async function startWorker() {
  setInterval(async () => {
    if (queue.length === 0) return;

    const job = queue.shift();

    try {
      const ai = buildAfriAiResponse(job.text);

      const reply =
        ai?.content?.value ||
        ai?.content ||
        "AfriAI online 🤖";

      await sendWhatsAppMessage(job.from, String(reply));

      console.log("[AFRIAI REPLY SENT]", job.from);

    } catch (err) {
      console.log("ENGINE ERROR:", err.message);
    }
  }, 400);
}

module.exports = {
  enqueue,
  startWorker
};
