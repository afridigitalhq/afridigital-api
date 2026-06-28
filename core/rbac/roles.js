const ROLES = {
  VIEWER: ["read"],
  ADMIN: ["read", "toggle_flags"],
  DEPLOYER: ["read", "toggle_flags", "deploy"]
};

function can(role, action) {
  return (ROLES[role] || []).includes(action);
}

module.exports = { ROLES, can };
