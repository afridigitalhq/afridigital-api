const auditLog = [];

function logEvolution(entry) {
  auditLog.push(Object.freeze({
    ...entry,
    ts: Date.now()
  }));

  if (auditLog.length > 5000) auditLog.shift();
}

function getAuditLog() {
  return auditLog;
}

module.exports = { logEvolution, getAuditLog };
