/**
 * 🧪 Multi-Agent Marketplace Simulation Lab
 * ADMIN ONLY SANDBOX ENVIRONMENT
 */

function cloneState(baseState) {
  return JSON.parse(JSON.stringify(baseState));
}

/**
 * Simple agent simulation model
 */
function runSimulation(config) {

  const {
    users = 50,
    jobMultiplier = 1,
    boostMultiplier = 1
  } = config;

  let economy = {
    jobs: 100 * jobMultiplier,
    earnings: 1000,
    boosts: 20 * boostMultiplier
  };

  const agents = [];

  for (let i = 0; i < users; i++) {

    const agent = {
      id: i,
      action: Math.random() > 0.5 ? "EARN" : "SPEND"
    };

    if (agent.action === "EARN") {
      economy.earnings += Math.random() * 100;
    } else {
      economy.earnings -= Math.random() * 50;
    }

    agents.push(agent);
  }

  return {
    config,
    result: economy,
    agents,
    summary: {
      finalEarnings: economy.earnings,
      jobPressure: economy.jobs / users,
      boostPressure: economy.boosts / users
    }
  };
}

module.exports = {
  runSimulation
};
