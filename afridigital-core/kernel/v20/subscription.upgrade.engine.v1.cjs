const { getPlan } = require("./subscription.plans.v1.cjs");

async function upgradeTenant(redis, tenantId, targetPlan) {

  const balanceKey = `tenant:${tenantId}:balance`;
  const planKey = `tenant:${tenantId}:plan`;

  const currentPlan = await redis.get(planKey) || "free";

  // Prevent downgrade via upgrade function
  const hierarchy = ["free", "pro", "enterprise"];
  const currentIndex = hierarchy.indexOf(currentPlan);
  const targetIndex = hierarchy.indexOf(targetPlan);

  if (targetIndex <= currentIndex) {
    return {
      status: "REJECTED",
      reason: "INVALID_UPGRADE_DIRECTION"
    };
  }

  const planData = getPlan(targetPlan);

  // Check wallet for upgrade cost
  const balance = parseFloat(await redis.get(balanceKey) || "0");

  if (balance < planData.monthlyCost) {
    return {
      status: "REJECTED",
      reason: "INSUFFICIENT_FUNDS",
      required: planData.monthlyCost,
      balance
    };
  }

  // Deduct upgrade cost
  await redis.set(balanceKey, balance - planData.monthlyCost);

  // Apply new plan
  await redis.set(planKey, targetPlan);

  // Apply bonus credits
  const newBalance = balance - planData.monthlyCost + planData.creditBonus;
  await redis.set(balanceKey, newBalance);

  return {
    status: "UPGRADED",
    tenantId,
    plan: targetPlan,
    balance: newBalance
  };
}

module.exports = { upgradeTenant };
