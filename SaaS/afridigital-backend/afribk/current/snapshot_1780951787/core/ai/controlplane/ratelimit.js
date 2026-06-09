const limits = {
  free: 10,
  pro: 100,
  enterprise: Infinity
};

const usage = new Map();

function allow(tenantId, plan) {
  const key = tenantId;
  const count = usage.get(key) || 0;

  if (count >= limits[plan]) return false;

  usage.set(key, count + 1);
  return true;
}

module.exports = { allow };
