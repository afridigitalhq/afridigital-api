import AfriAgentProfiles from "./AfriAgentProfiles.js";

const agents = new Map();

function initializeFromEnv() {
  for (const profile of Object.values(AfriAgentProfiles)) {
    if (!profile?.id || agents.has(profile.id)) continue;
    AfriAgentIdentityRegistry.register(profile);
  }

  return AfriAgentIdentityRegistry.list();
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
