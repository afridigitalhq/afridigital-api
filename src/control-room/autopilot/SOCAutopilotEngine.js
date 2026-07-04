import { rootCauseAnalyzer } from "../rca/RootCauseAnalyzer.js";
import { cameraActionGuard } from "../../cameras/guard/CameraActionGuard.js";
import { socPolicyEngine } from "../policy/SOCPolicyEngine.js";
import { socDashboardAPI } from "../dashboard/SOCDashboardAPI.js";

export class SOCAutopilotEngine {
  proposeActions(timeWindowMs = 300000) {
    const snapshot = socDashboardAPI.getLiveSnapshot();
    const rca = rootCauseAnalyzer.analyze(timeWindowMs);

    const actions = [];

    for (const h of rca.hypotheses || []) {
      if (h.hypothesis.includes("STREAM")) {
        actions.push({
          type: "RESTART_STREAM",
          target: "camera-system",
          reason: h.hypothesis
        });
      }

      if (h.hypothesis.includes("ALERT")) {
        actions.push({
          type: "ESCALATE_INCIDENT",
          target: "soc-dashboard",
          reason: h.hypothesis
        });
      }

      if (h.hypothesis.includes("LOAD")) {
        actions.push({
          type: "REDISTRIBUTE_LOAD",
          target: "stream-gateway",
          reason: h.hypothesis
        });
      }
    }

    return actions;
  }

  async executeActions(actions = [], userId = "system") {
    const results = [];

    for (const action of actions) {
      const guard = cameraActionGuard.validate(userId, action);
      const policy = socPolicyEngine.evaluate(action);

      if (!guard.allowed || policy?.blocked) {
        results.push({
          action,
          status: "BLOCKED",
          reason: "Guard or policy rejection"
        });
        continue;
      }

      // Simulated execution layer (hook for real system later)
      results.push({
        action,
        status: "EXECUTED",
        timestamp: Date.now()
      });
    }

    return results;
  }

  async run(timeWindowMs = 300000, userId = "system") {
    const actions = this.proposeActions(timeWindowMs);
    return this.executeActions(actions, userId);
  }
}

export const socAutopilotEngine = new SOCAutopilotEngine();
