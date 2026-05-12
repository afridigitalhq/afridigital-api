const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');
const { detectThreat } =
require('../engine/threat.engine');
const { blockUser } =
require('../firewall/firewall.engine');

function logActivity(userId, activity) {

  const logs =
    db.read('security.logs.json');

  logs.push({
    userId,
    activity,
    timestamp: Date.now()
  });

  db.write('security.logs.json', logs);

  const result =
    detectThreat(activity);

  if (result.threat) {

    blockUser(userId, 'AUTO_THREAT_DETECTED');
  }

  return result;
}

module.exports = {
  logActivity
};
