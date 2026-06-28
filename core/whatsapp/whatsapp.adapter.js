const axios = require("axios");

/**
 * WHATSAPP INGRESS ONLY
 * NO OS ACCESS. NO DAG. NO SIMULATION.
 */
async function whatsappIngress(message) {
  if (process.env.OS_ENABLE === "true") {
    throw new Error("OS layer blocked in WhatsApp pipeline");
  }

  const payload = {
    source: "whatsapp",
    message,
    timestamp: Date.now()
  };

  const res = await axios.post(
    process.env.API_URL || "http://localhost:3000/api/afriai/chat",
    payload
  );

  return res.data;
}

module.exports = { whatsappIngress };
