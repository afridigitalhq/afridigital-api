const { getPlan } = require("./subscription.plans.v1.cjs");

async function enforcePlan(redis, tenantId, action) {

  const plan = await redis.get(`tenant:${tenantId}:plan`) || "free";
  const config = getPlan(plan);

  const usage = parseInt(await redis.get(`tenant:${tenantId}:usage`) || "0");

  if (usage >= config.limit) {
    return {
      allowed: false,
      reason: "PLAN_LIMIT_REACHED",
      plan
    };
  }

  return {
    allowed: true,
    plan
  };
}

module.exports = { enforcePlan };
