import AfriA2ATaskRuntime from "./AfriA2ATaskRuntime.js";
import AfriA2AAuthorization from "../security/AfriA2AAuthorization.js";
import AfriA2AResponse from "./AfriA2AResponse.js";
import { AfriA2AError, A2A_ERRORS } from "./AfriA2AErrors.js";

const EXTERNAL_TASK_EXECUTION_ENABLED = false;

const AfriA2AGateway = {

  async handle(request = {}) {

    try {

      if (!request.agentId || !request.capability) {
        throw new AfriA2AError(
          "INVALID_REQUEST",
          "agentId and capability are required"
        );
      }

      if (request.requestOrigin !== "EXTERNAL") {
        throw new AfriA2AError(
          A2A_ERRORS.INVALID_REQUEST,
          "A2A gateway accepts external requests only"
        );
      }

      if (!EXTERNAL_TASK_EXECUTION_ENABLED) {
        throw new AfriA2AError("A2A_EXECUTION_DISABLED_NO_PAYMENT_POLICY","External A2A task execution is temporarily disabled while payment operations are disabled.");
      }

      AfriA2AAuthorization.authorize({
        sourceAgentId: request.sourceAgentId || null,
        targetAgentId: request.agentId,
        capability: request.capability,
        requestOrigin: "EXTERNAL"
      });

      return await AfriA2ATaskRuntime.execute({
        taskId: request.taskId,
        requestId: request.requestId || request.taskId || null,
        sourceAgentId: request.sourceAgentId || null,
        agentId: request.agentId,
        capability: request.capability,
        payment: request.payment || {},
        settlement: request.settlement || null,
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
