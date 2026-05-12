const { assertApiVersion } = require("../runtime/safety/api.guard");
const { messageBrain } = require('../brain/message.brain');

async function handleMessage({ from, message }) {
  console.log('🧠 V7 BRAIN:', from, message);

  const reply = await messageBrain({ from, message });

  return {
    from,
    reply: reply || "👋 Hello from AfriDigital AI"
  };
}

module.exports = { handleMessage };
