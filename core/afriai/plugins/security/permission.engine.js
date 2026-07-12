class PermissionEngine {
  check(manifest, permission) {
    const permissions = manifest.permissions || [];

    return {
      ok: permissions.includes(permission),
      requested: permission,
      available: permissions
    };
  }
}

module.exports = new PermissionEngine();
