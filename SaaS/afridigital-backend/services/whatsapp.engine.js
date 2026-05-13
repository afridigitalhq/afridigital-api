console.log("🧠 AFRAI ENGINE BOOT ACTIVE");

const { sendMessage } = require("./meta.sender");

async function processJob(job) {
  try {

    console.log("🤖 PROCESSING:", job.from, job.text);

    const reply = `AfriAI: I received "${job.text}"`;

    const result = await sendMessage(job.from, reply);

    console.log("📤 META RESPONSE:", result);

    return result;

  } catch (err) {

    console.log(
      "💥 PROCESS ERROR:",
      err?.response?.data || err.message
    );
  }
}

module.exports = {
  processJob
};

console.log("🚀 ENGINE MODULE LOADED CLEAN");
