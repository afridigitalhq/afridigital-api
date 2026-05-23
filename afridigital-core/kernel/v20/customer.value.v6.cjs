async function getCustomerValue(redis, tenantId, userId) {
  const key = `tenant:${tenantId}:value:${userId}`;

  const data = await redis.get(key);

  return data ? JSON.parse(data) : {
    ltv: 0.2,
    engagement: 0.2,
    churnRisk: 0.5,
    conversions: 0
  };
}

async function updateCustomerValue(redis, tenantId, userId, update) {
  const key = `tenant:${tenantId}:value:${userId}`;

  const current = await getCustomerValue(redis, tenantId, userId);

  const merged = {
    ...current,
    ...update,
    conversions: current.conversions + (update.conversion ? 1 : 0)
  };

  await redis.set(key, JSON.stringify(merged));
  return merged;
}

module.exports = { getCustomerValue, updateCustomerValue };
