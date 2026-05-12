const sendWhatsAppMessage = require("./whatsapp.send");

const queue = [];

function enqueue(job) {
  queue.push(job);
}

function buildAfriAiResponse(text) {
  return {
    content: {
      value: `🤖 AfriAI received: ${text}`
    }
  };
}

async function startWorker() {

  console.log("🚀 WhatsApp Engine Started");

  setInterval(async () => {

    if (queue.length === 0) return;

    const job = queue.shift();

    try {

      console.log("[QUEUE JOB]", job);

      const ai = buildAfriAiResponse(job.text);

      const reply =
        ai?.content?.value ||
        "AfriAI online 🤖";

      await sendWhatsAppMessage(
        job.from,
        String(reply)
      );

      console.log("[AFRIAI REPLY SENT]", job.from);

    } catch (err) {

      console.log(
        "ENGINE ERROR:",
        err.message
      );

    }

  }, 400);
}

module.exports = {
  enqueue,
  startWorker
};
