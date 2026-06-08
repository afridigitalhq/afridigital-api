const queue = require("../queue/whatsappQueue");
const axios = require("axios");

queue.process(async (job) => {
  const msg = job.data;

  try {
    // SAFE PROCESS LAYER
    console.log("📩 Processing message:", msg.from);

    // CALL YOUR AI PIPELINE HERE
    const response = await axios.post(
      process.env.AI_ENDPOINT || "http://localhost:10000/api/ai",
      msg
    );

    return response.data;
  } catch (err) {
    console.error("Worker error:", err.message);
    throw err;
  }
});
