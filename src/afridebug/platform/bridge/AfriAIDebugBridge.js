import AfriDebugEngine from "../AfriDebugEngine.js";

const AfriAIDebugBridge = {

  analyze(input = {}){

    return AfriDebugEngine.analyze({
      id: input.id || `AFRIAI-DEBUG-${Date.now()}`,
      mode: "ROOT_CAUSE_ANALYSIS",
      aiResponse: input.aiResponse,
      runtime: input.runtime,
      error: input.error,
      stack: input.stack
    });

  }

};

export default AfriAIDebugBridge;
