const registry = require("../manifest/manifest.registry");
const router = require("../router/plugin.event.router");

class PluginRouterExecutor {

  start() {

    const connected = [];

    registry.list().forEach(plugin => {

      router.on(plugin.id, () => {});

      connected.push(plugin.id);

    });

    return {
      ok: true,
      connected,
      total: connected.length,
      ts: Date.now()
    };

  }

}

module.exports = new PluginRouterExecutor();
