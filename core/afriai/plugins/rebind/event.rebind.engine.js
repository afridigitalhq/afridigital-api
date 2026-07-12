const router = require("../router/plugin.event.router");
const subs = require("../subscription/plugin.subscription.manager");
const registry = require("../manifest/manifest.registry");

class EventRebindEngine {

  rebindAll(registryRef = registry) {

    const snapshot = subs.snapshot();
    const rebound = [];

    Object.keys(snapshot).forEach(eventType => {
      const modules = snapshot[eventType];

      modules.forEach(moduleId => {

        // 🟢 DO NOT BLOCK ON REGISTRY
        const manifest = registryRef.get(moduleId);

        router.on(moduleId, (event) => {

          const locator = require("../service/service.locator");
          const service = locator.resolve(eventType);

          if (service && service.service && service.service.start) {
            service.service.start(event);
          }

        });

        rebound.push(`${moduleId}:${eventType}`);

      });

    });

    return {
      ok: true,
      rebound,
      ts: Date.now()
    };
  }
}

module.exports = new EventRebindEngine();
