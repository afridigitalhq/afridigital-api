const { sendEvent } = require('../../core/bridge/client');

async function ingestMessage(payload) {
  console.log("📩 WHATSAPP IN:", payload);

  const AI_WORKER_URL = process.env.AI_WORKER_URL || "http://localhost:4001/event";

  await sendEvent(AI_WORKER_URL, {
    type: "message.incoming",
    data: payload
  });
}

module.exports = { ingestMessage };
