const { emit } = require("../core/event-engine/engine");

function hookDeploy(service) {
  emit("DEPLOY", service, "LIVE", "deployment triggered");
}

module.exports = { hookDeploy };
