const { isAllowed } = require("../control-plane/moduleRegistry");

console.log("🔐 KERNEL GUARD ACTIVE (REGISTRY AUTHORITATIVE MODE)");

function scan(path) {
  if (!isAllowed(path)) {
    console.error("❌ BLOCKED BY CONTROL PLANE:", path);
    process.exit(1);
  }
}

module.exports = { scan };
