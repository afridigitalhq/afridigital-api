const sendWhatsAppMessage = require("./whatsapp.send");

const queue = [];

function enqueue(job) {
  console.log("[QUEUE PUSH]", job.from, job.text);
  queue.push(job);
}

function buildAfriAiResponse(text) {
  return {
    content: {
      value: `🤖 AfriAI: ${text}`
    }
  };
}

async function startWorker() {

  setInterval(async () => {

    if (queue.length === 0) return;

    const job = queue.shift();

    try {

      console.log("[QUEUE JOB]", job.from);

      const ai = buildAfriAiResponse(job.text);

      const reply = ai?.content?.value || "AfriAI online 🤖";

      await sendWhatsAppMessage(job.from, String(reply));

      console.log("[AFRIAI REPLY SENT]", job.from);

    } catch (err) {
      console.log("[ENGINE ERROR]", err.message);
    }

  }, 500);
}

module.exports = {
  enqueue,
  startWorker
};
