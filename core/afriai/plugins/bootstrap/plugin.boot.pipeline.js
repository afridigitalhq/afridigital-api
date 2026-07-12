const boot = require("./plugin.boot.manager");

class PluginBootPipeline {
  start(manifestDir) {
    const inspect = boot.inspect(manifestDir);

    if (!inspect.ok) {
      return {
        ok: false,
        stage: "INSPECT",
        report: inspect
      };
    }

    const load = boot.load(manifestDir);

    if (!load.ok) {
      return {
        ok: false,
        stage: "LOAD",
        report: load
      };
    }

    return {
      ok: true,
      stage: "BOOT_COMPLETE",
      inspect,
      load,
      ts: Date.now()
    };
  }
}

module.exports = new PluginBootPipeline();
