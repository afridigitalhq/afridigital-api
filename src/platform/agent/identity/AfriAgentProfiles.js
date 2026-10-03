const AfriAgentProfiles = {
  afriai: {
    id: process.env.A2A_AGENT_ID || "AGENT-BETA-001",
    name: process.env.A2A_AGENT_NAME || "AfriAI",
    organizationId: process.env.A2A_AGENT_ORGANIZATION_ID || "afridigital",
    trustDomain: "INTERNAL",
    capabilities: ["afriai.ask"]
  },

  afridebug: {
    id: process.env.A2A_DEBUG_AGENT_ID || "AGENT-AFRIDEBUG-001",
    name: process.env.A2A_DEBUG_AGENT_NAME || "AfriDebug",
    organizationId: process.env.A2A_DEBUG_AGENT_ORGANIZATION_ID || "afridigital",
    trustDomain: "INTERNAL",
    capabilities: ["debug.analyze"]
  },

  afriforex: {
    id: process.env.A2A_FOREX_AGENT_ID || "AGENT-AFRIFOREX-001",
    name: process.env.A2A_FOREX_AGENT_NAME || "AfriForex",
    organizationId: process.env.A2A_FOREX_AGENT_ORGANIZATION_ID || "afridigital",
    trustDomain: "INTERNAL",
    capabilities: ["market.analyze"]
  }
};

export default AfriAgentProfiles;
