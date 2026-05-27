const { execSync } = require("child_process");

/**
 * SAFE EXECUTOR
 * Replaces scattered node -e + shell mixing
 */
function run(cmd, opts = {}) {
  try {
    console.log("⚙️ EXEC:", cmd);
    return execSync(cmd, {
      stdio: "inherit",
      ...opts
    });
  } catch (e) {
    console.log("❌ EXEC FAILED:", e.message);
    return null;
  }
}

/**
 * SAFE NODE PATCH RUNNER (no inline eval chaos)
 */
function runNode(scriptPath) {
  return run(`node ${scriptPath}`);
}

module.exports = {
  run,
  runNode
};
