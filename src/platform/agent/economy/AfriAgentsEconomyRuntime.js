import AfriAgentsEconomyRegistry
  from "./AfriAgentsEconomyRegistry.js";

const REQUIRED_SERVICES = [
  {
    agentId: "AGENT-AFRIDEBUG-001",
    capability: "debug.analyze",
    service: "AfriDebug",
    description:
      "Evidence-driven software debugging and repair services for authenticated agent-to-agent workflows.",
    pricing: {
      model: "TIERED",
      currency: "USD",
      tiers: [
        {
          id: "debug-basic",
          name: "Basic Debugging",
          amountUSD: 0.55
        },
        {
          id: "debug-advanced",
          name: "Advanced Debugging",
          amountUSD: 2.25
        },
        {
          id: "debug-complex",
          name: "Complex Debugging",
          amountUSD: 5.55
        },
        {
          id: "repair-basic",
          name: "Basic Repair / Fix",
          amountUSD: 10.5
        },
        {
          id: "repair-advanced",
          name: "Advanced Repair / Fix",
          amountUSD: 15.5
        },
        {
          id: "repair-complex",
          name: "Complex Repair / Fix",
          amountUSD: 20.5
        }
      ]
    }
  }
];

export function initializeAfriAgentsEconomy() {
  const initialized = [];

  for (const definition of REQUIRED_SERVICES) {
    const existing = AfriAgentsEconomyRegistry.getService({
      agentId: definition.agentId,
      capability: definition.capability
    });

    if (existing) {
      continue;
    }

    const registered =
      AfriAgentsEconomyRegistry.registerService(definition);

    initialized.push({
      agentId: registered.agentId,
      capability: registered.capability,
      status: registered.status
    });
  }

  return {
    initialized: true,
    seeded: initialized,
    services: AfriAgentsEconomyRegistry.listServices().length
  };
}

export default {
  initializeAfriAgentsEconomy
};
