const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require("fs");

// 🧠 SINGLE EXECUTION ENTRY POINT (AFRIOS BRAIN)
const ORCHESTRATOR = require("../v38-orchestrator.cjs");

// 🚫 BLOCKED LEGACY ENTRY POINTS (NO LONGER ACTIVE)
const LEGACY_BLOCKLIST = [
  "server.js",
  "server.backup.js",
  "fix-webhook.js",
  "v810-debug-webhook.js",
  "v89-webhook-patch.js"
];

// 🔍 SYSTEM EXECUTION SCAN (BASIC SAFETY CHECK)
function scanExecutionPaths() {
  const paths = fs.readdirSync(".");

  const active = [];
  const blocked = [];

  for (const p of paths) {
    if (LEGACY_BLOCKLIST.includes(p)) {
      blocked.push(p);
    } else if (p.includes("orchestrator") || p.includes("control")) {
      active.push(p);
    }
  }

  return { active, blocked };
}

// 🧠 MAIN EXECUTION HANDLER
function execute(input) {

  console.log("━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🧠 AFRIOS v3.1 EXECUTION UNIFIER");
  console.log("━━━━━━━━━━━━━━━━━━━━━━");

  const { active, blocked } = scanExecutionPaths();

  console.log("\n✅ ACTIVE EXECUTION LAYERS:");
  active.forEach(a => console.log(" -", a));

  console.log("\n🚫 BLOCKED LEGACY LAYERS:");
  blocked.forEach(b => console.log(" -", b));

  console.log("\n🚀 ROUTING TO ORCHESTRATOR...\n");

  // ONLY ONE ENTRY POINT ALLOWED
  if (ORCHESTRATOR && ORCHESTRATOR.handleMessage) {
    return ORCHESTRATOR.handleMessage(input);
  }

  console.log("❌ ORCHESTRATOR NOT AVAILABLE");
}

module.exports = {
  execute,
  scanExecutionPaths
};
