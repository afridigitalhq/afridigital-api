const { expectedRevenue } = require("./revenue.objective.v6.cjs");

async function executeRevenueAction(redis, message, score, routing) {

  const projected = expectedRevenue(score.score, 100);

  const event = {
    user: message.user,
    action: routing.action,
    lane: routing.lane,
    projectedRevenue: projected,
    score: score.score
  };

  await redis.xAdd("revenue:events", "*", {
    data: JSON.stringify(event)
  });

  return event;
}

module.exports = { executeRevenueAction };
