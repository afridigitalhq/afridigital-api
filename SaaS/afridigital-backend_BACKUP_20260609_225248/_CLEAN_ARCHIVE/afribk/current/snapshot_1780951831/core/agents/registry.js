/**
 * AGENT REGISTRY v1
 * Defines available specialized agents
 */

const agents = {
  general: {
    name: "General Brain",
    role: "handles normal conversation + reasoning"
  },

  planner: {
    name: "Planner Agent",
    role: "breaks tasks into steps"
  },

  executor: {
    name: "Executor Agent",
    role: "runs tool/graph execution tasks"
  },

  critic: {
    name: "Critic Agent",
    role: "validates outputs and detects issues"
  }
};

function getAgent(name) {
  return agents[name] || agents.general;
}

function listAgents() {
  return Object.keys(agents);
}

module.exports = {
  getAgent,
  listAgents
};
