import AfriIntelSearchEngine from "../../intel/AfriIntelSearchEngine.js";

const AfriIntelA2AService = {
  async search(payload = {}, context = {}) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("AFRI_INTEL_PAYLOAD_INVALID");
    }

    return AfriIntelSearchEngine.search(payload, {
      adapters: [],
      context: {
        agentId: context.agentId || null,
        taskId: context.taskId || null
      }
    });
  }
};

export default AfriIntelA2AService;
