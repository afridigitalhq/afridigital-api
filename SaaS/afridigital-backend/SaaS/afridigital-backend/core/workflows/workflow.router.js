const { assertApiVersion } = require("../runtime/safety/api.guard");
const workflow =
require('./state/workflow.state');

const boost =
require('./engines/boost.workflow');

async function handleWorkflow(
  sender,
  message
) {

  const active =
    workflow.getWorkflow(sender);

  if (!active) {

    if (
      message.toLowerCase() === 'boost'
    ) {

      return boost.startBoost(
        sender
      );
    }

    return null;
  }

  if (
    active.type === 'BOOST'
  ) {

    return boost.continueBoost(
      sender,
      message
    );
  }

  return null;
}

module.exports = {
  handleWorkflow
};
