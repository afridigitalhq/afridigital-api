class PluginIndex {
  constructor() {
    this.plugins = new Map();
  }

  add(plugin) {
    this.plugins.set(plugin.id, plugin);
    return plugin;
  }

  get(id) {
    return this.plugins.get(id) || null;
  }

  remove(id) {
    return this.plugins.delete(id);
  }

  exists(id) {
    return this.plugins.has(id);
  }

  all() {
    return [...this.plugins.values()];
  }

  count() {
    return this.plugins.size;
  }
}

module.exports = new PluginIndex();
