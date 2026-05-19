const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require("fs");
const path = require("path");

// 🧠 LOAD KERNEL MAP
const kernelMap = require("./afrios.kernel.map.json");

// 🔍 DETECT FILE SYSTEM STATE
function scanSystem(dir = ".") {
  const results = [];

  function walk(current) {
    const files = fs.readdirSync(current);

    for (const file of files) {
      const fullPath = path.join(current, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results;
}

// ⚠️ DETECT DUPLICATES FROM MAP
function detectConflicts(files) {
  const conflicts = [];

  const check = (category, paths) => {
    const found = files.filter(f =>
      paths.some(p => f.includes(p.replace("core/", "").replace("services/", "")))
    );

    if (found.length > 1) {
      conflicts.push({
        type: category,
        files: found
      });
    }
  };

  const c = kernelMap.auto_sync_engine.conflict_detection;

  check("wallet", c.wallet);
  check("ads", c.ads);
  check("ai", c.ai);

  return conflicts;
}

// 🧠 STABILIZATION ENGINE
function stabilizeSystem() {
  const files = scanSystem("./core");

  const conflicts = detectConflicts(files);

  console.log("━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🧠 AFRIOS v3 STABILIZER");
  console.log("━━━━━━━━━━━━━━━━━━━━━━");

  if (conflicts.length === 0) {
    console.log("✅ SYSTEM STABLE — NO CONFLICTS DETECTED");
    return;
  }

  console.log("⚠️ CONFLICTS DETECTED:");

  conflicts.forEach(c => {
    console.log("\n🔴 TYPE:", c.type);
    c.files.forEach(f => console.log(" -", f));
  });

  console.log("\n🛠️ RECOMMENDED FIXES:");
  console.log(kernelMap.auto_sync_engine.auto_heal_suggestions);
}

module.exports = {
  stabilizeSystem
};
