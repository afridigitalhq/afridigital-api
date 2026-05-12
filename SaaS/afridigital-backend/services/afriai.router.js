const { assertApiVersion } = require("../runtime/safety/api.guard");
function detectIntent(text = "") {
  const msg = text.toLowerCase();

  if (msg.includes("job") || msg.includes("earn money") || msg.includes("work from home")) {
    return "JOB";
  }

  if (msg.includes("ad") || msg.includes("tiktok") || msg.includes("instagram")) {
    return "ADS";
  }

  if (msg.includes("send money") || msg.includes("payment") || msg.includes("pay")) {
    return "PAYMENT";
  }

  if (msg.includes("video") || msg.includes("image") || msg.includes("media")) {
    return "MEDIA";
  }

  return "CHAT";
}

module.exports = { detectIntent };
