const fs = require("fs");

const graphPath = ".kernel/graph.json";

function isLive(p) {
  return (
    !p.includes("archive") &&
    !p.includes("_FINAL_CONSOLIDATION_ARCHIVE") &&
    !p.includes("backup") &&
    !p.includes("freeze") &&
    !p.includes("quarantine") &&
    !p.includes("node_modules")   // ✅ CRITICAL FIX
  );
}

if (!fs.existsSync(graphPath)) {
  console.log("⛔ NO GRAPH FOUND (run v6.3 first)");
  process.exit(1);
}

const graph = JSON.parse(fs.readFileSync(graphPath, "utf-8"));
const files = Object.keys(graph).filter(isLive);

/* =========================
   BUILD GRAPH METRICS
========================= */

let inbound = {};
let outbound = {};

for (const f of files) {
  const deps = (graph[f] || []).filter(isLive);
  outbound[f] = deps;

  for (const d of deps) {
    inbound[d] = (inbound[d] || 0) + 1;
  }
}

/* =========================
   HOTSPOT DETECTION
========================= */

const hotspots = [];

for (const f of files) {
  const inDeg = inbound[f] || 0;
  const outDeg = (outbound[f] || []).length;

  const score = inDeg + outDeg;

  if (score >= 8) {
    hotspots.push({
      file: f,
      inbound: inDeg,
      outbound: outDeg,
      score
    });
  }
}

/* =========================
   OUTPUT
========================= */

console.log("🧠 KERNEL v6.6 HOTSPOT DECOMPOSITION ENGINE (CLEAN)");
console.log("===================================================");
console.log("📦 LIVE FILES:", files.length);
console.log("🔥 HOTSPOTS FOUND:", hotspots.length);

console.log("\n🧭 HOTSPOT BREAKDOWN\n");

hotspots
  .sort((a, b) => b.score - a.score)
  .forEach((h, i) => {
    console.log(`#${i + 1}`);
    console.log("📄 FILE:", h.file);
    console.log("📥 INBOUND:", h.inbound);
    console.log("📤 OUTBOUND:", h.outbound);
    console.log("📊 SCORE:", h.score);
    console.log("-----------------------------------");
  });

if (hotspots.length === 0) {
  console.log("🟢 NO ARCHITECTURAL HOTSPOTS DETECTED");
  console.log("🟢 SYSTEM IS FULLY DISTRIBUTED");
}
