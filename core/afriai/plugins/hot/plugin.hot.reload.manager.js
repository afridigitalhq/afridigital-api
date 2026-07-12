const registry = require("../manifest/manifest.registry");
const runtime = require("../runtime/plugin.runtime");
const activator = require("../activator/manifest.activator");
const lifecycle = require("../lifecycle/plugin.lifecycle");

class PluginHotReloadManager {

  reload(id) {

    // 1. STOP IF RUNNING
    try {
      const plugin = runtime.get?.(id);
      if (plugin && plugin.instance?.stop) {
        plugin.instance.stop();
      }
    } catch (e) {}

    // 2. DEACTIVATE
    try {
      activator.deactivate(id);
    } catch (e) {}

    // 3. RESET LIFECYCLE
    lifecycle.set(id, "RELOADING");

    // 4. RE-ACTIVATE CLEANLY
    const result = activator.activate(id);

    // 5. MARK RUNNING
    lifecycle.set(id, "RUNNING");

    return {
      ok: true,
      reloaded: id,
      result
    };
  }

  unload(id) {

    try {
      const plugin = runtime.get?.(id);
      if (plugin?.instance?.stop) {
        plugin.instance.stop();
      }
    } catch (e) {}

    try {
      activator.deactivate(id);
    } catch (e) {}

    lifecycle.set(id, "UNLOADED");

    return { ok: true, unloaded: id };
  }

  status(id) {
    return lifecycle.get(id);
  }
}

module.exports = new PluginHotReloadManager();
