const registry = require("../manifest/manifest.registry");
const subscriptions = require("../subscription/plugin.subscription.manager");

class PluginSubscriptionExecutor {

  start() {

    const wired = [];

    registry.list().forEach(plugin => {

      (plugin.subscriptions || []).forEach(eventType => {
        subscriptions.subscribe(plugin.id, eventType);
      });

      wired.push({
        id: plugin.id,
        subscriptions: plugin.subscriptions || []
      });

    });

    return {
      ok: true,
      wired,
      total: wired.length,
      ts: Date.now()
    };

  }

}

module.exports = new PluginSubscriptionExecutor();
