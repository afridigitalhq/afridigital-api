const { assertApiVersion } = require("../runtime/safety/api.guard");
const plugins = {};

function registerPlugin(name, plugin) {
  plugins[name] = plugin;
}

function getPlugin(name) {
  return plugins[name] || null;
}

function listPlugins() {
  return Object.keys(plugins);
}

module.exports = {
  registerPlugin,
  getPlugin,
  listPlugins
};
