
const axios = require("axios");

async function handleWhatsAppCommand(message) {
  const text = message.toLowerCase();

  if (text.includes("deploy")) {
    await axios.post("http://localhost:3000/api/ci/request-deploy", {
      source: "whatsapp",
      reason: text
    });

    return "🧠 Deploy request sent to CI system";
  }

  return "Command not recognized";
}

module.exports = { handleWhatsAppCommand };
