function analyzeMarket({ jobs = [], services = [], earn = [] }) {

  const analysis = {
    jobsCount: jobs.length,
    servicesCount: services.length,
    earnCount: earn.length,

    imbalance: null,
    score: 0
  };

  // SIMPLE SUPPLY/DEMAND MODEL
  const jobDemand = jobs.filter(j => j.views > 5).length;
  const earnSupply = earn.length;

  if (jobDemand > earnSupply) {
    analysis.imbalance = "EARN_SUPPLY_LOW";
    analysis.score = jobDemand / (earnSupply || 1);
  }

  if (services.length < jobs.length * 0.5) {
    analysis.imbalance = "SERVICE_SHORTAGE";
  }

  return analysis;
}

module.exports = { analyzeMarket };
