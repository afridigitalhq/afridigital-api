const Services = require("../registry/services.registry.cjs"); const { handleIncomingMessage } = require("../../modules/chat"); console.log("AFRI SHIELD ACTIVE");
  processing = false;
}

// =========================
// EXPORT CORE
// =========================
module.exports = {
  enqueue,
  processQueue
};
