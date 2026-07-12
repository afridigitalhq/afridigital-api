class PluginRuntime {
  constructor() {
    this.plugins = new Map();
  }

  register(plugin) {
    if (!plugin || !plugin.id) throw new Error("INVALID_PLUGIN");

    this.plugins.set(plugin.id, {
      ...plugin,
      status: "REGISTERED",
      instance: null
    });

    console.log(`🧩 REGISTERED: ${plugin.id}`);
  }

  start(id, context = {}) {
    const plugin = this.plugins.get(id);
    if (!plugin) return { ok: false, error: "NOT_FOUND" };

    if (plugin.instance?.start) {
      plugin.instance.start(context);
    }

    plugin.status = "ACTIVE";

    console.log(`🟢 PLUGIN STARTED: ${id}`);
    return { ok: true };
  }

  stop(id) {
    const plugin = this.plugins.get(id);
    if (!plugin) return { ok: false, error: "NOT_FOUND" };

    if (plugin.instance?.stop) {
      plugin.instance.stop();
    }

    plugin.status = "INACTIVE";

    console.log(`🟡 PLUGIN STOPPED: ${id}`);
    return { ok: true };
  }

  unload(id) {
    const plugin = this.plugins.get(id);
    if (!plugin) return { ok: false, error: "NOT_FOUND" };

    this.stop(id);
    this.plugins.delete(id);

    console.log(`🔴 PLUGIN UNLOADED: ${id}`);
    return { ok: true };
  }

  list() {
    return Array.from(this.plugins.values()).map(p => ({
      id: p.id,
      status: p.status
    }));
  }
}

module.exports = new PluginRuntime();
