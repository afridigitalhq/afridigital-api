const { assertApiVersion } = require("../runtime/safety/api.guard");
const { getPlugin } =
require('../registry/plugin.registry');

function loadPlugin(name) {

  const plugin =
    getPlugin(name);

  if (!plugin) {
    return null;
  }

  return plugin;
}

module.exports = {
  loadPlugin
};
