export class AICaseReportWriter {
  constructor(caseEngine) {
    this.caseEngine = caseEngine;
  }

  generateReport(caseId) {
    const caseFile = this.caseEngine.getCase(caseId);
    if (!caseFile) return null;

    const severityMap = {
      LOW: "Routine activity detected",
      MEDIUM: "Suspicious behavior observed",
      HIGH: "Potential security breach",
      CRITICAL: "Active threat detected"
    };

    const narrative = {
      caseId,
      summary: severityMap[caseFile.severity] || "Unknown activity",
      cameraId: caseFile.cameraId,
      timestamp: caseFile.timestamp,
      integrity: caseFile.status,
      analysis: `Incident detected on camera ${caseFile.cameraId}. Evidence has been sealed with hash ${caseFile.custodyHash}.`,
      recommendation: this.getRecommendation(caseFile.severity)
    };

    return narrative;
  }

  getRecommendation(severity) {
    switch (severity) {
      case "CRITICAL":
        return "Immediate escalation to control room and isolation of camera feed";
      case "HIGH":
        return "Review footage and notify security operator";
      case "MEDIUM":
        return "Monitor activity for escalation";
      default:
        return "No action required";
    }
  }
}
