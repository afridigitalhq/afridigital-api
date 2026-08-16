const AfriDebugPatchGenerator = {
  generate(input = {}) {
    const recommendation = input.recommendation || {};
    const repairPlan = input.repairPlan || {};
    const findings = Array.isArray(repairPlan.confirmedFindings)
      ? repairPlan.confirmedFindings
      : [];

    const affectedFiles = [
      ...new Set(
        findings.flatMap((finding) => [
          ...(Array.isArray(finding.locations) ? finding.locations : []),
          ...(Array.isArray(finding.files) ? finding.files : []),
          ...(Array.isArray(finding.affectedFiles) ? finding.affectedFiles : []),
          ...(typeof finding.location === "string" ? [finding.location] : [])
        ])
      )
    ];

    const operations = findings.map((finding) => ({
      action: "REPAIR_FINDING",
      findingId: finding.id || null,
      target:
        finding.locations ||
        finding.files ||
        finding.affectedFiles ||
        (finding.location ? [finding.location] : []),
      risk: finding.risk || null,
      description: finding.finding || finding.description || ""
    }));

    return {
      patchId: `PATCH-${Date.now()}`,
      strategy: input.patchStrategy || "TARGETED_RUNTIME_REPAIR",
      issue: input.issue || "",
      diagnosis: input.diagnosis || "",
      source: input.source || "AfriDebugRepairPlanningEngine",
      recommendation,
      repairPlan,
      affectedFiles,
      findings: findings.map((finding) => finding.id).filter(Boolean),
      operations: [
        {
          action: "INSPECT",
          target: recommendation.issue || input.issue || ""
        },
        ...operations,
        {
          action: "PATCH",
          description:
            recommendation.resolution ||
            "Generate finding-aware runtime repair"
        }
      ],
      requiresHumanApproval: true,
      approvalStatus: "HUMAN_APPROVAL_REQUIRED",
      status: "PROPOSED",
      generatedAt: Date.now()
    };
  },

  health() {
    return {
      service: "AfriDebugPatchGenerator",
      status: "healthy"
    };
  }
};

export default AfriDebugPatchGenerator;
