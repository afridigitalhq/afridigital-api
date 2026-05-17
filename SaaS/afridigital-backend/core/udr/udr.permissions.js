function canAccess(role, moduleId) {
  if (role === 'admin') return true;
  if (role === 'system') return true;

  const restricted = ['kernel', 'shield', 'audit'];
  if (restricted.includes(moduleId) && role !== 'admin') return false;

  return true;
}

module.exports = { canAccess };
