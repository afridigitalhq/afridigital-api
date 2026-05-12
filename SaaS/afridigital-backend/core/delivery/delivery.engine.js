const { assertApiVersion } = require("../runtime/safety/api.guard");
const { getProvider } =
require('../providers/provider.manager');

async function deliver(platform, to, message) {

  const provider =
    getProvider(platform);

  if (!provider) {
    throw new Error(
      'provider_not_found'
    );
  }

  return provider.sendMessage(
    to,
    message
  );
}

module.exports = { deliver };
