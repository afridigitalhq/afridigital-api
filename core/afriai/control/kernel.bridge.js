const runtime = require("../plugins/runtime/plugin.runtime");

function execute(command) {

  switch(command.action) {

    case "PLUGIN_START":
      return runtime.start(command.target);

    case "PLUGIN_STOP":
      return runtime.stop(command.target);

    case "PLUGIN_UNLOAD":
      return runtime.unload(command.target);

    default:
      return { ok: false, error: "UNKNOWN_ACTION" };
  }
}

module.exports = { execute };
