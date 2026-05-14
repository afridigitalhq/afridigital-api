const { sendMessage } = require("./meta.sender");
const { log } = require("../utils/trace");

console.log("🧠 AFRAI ENGINE OBSERVABILITY ACTIVE");

async function processJob(job) {
  const { traceId, from, text } = job;

  try {
    log(traceId, "PROCESS_START", { from, text });

    const reply = `AfriAI: ${text}`;

    log(traceId, "META_SEND_START");

    const result = await sendMessage(from, reply);

    log(traceId, "META_SEND_SUCCESS", {
      messageId: result?.messages?.[0]?.id || null
    });

    return result;

  } catch (err) {
    log(traceId, "PROCESS_ERROR", {
      error: err?.response?.data || err.message
    });
  }
}

module.exports = { processJob };
