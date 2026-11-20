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
    name: process.env.A2A_DEBUG_AGENT_NAME || "AfriDebug Agent",
    organizationId: process.env.A2A_DEBUG_AGENT_ORGANIZATION_ID || "afridigital",
    trustDomain: "INTERNAL",
    capabilities: ["debug.analyze"]
  },

  afrirea: {
    id: process.env.A2A_REA_AGENT_ID || "AGENT-AFRIREA-001",
    name: process.env.A2A_REA_AGENT_NAME || "AfriREA Agent",
    organizationId: process.env.A2A_REA_AGENT_ORGANIZATION_ID || "afridigital",
    trustDomain: "INTERNAL",
    capabilities: ["research.analyze", "research.run"]
  },

  afriaicommand: {
    id: "AGENT-AFRIAICOMMAND-001",
    name: "AfriAICommand Agent",
    organizationId: "afridigital",
    trustDomain: "INTERNAL",
    capabilities: ["afriaicommand.execute"]
  },

  afriintel: {
    id: process.env.A2A_INTEL_AGENT_ID || "AGENT-AFRIINTEL-001",
    name: process.env.A2A_INTEL_AGENT_NAME || "AfriIntel Agent",
    organizationId: process.env.A2A_INTEL_AGENT_ORGANIZATION_ID || "afridigital",
    trustDomain: "INTERNAL",
    capabilities: ["intel.search"]
  },

  afriaicoder: {
    id: "AGENT-AFRIAICODER-001",
    name: "AfriAICoder Agent",
    organizationId: "afridigital",
    trustDomain: "INTERNAL",
    capabilities: [
      "engineering.backend",
      "engineering.web",
      "engineering.android",
      "engineering.ai",
      "engineering.devops",
      "engineering.blockchain",
      "engineering.security",
      "engineering.architecture"
    ]
  },
  afriarchi: {
    id: "AGENT-AFRIARCHI-001",
    name: "AfriArchi Agent",
    organizationId: "afridigital",
    trustDomain: "INTERNAL",
    capabilities: ["architecture.design"]
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
