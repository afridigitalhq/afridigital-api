const logs = [];

export const AuditLog = {
  add(entry) {
    logs.push({
      ...entry,
      ts: Date.now()
    });
  },

  all() {
    return logs;
  }
};
