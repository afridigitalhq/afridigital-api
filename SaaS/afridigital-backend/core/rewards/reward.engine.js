const { assertApiVersion } = require("../runtime/safety/api.guard");
function calculateEngagementReward(actions) {

  return actions * 2;
}

module.exports = { calculateEngagementReward };
