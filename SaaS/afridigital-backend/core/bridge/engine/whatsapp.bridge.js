const { assertApiVersion } = require("../runtime/safety/api.guard");
const { generateResponse } =
require('./response.engine');

async function handleWhatsAppMessage(msg) {

  const reply =
    await generateResponse(msg.message);

  return {
    to: msg.sender,
    message: reply
  };
}

module.exports = { handleWhatsAppMessage };
