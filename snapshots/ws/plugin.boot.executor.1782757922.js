const pipeline = require("./plugin.boot.pipeline");
const registry = require("../manifest/manifest.registry");
const runtime = require("../runtime/plugin.runtime");

class PluginBootExecutor {
  boot(manifestDir) {
    const report = pipeline.start(manifestDir);

    if (!report.ok) return report;

    const started = [];

    registry.list().forEach(plugin => {
      const instance = runtime.get(plugin.id);

      if (instance) {
        runtime.start(plugin.id);
        started.push(plugin.id);
      }
    });

    return {
      ok: true,
      stage: "RUNTIME_BOOT_COMPLETE",
      started,
      discovered: report.inspect.total,
      loaded: report.load.total,
      ts: Date.now()
    };
  }
}

module.exports = new PluginBootExecutor();
