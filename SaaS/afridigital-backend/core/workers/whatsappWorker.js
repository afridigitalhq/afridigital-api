if(global.__WHATSAPP_WORKER_RUNNING__)return;
global.__WHATSAPP_WORKER_RUNNING__=true;


const processed=new Set();
const { isDelivered, markDelivered } = require('../delivery/ledger');
const queue = require("../queue/whatsappQueue");
const axios = require("axios");

queue.process(async (job) => {
  const msg = job.data;

if (await isDelivered?.(msg.id)) {
  console.log('🟡 DUPLICATE BLOCKED:', msg.id);
  return;
}

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
