const { emit } =
require('../../eventbus/engine/event.bus');

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
