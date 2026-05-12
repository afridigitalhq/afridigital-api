const { assertApiVersion } = require("../runtime/safety/api.guard");
const session =
require('../../session/session.engine');

const context =
require('../../context/context.engine');

async function processContext(payload) {

  session.createSession(
    payload.sender
  );

  const current =
    context.getContext(
      payload.sender
    );

  return {
    session: true,
    context: current || 'NONE'
  };
}

module.exports = {
  processContext
};
