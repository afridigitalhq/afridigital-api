const agents = require("./brain.v4.agents");

async function plan(user, message) {

  const selected = agents.selectAgent();

  return {
    agent: selected,
    intent: message,
    priority: selected === "fraud" ? "high" : "normal"
  };
}

module.exports = { plan };
