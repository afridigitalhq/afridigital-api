const AfriDebugPatchValidator = {

  validate(patch = {}) {

    const issues = [];

    if (!patch.patchId)
      issues.push("Missing patchId");

    if (!patch.strategy)
      issues.push("Missing strategy");

    if (!Array.isArray(patch.operations) || patch.operations.length === 0)
      issues.push("No patch operations");

    return {
      valid: issues.length === 0,
      status: issues.length === 0 ? "VALID" : "INVALID",
      issues,
      reviewedAt: Date.now()
    };

  },

  health() {

    return {
      service: "AfriDebugPatchValidator",
      status: "healthy"
    };

  }

};

export default AfriDebugPatchValidator;
