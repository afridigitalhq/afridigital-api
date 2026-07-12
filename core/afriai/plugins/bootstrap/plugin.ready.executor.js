const registry = require("../manifest/manifest.registry");
const router = require("../router/plugin.event.router");

class PluginReadyExecutor {

  start() {

    const ready = [];

    registry.list().forEach(plugin => {

      const event = {
        source: "KERNEL",
        target: plugin.id,
        type: "PLUGIN_READY",
        payload: {
          id: plugin.id,
          status: "READY"
        },
        ts: Date.now()
      };

      router.dispatch(
        event.source,
        event.target,
        event.type,
        event.payload
      );

      ready.push(plugin.id);

    });

    return {
      ok: true,
      ready,
      total: ready.length,
      ts: Date.now()
    };

  }

}

module.exports = new PluginReadyExecutor();
