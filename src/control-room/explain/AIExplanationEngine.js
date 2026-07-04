import { socPolicyEngine } from "../policy/SOCPolicyEngine.js";
import { cameraActionGuard } from "../../cameras/guard/CameraActionGuard.js";

export class AIExplanationEngine {
  explain(actionContext = {}) {
    const reasons = [];

    const policyResult = socPolicyEngine?.evaluate?.(actionContext);

    if (policyResult) {
      reasons.push("Policy engine evaluated action context");
    }

    if (actionContext.type === "CAMERA_SWITCH") {
      reasons.push("Camera routing optimization triggered");
    }

    if (actionContext.type === "ALERT" || actionContext.severity) {
      reasons.push("Security event classification detected");
    }

    if ((actionContext.riskScore || 0) > 0.7) {
      reasons.push("High-risk anomaly threshold exceeded");
    }

    const guardCheck = cameraActionGuard.validate(
      actionContext.userId || "system",
      actionContext
    );

    reasons.push(
      guardCheck.allowed
        ? "Passed Camera Action Guard validation"
        : "Blocked or requires approval by governance layer"
    );

    return {
      action: actionContext,
      explanation: reasons,
      confidence: Math.min(1, reasons.length / 5),
      timestamp: Date.now()
    };
  }
}

export const aiExplanationEngine = new AIExplanationEngine();
