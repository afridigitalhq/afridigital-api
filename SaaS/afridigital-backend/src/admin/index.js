const { isDBConnected } = require("../db/mongo/client");
const { getStats } = require("../db/fallbackStore");
const Message = require("../db/mongo/Message");
const Audit = require("../db/mongo/Audit");

async function getAdminStats(req, res) {

  if (!isDBConnected()) {
    return res.json({
      status: "DEGRADED_MODE",
      ...getStats()
    });
  }

  const messages = await Message.countDocuments();
  const audits = await Audit.countDocuments();

  res.json({
    status: "PRODUCTION_MODE",
    messages,
    audits
  });
}

module.exports = { getAdminStats };
