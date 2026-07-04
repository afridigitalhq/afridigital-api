import { incidentReportEngine } from "../reports/IncidentReportEngine.js";
import { rootCauseAnalyzer } from "../rca/RootCauseAnalyzer.js";
import { socAutopilotEngine } from "../autopilot/SOCAutopilotEngine.js";
import { aiExplanationEngine } from "../explain/AIExplanationEngine.js";

export class ForensicCaseExporter {
  buildCase(timeWindowMs = 300000) {
    const report = incidentReportEngine.generate(timeWindowMs);
    const rca = rootCauseAnalyzer.analyze(timeWindowMs);

    const autopilotActions = socAutopilotEngine.proposeActions(timeWindowMs);

    const enrichedEvents = (report.events || []).map((e) => ({
      ...e,
      explanation: aiExplanationEngine.explain(e)
    }));

    const caseFile = {
      caseId: `CASE-${Date.now()}`,
      generatedAt: Date.now(),

      overview: {
        systemStatus: report.systemStatus,
        activeLoad: report.activeLoad,
        timeWindowMs
      },

      incidentSummary: report.summary,

      rootCauseAnalysis: rca,

      autopilotDecisions: autopilotActions,

      forensicTimeline: enrichedEvents,

      integrity: {
        hash: this._generatePseudoHash(report, rca),
        signature: "SIMULATED_SOC_FORENSIC_v1"
      }
    };

    return caseFile;
  }

  _generatePseudoHash(report, rca) {
    const base = JSON.stringify({ report, rca }).length;
    return `HASH_${base}_${Date.now()}`;
  }
}

export const forensicCaseExporter = new ForensicCaseExporter();
