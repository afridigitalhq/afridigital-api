/**
 * 🚀 AFRISCAN RENDER CI BRAIN
 * Controls deployment safety + validation
 */

const fs = require("fs");

function checkEnv() {
  const required = [
    "META_TOKEN",
    "META_PHONE_ID",
    "JWT_SECRET",
    "DATABASE_URL",
    "REDIS_URL"
  ];

  const missing = required.filter((k) => !process.env[k]);

  return {
    ok: missing.length === 0,
    missing
  };
}

function preDeployScan() {
  const env = checkEnv();

  const report = {
    timestamp: Date.now(),
    env_ok: env.ok,
    missing_env: env.missing,
    status: env.ok ? "READY" : "BLOCKED"
  };

  fs.writeFileSync(
    "./core/runtime/hooks/predeploy.report.json",
    JSON.stringify(report, null, 2)
  );

  return report;
}

function canDeploy() {
  const r = preDeployScan();
  return r.status === "READY";
}

module.exports = {
  preDeployScan,
  canDeploy
};
