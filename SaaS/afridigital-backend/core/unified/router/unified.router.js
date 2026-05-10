const { orchestrate } =
require('../../orchestrator/router/router.engine');

const { buildContext } =
require('../context/channel.context');

async function handleUnified(input) {

  const context =
    buildContext(input);

  const payload = {
    sender: context.user,
    message: context.message,
    channel: context.channel,
    raw: input
  };

  return orchestrate(payload);
}

module.exports = {
  handleUnified
};
