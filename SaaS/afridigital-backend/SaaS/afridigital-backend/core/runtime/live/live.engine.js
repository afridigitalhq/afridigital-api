const { assertApiVersion } = require("../runtime/safety/api.guard");
const { emit } =
// removed legacy eventbus dependency;

const { orchestrate } =
require('../../orchestrator/router/router.engine');

async function handleLiveMessage(payload) {

  emit('message_received', payload);

  const response =
    await orchestrate(payload);

  emit('message_processed', {
    payload,
    response
  });

  return response;
}

module.exports = {
  handleLiveMessage
};
