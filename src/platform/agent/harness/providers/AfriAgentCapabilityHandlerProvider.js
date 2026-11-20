function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

const AfriAgentCapabilityHandlerProvider = {
  async execute({ agent, capability, task, context = {} } = {}) {
    if (!agent || typeof agent.id !== "string") {
      throw new Error("AFRI_HARNESS_PROVIDER_AGENT_INVALID");
    }

    if (!capability || typeof capability.id !== "string" ||
        typeof capability.handler !== "function") {
      throw new Error("AFRI_HARNESS_PROVIDER_HANDLER_UNAVAILABLE");
    }

    if (!isRecord(task)) {
      throw new Error("AFRI_HARNESS_PROVIDER_TASK_INVALID");
    }

    if (!isRecord(context)) {
      throw new Error("AFRI_HARNESS_PROVIDER_CONTEXT_INVALID");
    }

    let payload = task.payload ?? task.input;

    if (payload === undefined) {
      const objective = task.objective ?? task.task;
      payload = typeof objective === "string" && objective.trim()
        ? { objective: objective.trim() }
        : {};
    }

    if (!isRecord(payload)) {
      throw new Error("AFRI_HARNESS_PROVIDER_PAYLOAD_INVALID");
    }

    const executionContext = {
      ...context,
      agentId: agent.id,
      capability: capability.id,
      taskId: context.taskId || context.requestId || null
    };

    return capability.handler(payload, executionContext);
  }
};

export default AfriAgentCapabilityHandlerProvider;
