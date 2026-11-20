import AfriAICoderA2AService
  from "../services/AfriAICoderA2AService.js";

const AGENT_ID = "AGENT-AFRIAICODER-001";

const entries = AfriAICoderA2AService.capabilities.map(capability => Object.freeze({
  agentId: AGENT_ID,
  capability: capability.id,
  service: capability.service,
  description: capability.description,
  status: "PENDING_PRICING_APPROVAL",
  pricing: null
}));

const AfriAICoderEconomyCatalogue = Object.freeze({
  agentId: AGENT_ID,
  serviceCount: entries.length,
  entries: Object.freeze(entries),

  getByCapability(capability) {
    return entries.find(entry => entry.capability === capability) || null;
  },

  list() {
    return [...entries];
  }
});

export default AfriAICoderEconomyCatalogue;
