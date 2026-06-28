const { validateProductionSafety } = require("../feature-flags/store");

function evaluateCI() {
  const flags = validateProductionSafety();

  return {
    deploy: flags.safe,
    warnings: flags.issues,
    timestamp: Date.now()
  };
}

module.exports = { evaluateCI };

function logWhatsAppRequest(message, role, result) {
  console.log("[WHATSAPP-CI]", {
    message,
    role,
    approved: result.deploy
  });
}

module.exports.logWhatsAppRequest = logWhatsAppRequest;
