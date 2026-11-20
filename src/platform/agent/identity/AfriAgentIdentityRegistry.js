import AfriAgentProfiles from "./AfriAgentProfiles.js";
import AfriAgentLifecycle from "../harness/lifecycle/AfriAgentLifecycle.js";

export function createAfriAgentIdentityRegistry() {
  const agents = new Map();

  function snapshot(agent) {
    if (!agent) return null;
    return Object.freeze({ ...agent, capabilities: Object.freeze([...agent.capabilities]) });
  }

  const registry = {
    register(input = {}) {
      if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("AFRI_AGENT_IDENTITY_INPUT_INVALID");
      const id = input.id || ("AGENT-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8));
      if (typeof id !== "string" || !id.trim()) throw new Error("AFRI_AGENT_IDENTITY_ID_REQUIRED");
      if (agents.has(id)) throw new Error("AFRI_AGENT_IDENTITY_DUPLICATE");
      if (input.status !== undefined && !["ACTIVE", "PENDING"].includes(input.status)) throw new Error("AFRI_AGENT_IDENTITY_INITIAL_STATUS_INVALID");
      const capabilities = Array.isArray(input.capabilities) ? [...input.capabilities] : [];
      if (capabilities.some(value => typeof value !== "string" || !value.trim()) || new Set(capabilities).size !== capabilities.length) throw new Error("AFRI_AGENT_IDENTITY_CAPABILITIES_INVALID");
      const agent = {
        id, key: input.key || null, name: input.name || "Unnamed Agent",
        organizationId: input.organizationId || null, trustDomain: input.trustDomain || "EXTERNAL",
        publicKey: input.publicKey || null, provider: input.provider || null,
        status: input.status || "ACTIVE", capabilities, createdAt: Date.now()
      };
      agents.set(id, agent);
      return snapshot(agent);
    },

    bindProvider(id, providerId) {
      if (typeof id !== "string" || !id.trim()) throw new Error("AFRI_AGENT_IDENTITY_ID_REQUIRED");
      if (typeof providerId !== "string" || !providerId.trim()) throw new Error("AFRI_AGENT_IDENTITY_PROVIDER_REQUIRED");
      const agent = agents.get(id);
      if (!agent) throw new Error("AFRI_AGENT_IDENTITY_NOT_FOUND");
      if (agent.provider && agent.provider !== providerId) throw new Error("AFRI_AGENT_IDENTITY_PROVIDER_CONFLICT");
      agent.provider = providerId;
      return snapshot(agent);
    },

    get(id) { return snapshot(agents.get(id)); },

    transition(id, nextStatus) {
      const agent = agents.get(id);
      if (!agent) return null;
      const updated = AfriAgentLifecycle.transition(agent, nextStatus);
      if (nextStatus === "REVOKED") updated.revokedAt = updated.statusChangedAt;
      agents.set(id, updated);
      return snapshot(updated);
    },

    revoke(id) {
      const agent = agents.get(id);
      if (!agent) return null;
      if (agent.status === "REVOKED") return snapshot(agent);
      return registry.transition(id, "REVOKED");
    },

    updateCapabilities(id, capabilities) {
      if (!Array.isArray(capabilities) || capabilities.some(value => typeof value !== "string" || !value.trim()) || new Set(capabilities).size !== capabilities.length) throw new Error("AFRI_AGENT_IDENTITY_CAPABILITIES_INVALID");
      const agent = agents.get(id);
      if (!agent) return null;
      agent.capabilities = [...capabilities];
      return snapshot(agent);
    },

    list() { return [...agents.values()].map(snapshot); },

    initializeFromEnv() {
      for (const [key, profile] of Object.entries(AfriAgentProfiles)) {
        if (!profile?.id || agents.has(profile.id)) continue;
        registry.register({ ...profile, key, status: "ACTIVE" });
      }
      return registry.list();
    },

    stats() {
      const all = [...agents.values()];
      return { agents: all.length, active: all.filter(a => a.status === "ACTIVE").length, revoked: all.filter(a => a.status === "REVOKED").length };
    }
  };
  return Object.freeze(registry);
}

const AfriAgentIdentityRegistry = createAfriAgentIdentityRegistry();
export default AfriAgentIdentityRegistry;
