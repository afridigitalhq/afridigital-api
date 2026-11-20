import AfriAgentLifecycle from "../lifecycle/AfriAgentLifecycle.js";
import AfriAgentAuthorization from "../authorization/AfriAgentAuthorization.js";

const providers = new Map();

const HARNESS_ERRORS = Object.freeze({
  AGENT_NOT_FOUND: "AFRI_HARNESS_AGENT_NOT_FOUND",
  AGENT_NOT_ACTIVE: "AFRI_HARNESS_AGENT_NOT_ACTIVE",
  CAPABILITY_NOT_FOUND: "AFRI_HARNESS_CAPABILITY_NOT_FOUND",
  CAPABILITY_DISABLED: "AFRI_HARNESS_CAPABILITY_DISABLED",
  CAPABILITY_FORBIDDEN: "AFRI_HARNESS_CAPABILITY_FORBIDDEN",
  ADMIN_AUTHORIZATION_REQUIRED: "AFRI_HARNESS_ADMIN_AUTHORIZATION_REQUIRED",
  INTERNAL_EXECUTION_REQUIRED: "AFRI_HARNESS_INTERNAL_EXECUTION_REQUIRED",
  INTERNAL_AUTHORIZATION_REQUIRED: "AFRI_HARNESS_INTERNAL_AUTHORIZATION_REQUIRED",
  SOURCE_AGENT_NOT_FOUND: "AFRI_HARNESS_SOURCE_AGENT_NOT_FOUND",
  SOURCE_AGENT_NOT_ACTIVE: "AFRI_HARNESS_SOURCE_AGENT_NOT_ACTIVE",
  SOURCE_CAPABILITY_REQUIRED: "AFRI_HARNESS_SOURCE_CAPABILITY_REQUIRED",
  SOURCE_CAPABILITY_NOT_FOUND: "AFRI_HARNESS_SOURCE_CAPABILITY_NOT_FOUND",
  SOURCE_CAPABILITY_DISABLED: "AFRI_HARNESS_SOURCE_CAPABILITY_DISABLED",
  SOURCE_CAPABILITY_FORBIDDEN: "AFRI_HARNESS_SOURCE_CAPABILITY_FORBIDDEN"
});

function validateRequest({ agentId, task, context }) {
  if (typeof agentId !== "string" || !agentId.trim()) throw new Error("AFRI_HARNESS_AGENT_REQUIRED");
  if (!task || typeof task !== "object" || Array.isArray(task)) throw new Error("AFRI_HARNESS_TASK_INVALID");
  if (!context || typeof context !== "object" || Array.isArray(context)) throw new Error("AFRI_HARNESS_CONTEXT_INVALID");
}

function authorize(resolve) {
  try {
    return resolve();
  } catch (error) {
    throw new Error(HARNESS_ERRORS[error?.code] || "AFRI_HARNESS_AUTHORIZATION_FAILED");
  }
}

async function invoke({ agent, capability, task, context }) {
  const provider = providers.get(agent.provider) || null;
  if (!provider) throw new Error("AFRI_HARNESS_PROVIDER_UNAVAILABLE");
  return provider.execute({ agent, capability, task, context });
}

const AfriAgentHarnessRuntime = {
  registerProvider(providerId, provider) {
    if (typeof providerId !== "string" || !providerId.trim()) throw new Error("AFRI_HARNESS_PROVIDER_ID_REQUIRED");
    if (!provider || typeof provider.execute !== "function") throw new Error("AFRI_HARNESS_PROVIDER_EXECUTE_REQUIRED");
    if (providers.has(providerId)) throw new Error("AFRI_HARNESS_PROVIDER_ALREADY_REGISTERED");
    providers.set(providerId, provider);
    return { providerId, registered: true };
  },

  getProvider(providerId) {
    return providers.get(providerId) || null;
  },

  async execute({ agentId, task, context = {} } = {}) {
    validateRequest({ agentId, task, context });
    const { agent, capability } = authorize(() =>
      AfriAgentAuthorization.resolve({ agentId, capabilityId: task.capability })
    );
    return invoke({ agent, capability, task, context });
  },

  createInternalExecutor({ sourceAgentId, sourceCapabilityId } = {}) {
    if (typeof sourceAgentId !== "string" || !sourceAgentId.trim()) {
      throw new Error("AFRI_HARNESS_SOURCE_AGENT_REQUIRED");
    }
    if (typeof sourceCapabilityId !== "string" || !sourceCapabilityId.trim()) {
      throw new Error("AFRI_HARNESS_SOURCE_CAPABILITY_REQUIRED");
    }

    const trustedSourceAgentId = sourceAgentId.trim();
    const trustedSourceCapabilityId = sourceCapabilityId.trim();

    return async ({ agentId, task, context = {} } = {}) => {
      validateRequest({ agentId, task, context });

      const { agent, capability } = authorize(() =>
        AfriAgentAuthorization.resolveInternal({
          sourceAgentId: trustedSourceAgentId,
          sourceCapabilityId: trustedSourceCapabilityId,
          agentId,
          capabilityId: task.capability
        })
      );

      const executionContext = {
        ...context,
        sourceAgentId: trustedSourceAgentId,
        targetAgentId: agentId,
        executionChannel: "INTERNAL_ADMIN",
        paymentPolicy: "NO_AUTOMATIC_PAYMENT",
        taskId: context.taskId || context.requestId || null
      };

      return invoke({ agent, capability, task, context: executionContext });
    };
  },

  transition(agent, nextStatus) {
    return AfriAgentLifecycle.transition(agent, nextStatus);
  }
};

export default AfriAgentHarnessRuntime;
