/**
 * 🧠 EXECUTION KERNEL v2
 * Hard runtime authority layer
 */

const fs = require("fs");

const ALLOWED_ENTRY = "render-entry.js";

function verifyEntry() {
  const entry = process.argv[1] || "";

  if (!entry.includes(ALLOWED_ENTRY)) {
    console.error("🚨 KERNEL BLOCK: Unauthorized entry attempt:", entry);
    process.exit(1);
  }
}

function scanForRogueListeners() {
  const execSync = require("child_process").execSync;

  try {
    const out = execSync(
      "grep -R \"// app.listen DISABLED\\|http.listen\" . --exclude-dir=node_modules --exclude-dir=archive --exclude-dir=afribk",
      { encoding: "utf8" }
    );

    if (out && out.length > 0) {
      console.error("🚨 KERNEL BLOCK: Rogue listeners detected");
      console.error(out.split("\n").slice(0, 5).join("\n"));
      process.exit(1);
    }
  } catch (e) {
    // no listeners found = safe
  }
}

function bootGate() {
  verifyEntry();
  scanForRogueListeners();
  console.log("🟢 KERNEL: System validated and authorized");
}

module.exports = { bootGate };
