const { assertApiVersion } = require("../runtime/safety/api.guard");
const providers = {};

function registerProvider(name, adapter) {
  providers[name] = adapter;
  console.log(`📡 Provider Registered: ${name}`);
}

function getProvider(name) {
  return providers[name];
}

module.exports = {
  registerProvider,
  getProvider
};
