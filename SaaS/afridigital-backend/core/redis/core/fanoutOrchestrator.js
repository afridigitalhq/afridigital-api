const bus = require("../streamBus");
const { streamLLM } = require("../../llm/streamingProvider");

/**
 * 🟣 TOKEN-LEVEL MULTI-AGENT FANOUT ENGINE
 */

async function runFanout({ user, text }) {

  const agents = {
    planner: "You are a planner agent",
    executor: "You are an executor agent",
    critic: "You are a critic agent",
    narrator: "You are a narrator agent"
  };

  const results = await Promise.all(
    Object.entries(agents).map(([name, role]) => {

      return streamLLM({
        role,
        prompt: text,
        user,
        agent: name
      });
    })
  );

  const final = results.join("\n\n");

  await bus.publish("stream:final", {
    user,
    text: final
  });

  return final;
}

module.exports = { runFanout };
