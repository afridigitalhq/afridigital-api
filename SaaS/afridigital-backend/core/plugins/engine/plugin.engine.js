const { assertApiVersion } = require("../runtime/safety/api.guard");
const { loadPlugin } =
require('../loader/plugin.loader');

function executePlugin(name, data) {

  const plugin =
    loadPlugin(name);

  if (!plugin) {

    return '⚠️ Plugin not found';
  }

  return plugin.run(data);
}

module.exports = {
  executePlugin
};
