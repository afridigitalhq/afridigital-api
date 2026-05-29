const { getAgent } = require('./registry');
const { runBrain } = require('../ai/brain');
const { safeExecute } = require('../tools/safeExecutor');

/**
 * MULTI-AGENT COORDINATOR v1
 */

async function coordinate(payload, context = {}) {

  const text = payload.text || "";

  // 1. SIMPLE ROUTING LOGIC (v1 heuristic)
  let assignedAgent = "general";

  if (text.includes("plan") || text.includes("steps")) {
    assignedAgent = "planner";
  }

  if (text.includes("run") || text.includes("execute")) {
    assignedAgent = "executor";
  }

  if (text.includes("check") || text.includes("verify")) {
    assignedAgent = "critic";
  }

  const agent = getAgent(assignedAgent);

  console.log("🤖 AGENT SELECTED:", agent.name);

  // 2. EXECUTION STRATEGY
  switch (assignedAgent) {

    /**
     * PLANNER AGENT
     */
    case "planner": {
      const plan = await runBrain({
        ...payload,
        mode: "planning"
      });

      return {
        agent: assignedAgent,
        output: plan
      };
    }

    /**
     * EXECUTOR AGENT
     */
    case "executor": {
      const result = await safeExecute(
        payload.from,
        "echoTool",
        { text: payload.text }
      );

      return {
        agent: assignedAgent,
        output: result
      };
    }

    /**
     * CRITIC AGENT
     */
    case "critic": {
      const analysis = await runBrain({
        ...payload,
        mode: "critique"
      });

      return {
        agent: assignedAgent,
        output: analysis
      };
    }

    /**
     * DEFAULT GENERAL AGENT
     */
    default: {
      const response = await runBrain(payload);

      return {
        agent: "general",
        output: response
      };
    }
  }
}

module.exports = {
  coordinate
};
