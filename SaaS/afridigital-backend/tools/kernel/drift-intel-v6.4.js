const fs = require("fs");

const graphPath = ".kernel/graph.json";

function isLive(path) {
  return (
    !path.includes("archive") &&
    !path.includes("_FINAL_CONSOLIDATION_ARCHIVE") &&
    !path.includes("backup") &&
    !path.includes("freeze") &&
    !path.includes("quarantine")
  );
}

if (!fs.existsSync(graphPath)) {
  console.log("⛔ NO GRAPH FOUND (run v6.3 first)");
  process.exit(1);
}

const graph = JSON.parse(fs.readFileSync(graphPath, "utf-8"));

const files = Object.keys(graph).filter(isLive);

let totalDeps = 0;
let inboundMap = {};
let outboundMap = {};

for (const f of files) {
  const deps = (graph[f] || []).filter(isLive);

  outboundMap[f] = deps;

  for (const d of deps) {
    inboundMap[d] = (inboundMap[d] || 0) + 1;
  }

  totalDeps += deps.length;
}

const fileCount = files.length;
const avgDeps = fileCount ? totalDeps / fileCount : 0;

/*
🧠 FIXED LOGIC:
High coupling = true architectural hotspot
NOT just shared participation
*/

let highCoupling = 0;

for (const f of files) {
  const inbound = inboundMap[f] || 0;
  const outbound = (outboundMap[f] || []).length;

  // only REAL hotspots:
  if (inbound > 3 && outbound > 3) {
    highCoupling++;
  }
}

// hub-aware singleton detection (NOT penalized)
const renderLive = files.filter(f => f === "runtime/ui/render.js").length;

const score =
  Math.max(0,
    100 -
    (avgDeps * 1.5) -   // reduced weight
    (highCoupling * 3)  // corrected definition
  );

console.log("🧠 DRIFT INTELLIGENCE REPORT v6.4 (HUB-AWARE FIXED)");
console.log("===================================================");
console.log("📦 LIVE FILES:", fileCount);
console.log("🔗 AVG LIVE DEPENDENCIES:", avgDeps.toFixed(2));
console.log("⚠️ TRUE HOTSPOTS:", highCoupling);
console.log("🧱 LIVE render.js:", renderLive);
console.log("🧠 DRIFT SCORE (CALIBRATED):", score.toFixed(1));

if (score > 85) {
  console.log("🟢 ARCHITECTURE HEALTH: STABLE");
} else if (score > 65) {
  console.log("🟡 ARCHITECTURE HEALTH: MODERATE DRIFT");
} else {
  console.log("🔴 ARCHITECTURE HEALTH: HIGH DRIFT");
}
