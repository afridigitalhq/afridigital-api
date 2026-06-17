const Audit = require("../db/mongo/Audit");
const { isDBConnected } = require("../db/mongo/client");
const { saveAudit } = require("../db/fallbackStore");

async function logEvent(event) {
  if (!isDBConnected()) {
    console.log("🟡 Audit → Memory fallback");
    return saveAudit(event);
  }

  return await Audit.create(event);
}

module.exports = { logEvent };
