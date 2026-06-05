const { isAllowed } = require("../src/control-plane/moduleRegistry");

console.log("🔐 KERNEL GUARD (SINGLE SOURCE MODE)");

function scan(path) {
  const ok = isAllowed(path);

  if (!ok) {
    console.error("❌ BLOCKED:", path);
    process.exit(1);
  }

  console.log("✅ ALLOWED:", path);
}

module.exports = { scan };
