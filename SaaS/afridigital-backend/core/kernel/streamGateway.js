const { routeRequest } = require("./controlPlaneRouter");
const { StreamCore } = require("../stream/streamCore");
const { startWhatsAppStreamBridge } = require("../whatsapp/streamBridge");

/**
 * 🌊 STREAM GATEWAY
 * connects AI → stream → WhatsApp
 */

async function handleStreamRequest({ user, text }) {

  // 1. create stream engine
  const stream = new StreamCore();

  // 2. attach WhatsApp bridge safely
  try {
    startWhatsAppStreamBridge(stream);
  } catch (e) {
    console.log("⚠️ bridge attach skipped:", e.message);
  }

  // 3. execute AI via control plane
  const result = await routeRequest({
    user,
    text,
    stream: true
  });

  // 4. safely stream raw text responses
  if (typeof result === "string") {
    await stream.streamText({
      id: user,
      text: result,
      delay: 40
    });
  }

  return result;
}

module.exports = { handleStreamRequest };
