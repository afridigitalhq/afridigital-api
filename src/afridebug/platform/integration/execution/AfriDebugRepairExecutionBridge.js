import Queue from "../../approval/AfriDebugRepairApprovalQueue.js";
import Controller from "../../execution/AfriDebugChangeExecutionController.js";
import History from "../../../services/history/AfriDebugRepairHistoryLedger.js";
import Resolution from "../../../services/learning/AfriDebugResolutionRecorder.js";

const AfriDebugRepairExecutionBridge = {
  execute(input = {}) {
    const approvalId = input.approvalId || null;

    if (!approvalId) {
      return {
        bridgeStatus: "blocked",
        reason: "APPROVAL_REQUIRED"
      };
    }

    const approval = Queue.list().find(
      (item) => item.approvalId === approvalId
    );

    if (!approval || approval.status !== "approved") {
      return {
        bridgeStatus: "blocked",
        reason: "APPROVAL_REQUIRED",
        approvalId
      };
    }

    const execution = Controller.execute(input);

    if (execution.status !== "completed") {
      return {
        bridgeStatus: "failed",
        execution,
        history: null,
        resolution: null
      };
    }

    const history = History.record({
      incidentId: input.incidentId || execution.incidentId,
      approvalId,
      issue: input.issue || null,
      diagnosis: input.diagnosis || null,
      planId: input.planId || null,
      executionId: execution.executionId,
      verificationStatus:
        execution.verification?.status || "unknown",
      rollbackStatus: execution.rollback ? "required" : "none",
      outcome: execution.status
    });

    const resolution = Resolution.record({
      investigationId:
        input.incidentId || execution.incidentId,
      error: input.issue || null,
      diagnosis: input.diagnosis || null,
      patch: execution.patch || input.patch || null,
      deliveryId: input.deliveryId || null,
      status: execution.status
    });

    return {
      bridgeStatus: "executed",
      execution,
      history,
      resolution
    };
  },

  health() {
    return {
      service: "AfriDebugRepairExecutionBridge",
      status: "healthy",
      responsibility:
        "governed-repair-execution-and-post-execution-recording"
    };
  }
};

export default AfriDebugRepairExecutionBridge;
