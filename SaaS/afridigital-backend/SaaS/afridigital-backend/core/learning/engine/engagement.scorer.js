const { assertApiVersion } = require("../runtime/safety/api.guard");
const { getUserEvents } =
require('../tracker/behavior.tracker');

function calculateScore(phone) {

  const events =
    getUserEvents(phone);

  let score = 0;

  events.forEach(e => {

    if (e.event === 'message') score += 1;
    if (e.event === 'workflow_complete') score += 10;
    if (e.event === 'ad_click') score += 5;
    if (e.event === 'boost_created') score += 15;
  });

  return {
    phone,
    score
  };
}

module.exports = {
  calculateScore
};
