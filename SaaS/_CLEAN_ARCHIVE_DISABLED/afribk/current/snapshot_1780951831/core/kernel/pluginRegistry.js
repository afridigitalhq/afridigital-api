const plugins = new Map();

function loadPlugin(name, plugin) {
  plugins.set(name, plugin);
  return true;
}

function reload(name) {
  if (!plugins.has(name)) return false;
  const p = plugins.get(name);
  plugins.set(name, p);
  return true;
}

function swap(name, plugin) {
  plugins.set(name, plugin);
  return true;
}

function get(name) {
  return plugins.get(name);
}

module.exports = {
  loadPlugin,
  reload,
  swap,
  get
};
