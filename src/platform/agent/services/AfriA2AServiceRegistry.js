import AfriAgentCapabilityRegistry from "../registry/AfriAgentCapabilityRegistry.js";
import AfriAIDebugA2AService from "./AfriAIDebugA2AService.js";
import AfriAIA2AService from "./AfriAIA2AService.js";
import AfriForexA2AService from "./AfriForexA2AService.js";
import AfriREA2AService from "./AfriREA2AService.js";
import AfriAICoderA2AService from "./AfriAICoderA2AService.js";
import AfriIntelA2AService from "./AfriIntelA2AService.js";
import AfriArchiA2AService from "./AfriArchiA2AService.js";

function registerOrUpdate(definition) {
  if (AfriAgentCapabilityRegistry.get(definition.id)) {
    return AfriAgentCapabilityRegistry.update(definition.id, definition);
  }
  return AfriAgentCapabilityRegistry.register(definition);
}

const AfriA2AServiceRegistry = {
  initialize() {
    const standardCapabilities = [
      {
        id: "debug.analyze",
        service: "AfriDebug",
        description: "Analyze a repository or runtime issue and return structured debugging evidence.",
        handler: AfriAIDebugA2AService.analyze,
        enabled: true,
        adminOnly: false
      },
      {
        id: "afriai.ask",
        service: "AfriAI",
        description: "Execute an AfriAI agent task and return the grounded AfriAI response.",
        handler: AfriAIA2AService.ask,
        enabled: true,
        adminOnly: false
      },
      {
        id: "market.analyze",
        service: "AfriForex",
        description: "Analyze forex, crypto, commodity and stock markets using AfriForex multi-timeframe intelligence.",
        handler: AfriForexA2AService.analyze,
        enabled: true,
        adminOnly: false
      },
      {
        id: "intel.search",
        service: "AfriIntel",
        description: "Search configured public intelligence sources and return provenance-linked evidence.",
        handler: AfriIntelA2AService.search,
        enabled: false,
        adminOnly: false
      }
    ];

    for (const definition of standardCapabilities) {
      if (!AfriAgentCapabilityRegistry.get(definition.id)) {
        AfriAgentCapabilityRegistry.register(definition);
      }
    }

    const researchEnabled = process.env.AFRIREA_ENABLED === "true";
    const researchCapabilities = [
      {
        id: "research.analyze",
        service: "AfriREA",
        description: "Research a public website using bounded HTTPS fetching and static HTML analysis.",
        handler: AfriREA2AService.analyze,
        enabled: researchEnabled,
        adminOnly: false
      },
      {
        id: "research.run",
        service: "AfriREA",
        description: "Run structured multi-source research through registered AfriREA source adapters. HTTPS URL processing is currently implemented; other source types remain unsupported until their adapters are implemented.",
        handler: AfriREA2AService.research,
        enabled: researchEnabled,
        adminOnly: false
      }
    ];

    for (const definition of researchCapabilities) {
      registerOrUpdate(definition);
    }

    registerOrUpdate({
      id: "architecture.design",
      service: "AfriArchi",
      description: "Architectural design capability reserved for the AfriArchi design engine.",
      handler: AfriArchiA2AService.design,
      enabled: false,
      adminOnly: false,
      internalOnly: true
    });

    for (const definition of AfriAICoderA2AService.capabilities) {
      registerOrUpdate({
        ...definition,
        handler: AfriAICoderA2AService.execute,
        enabled: definition.id === "engineering.backend",
        adminOnly: false,
        internalOnly: true
      });
    }

    return AfriAgentCapabilityRegistry.list();
  }
};

export default AfriA2AServiceRegistry;
