const { emit } = require("../telemetry/afriscan.stream");

/**
 * 🧠 Render CI Log Bridge
 * Converts server logs into AFRISCAN graph events
 */
function attachRenderCI(logger = console) {

  const wrap = (type) => (msg) => {
    emit("render_ci_log", {
      level: type,
      message: msg,
      source: "render-ci"
    });
  };

  logger.log = wrap("info");
  logger.error = wrap("error");
  logger.warn = wrap("warn");

  console.log("🧠 AFRISCAN CI BRIDGE ACTIVE");
}

module.exports = { attachRenderCI };
