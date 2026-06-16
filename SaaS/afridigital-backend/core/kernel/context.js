const path = require("path");

function resolveDomain(file) {
  if (!file) return "unknown";
  if (file.includes("/whatsapp/")) return "whatsapp";
  if (file.includes("/africore/")) return "africore";
  if (file.includes("/agents/")) return "agents";
  if (file.includes("/integrations/")) return "integrations";
  return "unknown";
}

module.exports = { resolveDomain };
