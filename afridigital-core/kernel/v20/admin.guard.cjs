const fs = require("fs");

class AdminGuard {
  constructor() {
    this.admins = new Set();

    try {
      const data = JSON.parse(
        fs.readFileSync("./afridigital-core/kernel/v20/admin.whitelist.json", "utf8")
      );

      (data.admins || []).forEach(a => this.admins.add(a));
    } catch (e) {
      console.log("⚠️ Admin whitelist missing");
    }
  }

  isAdmin(user) {
    return this.admins.has(String(user));
  }

  tag(message) {
    return {
      ...message,
      isAdmin: this.isAdmin(message.user),
      role: this.isAdmin(message.user) ? "admin" : "user"
    };
  }
}

module.exports = new AdminGuard();
