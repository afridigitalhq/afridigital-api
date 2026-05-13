console.log("🧠 AFRAI ENGINE BOOT (ATOMIC TRACE)");

const { sendMessage } = require("./meta.sender");

async function processJob(job) {
  try {
    console.log("⚛️ TRACE:PROCESS_START", {
      from: job.from,
      text: job.text
    });

    const reply = `AfriAI: ${job.text}`;

    console.log("⚛️ TRACE:META_SEND_INIT");

    const res = await sendMessage(job.from, reply);

    console.log("⚛️ TRACE:META_SEND_OK", {
      id: res?.messages?.[0]?.id || null
    });

    return res;

  } catch (err) {
    console.log("⚠️ TRACE:PROCESS_ERROR", {
      error: err?.response?.data || err.message
    });
  }
}

module.exports = { processJob };

console.log("🚀 ENGINE READY (ATOMIC MODE)");
