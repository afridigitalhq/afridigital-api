const CorePatchValidator = {
  validate(result = {}) {
    const changes = result.appliedChanges || result.patch?.recommendations || [];

    return {
      result,
      valid: Array.isArray(changes),
      totalChanges: changes.length,
      validatedAt: new Date().toISOString(),
      status: Array.isArray(changes) ? "VALIDATED" : "FAILED_VALIDATION"
    };
  }
};

export default CorePatchValidator;
