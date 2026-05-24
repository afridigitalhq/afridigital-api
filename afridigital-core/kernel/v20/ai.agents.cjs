const { classifyIntent, riskScore } = require("./ai.intelligence.cjs");

function FraudAgent(message) {
  const risk = riskScore(message.text);

  if (risk > 0.7) {
    return { action: "DROP", reason: "high_risk" };
  }

  return null;
}

function SupportAgent(message) {
  const t = (message.text || "").toLowerCase();

  if (t.includes("help") || t.includes("error") || t.includes("issue")) {
    return { action: "PRIORITY", lane: "wa:outbox" };
  }

  return null;
}

function SalesAgent(message) {
  const t = (message.text || "").toLowerCase();

  if (t.includes("buy") || t.includes("price") || t.includes("order")) {
    return { action: "PRIORITY", lane: "wa:outbox", tag: "sales" };
  }

  return null;
}

function ConversationAgent(message) {
  return {
    action: "NORMAL",
    lane: "wa:delay"
  };
}

function SystemAgent(message) {
  if (message.text?.startsWith("/")) {
    return { action: "SYSTEM", lane: "internal" };
  }
  return null;
}

async function dispatch(redis, message) {
  const agents = [FraudAgent, SystemAgent, SupportAgent, SalesAgent, ConversationAgent];

  const results = [];
  const memoryMap = {};

  for (const agent of agents) {
    const res = agent(message);
    if (!res) continue;

    const mem = await getMemory(redis, agent.name || "anon", message.user);
    memoryMap[agent.name || "anon"] = mem;

    results.push({ agent: agent.name || "anon", ...res });
  }

  const final = coordinate(results, memoryMap);

  return final;
}
        agent: agent.name,
        ...result
      };
    }
  }

  return {
    agent: "Fallback",
    action: "NORMAL",
    lane: "wa:delay"
  };
}

module.exports = { dispatch };
