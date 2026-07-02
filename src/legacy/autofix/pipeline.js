function generatePatch(issue) {
  return {
    patchId: Date.now().toString(36),
    issue,
    risk: "MEDIUM",
    requiresApproval: true
  };
}

module.exports = { generatePatch };
