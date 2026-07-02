const discovery = require("../discovery/manifest.discovery");
const loader = require("../loader/manifest.loader");
const registry = require("../manifest/manifest.registry");

class PluginBootManager {
  inspect(manifestDir) {
    const discovered = discovery.discover(manifestDir);

    return {
      ok: true,
      discovered,
      total: discovered.length,
      ts: Date.now()
    };
  }

  load(manifestDir) {
    const result = loader.load(manifestDir);

    return {
      ok: result.ok,
      loaded: result.loaded,
      total: registry.list().length,
      ts: Date.now()
    };
  }
}

module.exports = new PluginBootManager();
