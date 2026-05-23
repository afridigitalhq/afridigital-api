const PLANS = {
  free: {
    name: "free",
    monthlyCost: 0,
    creditBonus: 100,
    limit: 100
  },

  pro: {
    name: "pro",
    monthlyCost: 10000,
    creditBonus: 5000,
    limit: 5000
  },

  enterprise: {
    name: "enterprise",
    monthlyCost: 50000,
    creditBonus: 50000,
    limit: 50000
  }
};

function getPlan(plan) {
  return PLANS[plan] || PLANS.free;
}

module.exports = { PLANS, getPlan };
