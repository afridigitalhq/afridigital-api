/**
 * 🔵 RENDER CI STREAM ADAPTER
 * converts deploy logs → AFRISCAN graph events
 */

const { normalize } = require("../schema/event.schema");

function formatRenderLog(log) {
  return normalize("render_ci_log", {
    level: log.level || "info",
    message: log.message || "",
    service: "render"
  });
}

module.exports = {
  formatRenderLog
};
