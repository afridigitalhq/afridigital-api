const { assertApiVersion } = require("../runtime/safety/api.guard");
const { installPlugin } =
require('../store/plugin.store');

function purchasePlugin(plugin) {

  console.log('🛒 Installing Plugin:', plugin.name);

  installPlugin(plugin);

  return {
    success: true,
    message: 'Plugin installed'
  };
}

module.exports = {
  purchasePlugin
};
