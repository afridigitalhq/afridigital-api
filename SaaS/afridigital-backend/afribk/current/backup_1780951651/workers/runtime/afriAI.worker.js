const { subscribe } = require('../../core/redis/streamBus');
const { setReply } = require('../../core/africore/runtime/promiseStore');

async function processWithAI(msg) {
  return { reply: "💬 Message received", traceId: msg.traceId };
}

const STREAM = "afri:whatsapp:stream";

subscribe(STREAM, async (msg) => {
  try {
    console.log("⚡ PROCESSING:", msg.traceId);

    const result = await processWithAI(msg);

    setReply(msg.traceId, result);

    console.log("🤖 AI RESULT:", result);
  } catch (e) {
    console.error("❌ WORKER ERROR:", e);
  }
});

console.log("🚀 STREAM WORKER RUNNING (NO REDIS REQUIRED)");
