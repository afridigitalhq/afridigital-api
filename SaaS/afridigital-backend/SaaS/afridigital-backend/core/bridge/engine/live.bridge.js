const { assertApiVersion } = require("../runtime/safety/api.guard");
const { executeMessage } =
require('../../execution/execution.engine');

async function processLiveMessage(payload) {

  const result =
    await executeMessage({
      sender: payload.sender,
      message: payload.message
    });

  return {
    to: payload.sender,
    reply: result
  };
}

module.exports = {
  processLiveMessage
};
