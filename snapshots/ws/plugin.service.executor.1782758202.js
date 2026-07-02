const registry = require("../manifest/manifest.registry");
const locator = require("../service/service.locator");

class PluginServiceExecutor {

  start() {

    const published = [];

    registry.list().forEach(plugin => {

      (plugin.capabilities || []).forEach(capability => {

        locator.register(capability,{
          module: plugin.id
        });

      });

      published.push({
        id: plugin.id,
        services: plugin.capabilities || []
      });

    });

    return {
      ok:true,
      published,
      total:published.length,
      ts:Date.now()
    };

  }

}

module.exports = new PluginServiceExecutor();
