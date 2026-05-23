const { getPlan } = require("./subscription.plans.v1.cjs");

async function getSubscription(redis, tenantId) {
  const plan = await redis.get(`tenant:${tenantId}:plan`) || "free";
  const data = getPlan(plan);

  return {
    plan,
    ...data
  };
}

async function setSubscription(redis, tenantId, newPlan) {
  await redis.set(`tenant:${tenantId}:plan`, newPlan);
  return getSubscription(redis, tenantId);
}

module.exports = { getSubscription, setSubscription };
