const { assertApiVersion } = require("../runtime/safety/api.guard");
const db = require('../../database/db');

function detectThreat(activity) {

  let risk = 0;

  if (activity.failedLogin > 3) risk += 40;
  if (activity.requestRate > 50) risk += 30;
  if (activity.invalidActions > 5) risk += 20;

  return {
    risk,
    threat: risk > 60
  };
}

module.exports = {
  detectThreat
};
