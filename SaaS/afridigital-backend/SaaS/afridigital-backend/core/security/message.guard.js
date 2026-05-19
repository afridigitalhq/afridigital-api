const { assertApiVersion } = require("../runtime/safety/api.guard");
exports.validateMessage = (msg) => {
  if (!msg) return false;
  if (!msg.from) return false;
  if (!msg.text?.body) return false;

  // prevent empty spam
  if (msg.text.body.trim().length === 0) return false;

  return true;
};
