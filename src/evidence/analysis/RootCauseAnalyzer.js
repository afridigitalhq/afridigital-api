import { incidentReplayEngine } from "../replay/IncidentReplayEngine.js";
import { socPolicyEngine } from "../../control-room/policy/SOCPolicyEngine.js";

export class RootCauseAnalyzer {
  constructor() {
    this.replay = incidentReplayEngine;
    this.policies = socPolicyEngine;
  }

  analyze(caseId) {
    const timeline = this.replay.replay(caseId);

    if (!timeline.length) {
      return {
        caseId,
        status: "NO_DATA",
        explanation: "No incident history found for analysis"
      };
    }

    const policyHits = [];
    const events = [];

    for (const event of timeline) {
      events.push(event.type);

      if (event.type === "CASE_CREATED") {
        const caseFile = event.payload;
        const policies = this.policies.evaluate(caseFile);
        policyHits.push(...policies);
      }
    }

    const severityFlow = this._inferSeverity(events);

    return {
      caseId,
      summary: "Root cause analysis completed",
      eventCount: timeline.length,
      eventTypes: [...new Set(events)],
      triggeredPolicies: policyHits,
      severityPattern: severityFlow,
      explanation: this._buildExplanation(events, policyHits, severityFlow)
    };
  }

  _inferSeverity(events) {
    if (events.includes("AUTO_RESPONSE_EXECUTED")) return "AUTOMATED_INTERVENTION";
    if (events.includes("CASE_CREATED")) return "DETECTED_INCIDENT";
    return "UNKNOWN_FLOW";
  }

  _buildExplanation(events, policies, severityFlow) {
    return `System detected ${events.length} events. Flow classified as ${severityFlow}. ` +
           `Policies triggered: ${policies.length}. System behavior followed defined SOC rules.`;
  }
}

export const rootCauseAnalyzer = new RootCauseAnalyzer();
