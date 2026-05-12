const sendWhatsAppMessage = require("./whatsapp.send");

const queue = [];

function enqueue(job) {
  queue.push(job);
}

function buildAfriAiResponse(text) {
  return {
    content: {
      value: `🤖 AfriAI: ${text}`
    }
  };
}

// 🔥 SAFE LOOP (NO setInterval RACE CONDITIONS)
async function startWorker() {
  console.log("🚀 WhatsApp Engine Started");

  while (true) {
    try {
      if (queue.length === 0) {
        await new Promise(r => setTimeout(r, 300));
        continue;
      }

      const job = queue.shift();

      console.log("[QUEUE JOB]", job);

      const ai = buildAfriAiResponse(job.text);

      const reply =
        ai?.content?.value ||
        "AfriAI online 🤖";

      console.log("[SENDING TO WHATSAPP]", job.from);

      await sendWhatsAppMessage(job.from, String(reply));

      console.log("[AFRIAI REPLY SENT]", job.from);

    } catch (err) {
      console.error("[ENGINE ERROR]", err.message);
    }
  }
}

module.exports = {
  enqueue,
  startWorker
};
