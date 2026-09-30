const agents = new Map();

function initializeFromEnv() {
  const id = process.env.A2A_AGENT_ID;
  if (!id || agents.has(id)) return agents.get(id) || null;

  return AfriAgentIdentityRegistry.register({
    id,
    name: process.env.A2A_AGENT_NAME || "AfriAI Beta Agent",
    organizationId: process.env.A2A_AGENT_ORGANIZATION_ID || null,
    capabilities: ["debug.analyze", "afriai.ask"]
  });
}

const AfriAgentIdentityRegistry = {

  register(input = {}) {
    const id = input.id || `AGENT-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

    const agent = {
      id,
      name: input.name || "Unnamed Agent",
      organizationId: input.organizationId || null,
      publicKey: input.publicKey || null,
      status: "ACTIVE",
      capabilities: Array.isArray(input.capabilities) ? input.capabilities : [],
      createdAt: Date.now()
    };

    agents.set(id, agent);
    return agent;
  },

  get(id) {
    return agents.get(id) || null;
  },

  revoke(id) {
    const agent = agents.get(id);

    if (!agent) return null;

    agent.status = "REVOKED";
    agent.revokedAt = Date.now();

    return agent;
  },

  list() {
    return [...agents.values()];
  },

  initializeFromEnv,

  stats() {
    const all = [...agents.values()];

    return {
      agents: all.length,
      active: all.filter(a => a.status === "ACTIVE").length,
      revoked: all.filter(a => a.status === "REVOKED").length
    };
  }

};

export default AfriAgentIdentityRegistry;
