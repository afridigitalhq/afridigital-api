// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
function canDeploy(state) {
  const issues = [];

  if (!state) return { allow: false, issues: ["NO_STATE"] };

  if (state.CI?.safe === false) issues.push("CI_NOT_SAFE");
  if (state.PRs?.pending > 0) issues.push("PENDING_PRs");

  return {
    allow: issues.length === 0,
    issues
  };
}

module.exports = { canDeploy };
