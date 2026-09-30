import AfriAgentCapabilityRegistry
  from "../registry/AfriAgentCapabilityRegistry.js";

import AfriAIDebugA2AService
  from "./AfriAIDebugA2AService.js";

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

    return AfriAgentCapabilityRegistry.get(
      "debug.analyze"
    );

  }

};

export default AfriA2AServiceRegistry;
