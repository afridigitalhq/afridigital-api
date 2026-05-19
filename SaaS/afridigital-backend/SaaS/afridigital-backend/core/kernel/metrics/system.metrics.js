const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function computeMetrics() {

  const ads =
    db.read('ads.db.json');

  const workflows =
    db.read('workflow.db.json');

  const users =
    db.read('users.db.json');

  return {
    adVolume: ads.length,
    workflowVolume: workflows.length,
    userBase: users.length,
    systemLoad: ads.length + workflows.length
  };
}

module.exports = {
  computeMetrics
};
