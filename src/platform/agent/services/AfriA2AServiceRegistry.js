import AfriAgentCapabilityRegistry
  from "../registry/AfriAgentCapabilityRegistry.js";

import AfriAIDebugA2AService
  from "./AfriAIDebugA2AService.js";

import AfriAIA2AService
  from "./AfriAIA2AService.js";

const AfriA2AServiceRegistry = {

  initialize() {

    if (!AfriAgentCapabilityRegistry.get("debug.analyze")) {

      AfriAgentCapabilityRegistry.register({

        id: "debug.analyze",

        service: "AfriDebug",

        description:
          "Analyze a repository or runtime issue and return structured debugging evidence.",

        handler:
          AfriAIDebugA2AService.analyze,

        enabled: true,

        adminOnly: false

      });

    }

    if (!AfriAgentCapabilityRegistry.get("afriai.ask")) {

      AfriAgentCapabilityRegistry.register({

        id: "afriai.ask",

        service: "AfriAI",

        description:
          "Execute an AfriAI agent task and return the grounded AfriAI response.",

        handler:
          AfriAIA2AService.ask,

        enabled: true,

        adminOnly: false

      });

    }

    return AfriAgentCapabilityRegistry.list();

  }

};

export default AfriA2AServiceRegistry;
