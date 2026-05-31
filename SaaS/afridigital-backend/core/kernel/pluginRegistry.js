const fs = require('fs');
const path = require('path');

const registry = {
  cache: {},
  meta: {}
};

/**
 * Load plugin fresh (NO require cache)
 */
function loadPlugin(pluginPath) {
  const abs = path.resolve(process.cwd(), pluginPath);

  // bust node cache
  delete require.cache[require.resolve(abs)];

  const mod = require(abs);

  registry.cache[pluginPath] = mod;
  return mod;
}

/**
 * Get plugin (cached runtime)
 */
function get(pluginPath) {
  if (!registry.cache[pluginPath]) {
    return loadPlugin(pluginPath);
  }
  return registry.cache[pluginPath];
}

/**
 * Hot reload plugin
 */
function reload(pluginPath) {
  console.log('♻️ HOT RELOAD:', pluginPath);
  return loadPlugin(pluginPath);
}

/**
 * Swap plugin implementation at runtime
 */
function swap(pluginPath, newPath) {
  console.log('🔁 SWAP:', pluginPath, '→', newPath);

  delete registry.cache[pluginPath];

  const mod = loadPlugin(newPath);
  registry.cache[pluginPath] = mod;

  return mod;
}

module.exports = {
  get,
  loadPlugin,
  reload,
  swap
};
