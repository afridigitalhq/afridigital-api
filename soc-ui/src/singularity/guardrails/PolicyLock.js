export const PolicyLock = {
  mutation: false,
  autoDeploy: false,
  autoFix: false,
  autoRewrite: false,

  enforce(action) {
    if (action.type === "WRITE" || action.type === "PATCH") {
      return {
        allowed: false,
        reason: "SINGULARITY_MODE_RESTRICTED: NO SYSTEM MUTATION ALLOWED"
      };
    }

    return { allowed: true };
  }
};
