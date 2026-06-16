const path = require("path");
const { isAllowed } = require("./policy");

function resolveDomain(filePath) {
  if (filePath.includes("/whatsapp/")) return "whatsapp";
  if (filePath.includes("/africore/")) return "africore";
  if (filePath.includes("/agents/")) return "agents";
  if (filePath.includes("/integrations/")) return "integrations";
  return "unknown";
}

function enforce(fromFile, toFile) {
  const from = resolveDomain(fromFile);
  const to = resolveDomain(toFile);

  if (!isAllowed(from, to)) {
    throw new Error(
      `V18_ENFORCEMENT_BLOCK: ${from} → ${to}`
    );
  }

  return true;
}

module.exports = { enforce, resolveDomain };
