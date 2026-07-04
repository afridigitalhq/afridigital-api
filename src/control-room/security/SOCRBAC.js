export class SOCRBAC {
  constructor() {
    this.roles = {
      ADMIN: ["READ", "WRITE", "EXECUTE", "POLICY"],
      ANALYST: ["READ", "WRITE", "SIMULATE"],
      VIEWER: ["READ"]
    };

    this.users = new Map();
  }

  addUser(id, role = "VIEWER") {
    this.users.set(id, { id, role });
  }

  setRole(id, role) {
    if (!this.roles[role]) return false;

    const user = this.users.get(id);
    if (!user) return false;

    user.role = role;
    return true;
  }

  can(userId, action) {
    const user = this.users.get(userId);
    if (!user) return false;

    const permissions = this.roles[user.role] || [];
    return permissions.includes(action);
  }

  filterDashboardData(userId, data) {
    const user = this.users.get(userId);
    if (!user) return null;

    if (user.role === "VIEWER") {
      return {
        systemStatus: data.systemStatus,
        metrics: {
          automationRate: data.metrics?.automationRate,
          healthScore: data.metrics?.healthScore
        }
      };
    }

    return data;
  }
}

export const socRBAC = new SOCRBAC();
