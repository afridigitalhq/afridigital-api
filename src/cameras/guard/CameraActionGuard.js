import { socRBAC } from "../../control-room/security/SOCRBAC.js";
import { socPolicyEngine } from "../../control-room/policy/SOCPolicyEngine.js";
import { incidentReplayEngine } from "../../evidence/replay/IncidentReplayEngine.js";

export class CameraActionGuard {
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  validate(userId, action) {
    const userCanExecute = socRBAC.can(userId, "EXECUTE");

    const policyDecision = socPolicyEngine?.evaluate?.({
      type: "CAMERA_ACTION",
      action
    });

    const allowedByPolicy = Array.isArray(policyDecision)
      ? policyDecision.length > 0
      : !!policyDecision;

    const allowed = userCanExecute && allowedByPolicy;

    this._audit(userId, action, allowed);

    return {
      allowed,
      reason: allowed
        ? "APPROVED"
        : "BLOCKED_BY_POLICY_OR_RBAC"
    };
  }

  execute(userId, action, executor) {
    const result = this.validate(userId, action);

    if (!result.allowed) {
      return {
        status: "REJECTED",
        action
      };
    }

    const executionResult = executor(action);

    this._emit(action, executionResult);

    return {
      status: "EXECUTED",
      executionResult
    };
  }

  suggest(action) {
    return {
      status: "SUGGESTED_ONLY",
      action,
      requiresApproval: true
    };
  }

  _audit(userId, action, allowed) {
    this.eventBus?.emit?.("CAMERA_ACTION_AUDIT", {
      userId,
      action,
      allowed,
      timestamp: Date.now()
    });
  }

  _emit(action, result) {
    this.eventBus?.emit?.("CAMERA_ACTION_EXECUTED", {
      action,
      result,
      timestamp: Date.now()
    });
  }
}

export const cameraActionGuard = new CameraActionGuard();
