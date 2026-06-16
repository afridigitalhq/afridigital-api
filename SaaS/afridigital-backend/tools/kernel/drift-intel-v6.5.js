const fs = require("fs");

const graphPath = ".kernel/graph.json";

function isLive(p) {
  return (
    !p.includes("archive") &&
    !p.includes("_FINAL_CONSOLIDATION_ARCHIVE") &&
    !p.includes("backup") &&
    !p.includes("freeze") &&
    !p.includes("quarantine")
  );
}

if (!fs.existsSync(graphPath)) {
  console.log("⛔ NO GRAPH FOUND (run v6.3 first)");
  process.exit(1);
}

const graph = JSON.parse(fs.readFileSync(graphPath, "utf-8"));
const files = Object.keys(graph).filter(isLive);

/* =========================
   BASE METRICS
========================= */
let totalDeps = 0;
let inbound = {};
let outbound = {};

for (const f of files) {
  const deps = (graph[f] || []).filter(isLive);
  outbound[f] = deps;

  for (const d of deps) {
    inbound[d] = (inbound[d] || 0) + 1;
  }

  totalDeps += deps.length;
}

const fileCount = files.length;
const avgDeps = fileCount ? totalDeps / fileCount : 0;

/* =========================
   TIERED DRIFT ENGINE
========================= */

/*
🟢 Tier 1: stable nodes (normal behavior)
🟡 Tier 2: structural concentration (hub pressure)
🔴 Tier 3: true architectural risk (bidirectional stress)
*/

let tier1 = 0;
let tier2 = 0;
let tier3 = 0;

for (const f of files) {
  const inDeg = inbound[f] || 0;
  const outDeg = (outbound[f] || []).length;

  if (inDeg <= 2 && outDeg <= 3) {
    tier1++;
  } else if (inDeg <= 5 && outDeg <= 6) {
    tier2++;
  } else {
    tier3++;
  }
}

/* =========================
   STABILITY SCORE (UNCHANGED BASELINE)
========================= */

const baseScore =
  100 -
  (avgDeps * 1.2) -
  (tier3 * 2.5);

/* =========================
   PRECISION LAYER (NEW — DOES NOT AFFECT SCORE)
========================= */

const precisionSignals = {
  fanInHotspots: Object.entries(inbound)
    .filter(([_, v]) => v >= 4)
    .length,

  fanOutHotspots: Object.entries(outbound)
    .filter(([_, v]) => v && v.length >= 5)
    .length,

  hubPressureNodes: tier2
};

/* =========================
   OUTPUT
========================= */

console.log("🧠 KERNEL v6.5 DRIFT INTELLIGENCE (PRECISION MODE)");
console.log("==================================================");
console.log("📦 LIVE FILES:", fileCount);
console.log("🔗 AVG DEPENDENCIES:", avgDeps.toFixed(2));

console.log("\n🧭 TIER DISTRIBUTION");
console.log("🟢 Tier 1 (stable):", tier1);
console.log("🟡 Tier 2 (hub pressure):", tier2);
console.log("🔴 Tier 3 (risk nodes):", tier3);

console.log("\n🔬 PRECISION SIGNALS");
console.log("📥 Fan-in hotspots:", precisionSignals.fanInHotspots);
console.log("📤 Fan-out hotspots:", precisionSignals.fanOutHotspots);
console.log("🧱 Hub pressure nodes:", precisionSignals.hubPressureNodes);

console.log("\n🧠 STABILITY SCORE (UNCHANGED BASELINE):", baseScore.toFixed(1));

if (baseScore > 85) {
  console.log("🟢 ARCHITECTURE HEALTH: STABLE");
} else if (baseScore > 65) {
  console.log("🟡 ARCHITECTURE HEALTH: MODERATE DRIFT");
} else {
  console.log("🔴 ARCHITECTURE HEALTH: HIGH DRIFT");
}

console.log("\n⚙️ MODE: PRECISION OBSERVABILITY LAYER ACTIVE");
