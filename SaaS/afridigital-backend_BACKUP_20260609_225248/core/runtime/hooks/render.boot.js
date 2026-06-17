/**
 * 🚀 RENDER BOOT HOOK
 * Executes before server startup
 */

const { preDeployScan } = require("../../ci/render/ci.engine");

function bootCheck() {
  const report = preDeployScan();

  console.log("🧠 AFRISCAN PRE-DEPLOY SCAN");
  console.log("━━━━━━━━━━━━━━━━━━━━━━");
  console.log("STATUS:", report.status);
  console.log("MISSING:", report.missing_env);

  if (report.status !== "READY") {
    console.log("🛑 DEPLOYMENT BLOCKED BY CI BRAIN");
    process.exit(1);
  }

  console.log("🟢 CI CHECK PASSED — STARTING SYSTEM");
}

module.exports = { bootCheck };
