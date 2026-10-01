import AfriA2ATaskRuntime from "./AfriA2ATaskRuntime.js";
import AfriA2AResponse from "./AfriA2AResponse.js";
import { AfriA2AError } from "./AfriA2AErrors.js";

const AfriA2AGateway = {

  async handle(request = {}) {

    try {

      if (!request.agentId || !request.capability) {
        throw new AfriA2AError(
          "INVALID_REQUEST",
          "agentId and capability are required"
        );
      }

      return await AfriA2ATaskRuntime.execute({
        taskId: request.taskId,
        sourceAgentId: request.sourceAgentId || null,
        agentId: request.agentId,
        capability: request.capability,
        payload: request.payload
      });

    } catch (error) {

      return AfriA2AResponse.error({
        taskId: request.taskId || null,
        code: error.code || "A2A_ERROR",
        message: error.message || "A2A request failed",
        details: error.details || null
      });

    }

  }

};

export default AfriA2AGateway;
