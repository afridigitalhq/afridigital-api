import { socDashboardAPI } from "../dashboard/SOCDashboardAPI.js";
import { socMetricsEngine } from "../metrics/SOCMetricsEngine.js";
import { incidentReplayEngine } from "../../evidence/replay/IncidentReplayEngine.js";
import { socPolicyEngine } from "../policy/SOCPolicyEngine.js";
import { socSimulationEngine } from "../simulation/SOCSimulationEngine.js";

export class SOCAICommandAssistant {
  constructor(rbac) {
    this.rbac = rbac;
  }

  async execute(userId, command) {
    const intent = this._parse(command);

    if (!this.rbac?.can(userId, "EXECUTE")) {
      return { error: "ACCESS_DENIED" };
    }

    switch (intent.action) {
      case "DASHBOARD":
        return socDashboardAPI.getLiveSnapshot();

      case "METRICS":
        return socMetricsEngine.report();

      case "REPLAY":
        return incidentReplayEngine.replay(intent.caseId);

      case "POLICIES":
        return socPolicyEngine.evaluate(intent.sampleCase || {});

      case "SIMULATE":
        return socSimulationEngine.runScenario(intent.cases || []);

      case "STATUS":
        return {
          dashboard: socDashboardAPI.getLiveSnapshot(),
          metrics: socMetricsEngine.calculate()
        };

      default:
        return {
          error: "UNKNOWN_COMMAND",
          hint: "Try: show dashboard | show metrics | replay case | simulate incident | system status"
        };
    }
  }

  _parse(text) {
    const t = text.toLowerCase();

    if (t.includes("dashboard")) return { action: "DASHBOARD" };
    if (t.includes("metric")) return { action: "METRICS" };
    if (t.includes("replay")) return { action: "REPLAY", caseId: this._extractId(t) };
    if (t.includes("policy")) return { action: "POLICIES" };
    if (t.includes("simulate")) return { action: "SIMULATE" };
    if (t.includes("status")) return { action: "STATUS" };

    return { action: "UNKNOWN" };
  }

  _extractId(text) {
    const match = text.match(/[a-zA-Z0-9\-]+/);
    return match ? match[0] : null;
  }
}

export const socAICommandAssistant = new SOCAICommandAssistant();
