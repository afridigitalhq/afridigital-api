const fs = require("fs");

console.log("🧱 RUNTIME GATE CHECK START");

const allowed = ["render-entry.js"];

const files = fs.readdirSync(".");

for (const f of files) {
  if (f.includes("server") && !allowed.includes(f)) {
    console.error("❌ BLOCKED RUNTIME:", f);
    process.exit(1);
  }
}

console.log("🟢 RUNTIME GATE PASSED");
