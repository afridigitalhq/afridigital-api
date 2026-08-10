export class AfriFixDebugHandoffAdapter {

  createRepairRequest(debugReport = {}) {

    const recommendation =
      debugReport.recommendation || {};

    const evidence =
      debugReport.evidenceTrace || {};

    const rootCause =
      debugReport.rootCause ||
      recommendation.diagnosis ||
      null;

    const recommendedFix =
      debugReport.recommendedFix ||
      recommendation.action ||
      null;

    const affectedFiles =
      debugReport.affectedFiles ||
      recommendation.affectedFiles ||
      [];

    const risk =
      debugReport.risk ||
      recommendation.risk ||
      "unknown";

    return {
      component: "AfriFix Debug Handoff",
      status: "READY",
      source: "AfriDebug",

      repairRequest: {
        issue: debugReport.issue || "unknown",
        rootCause,
        recommendedFix,
        affectedFiles,
        risk,
        verificationCriteria:
          recommendation.verificationCriteria || [],
        evidenceTrace: evidence
      },

      approvalContext:
        debugReport.approvalContext || {
          required: true,
          status: "PENDING_HUMAN_APPROVAL",
          executionMode: "AFRINUCCHAIN_APPROVAL"
        },

      executionReady: false,

      workflow: [
        "Create Repair Session",
        "Generate Preview",
        "Request Approval",
        "Execute Repair",
        "Verify Result",
        "Generate Evidence"
      ],

      timestamp: new Date().toISOString()
    };
  }
}
