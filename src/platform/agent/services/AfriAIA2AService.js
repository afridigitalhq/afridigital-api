import AfriAIAgentRuntime from "../../../../modules/afriai/agents/runtime/AfriAIAgentRuntime.js";

const AfriAIA2AService = {

  async ask(payload = {}, context = {}) {

    const message =
      payload.message ||
      payload.prompt ||
      payload.objective;

    if (!message) {
      throw new Error("AFRIAI_MESSAGE_REQUIRED");
    }

    const agentResult =
      await AfriAIAgentRuntime.run({
        message,
        context: payload.context || {},
        a2a: {
          taskId: context.taskId,
          agentId: context.agentId,
          capability: context.capability
        }
      });

    return {
      service: "AfriAI",
      capability: "afriai.ask",
      status: agentResult.result?.status || "EXECUTED",
      response: agentResult.result?.response || null,
      agent: agentResult
    };

  }

};

export default AfriAIA2AService;
