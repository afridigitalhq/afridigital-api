import AfriPlatformRolePermissions from "../rbac/AfriPlatformRolePermissions.js";

const AfriPlatformAuthorization = {
  authorize(identity={}, permission=""){
    const role = identity?.role || "GUEST";
    const permissions = AfriPlatformRolePermissions[role] || [];
    const allowed =
      permissions.includes("*") ||
      permissions.includes(permission);

    return {
      allowed,
      identity,
      role,
      permission,
      permissions,
      authority:"AfriPlatform",
      unrestricted:permissions.includes("*")
    };
  }
};

export default AfriPlatformAuthorization;
