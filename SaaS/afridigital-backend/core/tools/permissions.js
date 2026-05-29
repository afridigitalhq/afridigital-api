const TOOL_PERMISSIONS = {
  pricingTool: ['public'],
  echoTool: ['public'],
  supportTool: ['public'],

  // future restricted tools
  adminTool: ['admin']
};

function getUserRole(userId = '') {
  const admins = (
    process.env.ADMIN_USERS || ''
  ).split(',');

  if (admins.includes(userId)) {
    return 'admin';
  }

  return 'public';
}

function canExecute(userId, toolName) {
  const role = getUserRole(userId);

  const allowed =
    TOOL_PERMISSIONS[toolName] || [];

  return allowed.includes(role);
}

module.exports = {
  canExecute,
  getUserRole
};
