const registry = require("../manifest/manifest.registry");
const capabilities = require("../capability/capability.resolver");

class PluginCapabilityExecutor {

  start() {

    const registered = [];

    registry.list().forEach(plugin => {

      capabilities.register({
        id: plugin.id,
        capabilities: plugin.capabilities || []
      });

      registered.push({
        id: plugin.id,
        capabilities: plugin.capabilities || []
      });

    });

    return {
      ok: true,
      registered,
      total: registered.length,
      ts: Date.now()
    };

  }

}

module.exports = new PluginCapabilityExecutor();
