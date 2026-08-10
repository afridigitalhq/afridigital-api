import CoreApprovalContract from "../../../../core/approval/CoreApprovalContract.js";

const AfriDebugRepairPlanValidator = {
  validate(plan = {}) {

    const recommendation = plan.recommendation || {};
    const evidence = plan.evidenceTrace || {};
    const approval = plan.approvalContext || {};

    const confirmedEvidence =
      Array.isArray(evidence.confirmed) &&
      evidence.confirmed.length > 0;

    const diagnosis =
      typeof recommendation.diagnosis === "string" &&
      recommendation.diagnosis.trim().length > 0 &&
      recommendation.diagnosis !== "unknown";

    const action =
      typeof recommendation.action === "string" &&
      recommendation.action.trim().length > 0 &&
      recommendation.action !== "manual investigation required";

    const affectedFiles =
      Array.isArray(recommendation.affectedFiles) &&
      recommendation.affectedFiles.length > 0;

    const verificationCriteria =
      Array.isArray(recommendation.verificationCriteria) &&
      recommendation.verificationCriteria.length > 0;

    const approvalRequired =
      approval.approvalRequired === true &&
      approval.status === CoreApprovalContract.statuses.PENDING;

    const checks = {
      plan: !!plan.planId,
      recommendation: !!plan.recommendation,
      evidenceTrace: !!plan.evidenceTrace,
      approvalContext: !!plan.approvalContext,
      confirmedEvidence,
      diagnosis,
      action,
      affectedFiles,
      verificationCriteria,
      approvalRequired
    };

    const valid = Object.values(checks).every(Boolean);

    return {
      validationId: "VALIDATION-" + Date.now(),
      checks,
      status: valid ? "VALID" : "INVALID",
      executionAllowed: false,
      approvalRequired: true,
      reason: valid
        ? "Semantic repair plan validated; human approval still required."
        : "Repair plan failed semantic validation.",
      createdAt: Date.now()
    };
  },

  health() {
    return {
      service: "AfriDebugRepairPlanValidator",
      status: "healthy"
    };
  }
};

export default AfriDebugRepairPlanValidator;
