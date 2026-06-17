const fs = require('fs');
const path = require('path');
const sandbox = require('../sandbox/engine');

const registry = new Map();

function loadPlugin(name, filePath) {
  delete require.cache[require.resolve(filePath)];

  const plugin = require(filePath);
  plugin.__path = filePath;

  const safe = sandbox.execute(plugin);

  registry.set(name, safe);

  console.log(`🔁 Plugin loaded: ${name}`);
  return safe;
}

function reloadPlugin(name) {
  const plugin = registry.get(name);
  if (!plugin) throw new Error('Plugin not found');

  return loadPlugin(name, plugin.__path);
}

function swapPlugin(name, newPath) {
  return loadPlugin(name, newPath);
}

function getPlugin(name) {
  return registry.get(name);
}

module.exports = {
  loadPlugin,
  reloadPlugin,
  swapPlugin,
  getPlugin
};
