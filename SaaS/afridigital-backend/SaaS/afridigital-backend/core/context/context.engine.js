const { assertApiVersion } = require("../runtime/safety/api.guard");
const memory =
require('../memory/memory.engine');

function setContext(phone, context) {

  memory.remember(
    phone,
    'context',
    context
  );
}

function getContext(phone) {

  return memory.recall(
    phone,
    'context'
  );
}

module.exports = {
  setContext,
  getContext
};
