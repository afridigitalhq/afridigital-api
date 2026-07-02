class PluginStateAggregator {
  aggregate({
    manifest = {},
    lifecycle = null,
    health = null
  }) {
    return {
      id: manifest.id || null,
      name: manifest.name || null,
      version: manifest.version || null,
      type: manifest.type || null,

      status: lifecycle ? lifecycle.status : "UNKNOWN",
      health: health ? health.status : "UNKNOWN",

      capabilities: manifest.capabilities || [],
      permissions: manifest.permissions || [],
      dependencies: manifest.dependencies || [],

      hotPlug: !!manifest.hotPlug,
      autoload: !!manifest.autoload,

      ts: Date.now()
    };
  }
}

module.exports = new PluginStateAggregator();
