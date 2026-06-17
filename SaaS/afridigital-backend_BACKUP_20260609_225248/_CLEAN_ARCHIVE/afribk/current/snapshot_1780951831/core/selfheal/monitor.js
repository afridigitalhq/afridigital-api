const fs = require("fs");
const { execSync } = require("child_process");

function systemSnapshot() {
  return {
    serverRunning: execSync("pgrep -f server.js || true").toString().trim() !== "",
    kernelExists: fs.existsSync("africore/kernel/connectivity.kernel.js"),
    logsExist: fs.existsSync("logs/afri-audit.log")
  };
}

function detectIssues(snapshot) {
  const issues = [];

  if (!snapshot.serverRunning) issues.push("SERVER_DOWN");
  if (!snapshot.kernelExists) issues.push("KERNEL_MISSING");
  if (!snapshot.logsExist) issues.push("LOGS_MISSING");

  return issues;
}

module.exports = { systemSnapshot, detectIssues };
