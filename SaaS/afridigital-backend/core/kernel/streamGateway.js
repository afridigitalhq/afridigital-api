console.log("🌊 streamGateway boot OK")
const { routeRequest } = require("./controlPlaneRouter");
const StreamCore = require("../stream/streamCore");
const { WhatsAppStreamBridge } = require("../whatsapp/streamBridge");

/**
 * 🌊 STREAM GATEWAY
 * connects AI → stream → WhatsApp
 */
async function handleStreamRequest({ user, text }) {

  // 1. create stream engine
  const stream = new StreamCore();

  // 2. attach WhatsApp bridge
  const bridge = new WhatsAppStreamBridge({ userId: user });
  bridge.attach(stream);

  // 3. execute AI via control plane
  const result = await routeRequest({
    user,
    text,
    stream: true
  });

  // 4. if orchestrator returns raw text, stream it safely
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
