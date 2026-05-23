const { scoreMessage } = require("./revenue.scorer.v6.cjs");
const { routeByRevenue } = require("./revenue.router.v6.cjs");
const { executeRevenueAction } = require("./revenue.executor.v6.cjs");
const { getCustomerValue } = require("./customer.value.v6.cjs");

async function runSwarmV6(redis, message, tenantId) {

  const customer = await getCustomerValue(redis, tenantId, message.user);

  const score = await scoreMessage(redis, message, customer);

  const routing = routeByRevenue(score.score);

  const result = await executeRevenueAction(redis, message, score, routing);

  return {
    score,
    routing,
    result
  };
}

module.exports = { runSwarmV6 };
