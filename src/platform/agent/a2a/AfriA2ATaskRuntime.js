import AfriAgentIdentityRegistry from "../identity/AfriAgentIdentityRegistry.js";
import AfriAgentCapabilityRegistry from "../registry/AfriAgentCapabilityRegistry.js";
import AfriA2AUsageMeter from "../metering/AfriA2AUsageMeter.js";
import AfriA2AResponse from "./AfriA2AResponse.js";
import { AfriA2AError, A2A_ERRORS } from "./AfriA2AErrors.js";

const AfriA2ATaskRuntime = {

  async execute(input = {}) {

    const taskId =
      input.taskId ||
      `TASK-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

    const agent =
      AfriAgentIdentityRegistry.get(input.agentId);

    if (!agent) {
      throw new AfriA2AError(
        A2A_ERRORS.AGENT_NOT_FOUND,
        "Agent identity was not found"
      );
    }

    if (agent.status !== "ACTIVE") {
      throw new AfriA2AError(
        A2A_ERRORS.AGENT_REVOKED,
        "Agent identity is not active"
      );
    }

    const capability =
      AfriAgentCapabilityRegistry.get(input.capability);

    if (!capability) {
      throw new AfriA2AError(
        A2A_ERRORS.CAPABILITY_NOT_FOUND,
        "Requested capability was not found"
      );
    }

    if (!capability.enabled) {
      throw new AfriA2AError(
        A2A_ERRORS.CAPABILITY_DISABLED,
        "Requested capability is disabled"
      );
    }

    if (
      !agent.capabilities.includes(capability.id)
    ) {
      throw new AfriA2AError(
        A2A_ERRORS.CAPABILITY_FORBIDDEN,
        "Agent is not authorized for this capability"
      );
    }

    if (typeof capability.handler !== "function") {
      throw new AfriA2AError(
        A2A_ERRORS.TASK_FAILED,
        "Capability handler is unavailable"
      );
    }

    try {

      const result =
        await capability.handler(
          input.payload || {},
          {
            taskId,
            agentId: agent.id,
            capability: capability.id
          }
        );

      const usage =
        AfriA2AUsageMeter.record({
          taskId,
          agentId: agent.id,
          capability: capability.id,
          status: "COMPLETED"
        });

      return AfriA2AResponse.success({
        taskId,
        capability: capability.id,
        agentId: agent.id,
        result,
        usage
      });

    } catch (error) {

      AfriA2AUsageMeter.record({
        taskId,
        agentId: agent.id,
        capability: capability.id,
        status: "FAILED"
      });

      throw new AfriA2AError(
        A2A_ERRORS.TASK_FAILED,
        error?.message || "Capability execution failed"
      );

    }

  }

};

export default AfriA2ATaskRuntime;
