const roles = {
  admin: ["*"],
  user: ["read:own", "command:basic"],
  agent: ["command:execute", "command:ai"]
};

function can(role, action) {
  return roles[role]?.includes("*") || roles[role]?.includes(action);
}

module.exports = { roles, can };
