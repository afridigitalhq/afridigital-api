const { assertApiVersion } = require("../runtime/safety/api.guard");
function buildContext(input) {

  return {
    channel: input.channel || 'whatsapp',
    user: input.user,
    message: input.message,
    timestamp: Date.now()
  };
}

module.exports = {
  buildContext
};
