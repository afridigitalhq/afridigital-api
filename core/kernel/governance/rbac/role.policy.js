// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * ROLE-BASED ACCESS CONTROL (READ-ONLY GOVERNANCE)
 */

const Roles = {
  ADMIN: "ADMIN",
  OBSERVER: "OBSERVER",
  ANALYST: "ANALYST",
  AUDITOR: "AUDITOR"
};

const Permissions = {
  ADMIN: ["read_all"],
  ANALYST: ["read_live", "read_forecast"],
  OBSERVER: ["read_live"],
  AUDITOR: ["read_history", "read_forensics"]
};

function canAccess(role, resource) {
  const perms = Permissions[role] || [];
  return perms.includes(resource);
}

module.exports = { Roles, Permissions, canAccess };
