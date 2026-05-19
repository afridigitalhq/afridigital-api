const { assertApiVersion } = require("../runtime/safety/api.guard");
exports.validateMessage = (msg) => {
  if (!msg) return false;
  if (!msg.from) return false;
  if (!msg.text?.body && !msg.text) return false;
  return true;
};
