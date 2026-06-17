const { createSafeClient } = require("./safeClient");

const client = createSafeClient();

module.exports = {
  client,
  isEnabled: !!client
};
