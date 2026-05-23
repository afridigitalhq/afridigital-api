const { getTenantMemory, updateTenantMemory } = require("./tenant.memory.cjs");

/**
 * Base Agent
 */
class BaseAgent {
  constructor(name) {
    this.name = name;
  }

  async run(message, memory) {
    return { agent: this.name, action: "IGNORE", confidence: 0 };
  }
}

/**
 * Support Agent
 */
class SupportAgent extends BaseAgent {
  constructor() {
    super("SupportAgent");
  }

  async run(message, memory) {
    const t = (message.text || "").toLowerCase();

    if (t.includes("error") || t.includes("problem") || t.includes("help")) {
      return {
        agent: this.name,
        action: "HANDLE_SUPPORT",
        confidence: 0.9
      };
    }

    return { agent: this.name, action: "IGNORE", confidence: 0.2 };
  }
}

/**
 * Sales Agent
 */
class SalesAgent extends BaseAgent {
  constructor() {
    super("SalesAgent");
  }

  async run(message, memory) {
    const t = (message.text || "").toLowerCase();

    let score = 0;

    if (t.includes("price") || t.includes("buy") || t.includes("cost")) score += 0.5;
    if (t.includes("plan") || t.includes("upgrade")) score += 0.3;

    if ((memory?.trust || 0) > 3) score += 0.2;

    if (score > 0.6) {
      return {
        agent: this.name,
        action: "HANDLE_SALES",
        confidence: score
      };
    }

    return { agent: this.name, action: "IGNORE", confidence: score };
  }
}

/**
 * Ops Agent
 */
class OpsAgent extends BaseAgent {
  constructor() {
    super("OpsAgent");
  }

  async run(message, memory) {
    if ((memory?.risk || 0) > 3) {
      return {
        agent: this.name,
        action: "FLAG_USER",
        confidence: 0.95
      };
    }

    return { agent: this.name, action: "IGNORE", confidence: 0.1 };
  }
}

/**
 * Supervisor (Arbiter)
 */
class Supervisor {
  pick(results) {
    const valid = results.filter(r => r.action !== "IGNORE");

    if (valid.length === 0) {
      return { agent: "Fallback", action: "DEFAULT_REPLY", confidence: 0.1 };
    }

    return valid.sort((a, b) => b.confidence - a.confidence)[0];
  }
}

/**
 * Swarm Engine
 */
async function runSwarm(redis, message) {
  const memory = await getTenantMemory(redis, message.tenantId || "default", message.user);

  const agents = [
    new SupportAgent(),
    new SalesAgent(),
    new OpsAgent()
  ];

  const results = [];

  for (const agent of agents) {
    results.push(await agent.run(message, memory));
  }

  const supervisor = new Supervisor();
  const decision = supervisor.pick(results);

  await updateTenantMemory(redis, message.tenantId || "default", message.user, {
    lastAgent: decision.agent,
    lastAction: decision.action
  });

  return decision;
}

module.exports = { runSwarm };
