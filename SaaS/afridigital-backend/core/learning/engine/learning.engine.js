const { assertApiVersion } = require("../runtime/safety/api.guard");
const tracker =
require('../tracker/behavior.tracker');

const scorer =
require('./engagement.scorer');

function learn(phone, event, data) {

  tracker.trackEvent(phone, event, data);

  const score =
    scorer.calculateScore(phone);

  return score;
}

module.exports = {
  learn
};
