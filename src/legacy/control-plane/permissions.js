function canApplyPatch(userRole = "admin") {
  return userRole === "admin";
}

function canView(mode) {
  return true;
}

module.exports = { canApplyPatch, canView };
