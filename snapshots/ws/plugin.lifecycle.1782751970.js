class PluginLifecycle {
  constructor() {
    this.state = new Map();
  }

  set(id, status) {
    this.state.set(id, {
      id,
      status,
      ts: Date.now()
    });

    return this.state.get(id);
  }

  get(id) {
    return this.state.get(id) || null;
  }

  all() {
    return Array.from(this.state.values());
  }

  clear(id) {
    this.state.delete(id);
  }
}

module.exports = new PluginLifecycle();
