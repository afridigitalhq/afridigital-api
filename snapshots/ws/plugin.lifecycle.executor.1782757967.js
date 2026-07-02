const lifecycle = require("../lifecycle/plugin.lifecycle");
const registry = require("../manifest/manifest.registry");

class PluginLifecycleExecutor {

  start() {

    const activated = [];

    registry.list().forEach(plugin => {

      lifecycle.set(plugin.id,"REGISTERED");
      lifecycle.set(plugin.id,"LOADED");
      lifecycle.set(plugin.id,"RUNNING");

      activated.push(plugin.id);

    });

    return {
      ok:true,
      activated,
      total:activated.length,
      ts:Date.now()
    };

  }

}

module.exports = new PluginLifecycleExecutor();
