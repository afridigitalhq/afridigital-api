const registry = require("../manifest/manifest.registry");
const health = require("../health/plugin.health");

class PluginHealthExecutor {

  start() {

    const initialized = [];

    registry.list().forEach(plugin => {

      health.update(plugin.id,"HEALTHY");

      initialized.push(plugin.id);

    });

    return {
      ok:true,
      initialized,
      total:initialized.length,
      ts:Date.now()
    };

  }

}

module.exports = new PluginHealthExecutor();
