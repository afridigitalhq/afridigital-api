const fs = require("fs");

const graphPath = ".kernel/graph.json";

function isLive(p) {
  return (
    !p.includes("archive") &&
    !p.includes("_FINAL_CONSOLIDATION_ARCHIVE") &&
    !p.includes("backup") &&
    !p.includes("freeze") &&
    !p.includes("quarantine") &&
    !p.includes("node_modules")
  );
}

if (!fs.existsSync(graphPath)) {
  console.log("⛔ NO GRAPH FOUND (run v6.3 first)");
  process.exit(1);
}

const graph = JSON.parse(fs.readFileSync(graphPath, "utf-8"));
const files = Object.keys(graph).filter(isLive);

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
   BUILD OPTIMIZATION MAP
========================= */

const nodes = [];

for (const f of files) {
  const inDeg = inbound[f] || 0;
  const outDeg = (outbound[f] || []).length;

  const loadScore = inDeg + outDeg;

  nodes.push({
    file: f,
    inbound: inDeg,
    outbound: outDeg,
    loadScore
  });
}

/* =========================
   PRIORITIZATION ENGINE
========================= */

nodes.sort((a, b) => b.loadScore - a.loadScore);

function suggestFix(node) {
  const s = [];

  if (node.inbound > 5) {
    s.push("Reduce incoming dependencies (extract shared interface or isolate responsibilities)");
  }

  if (node.outbound > 5) {
    s.push("Reduce outbound coupling (replace direct calls with abstraction or event boundary)");
  }

  if (node.inbound > 3 && node.outbound > 3) {
    s.push("Split responsibility boundary (this module acts as dual-direction hub)");
  }

  if (s.length === 0) {
    s.push("No structural change needed — maintain as leaf/stable node");
  }

  return s;
}

/* =========================
   OUTPUT
========================= */

console.log("🧠 KERNEL v6.7 AUTO REFACTOR SUGGESTION ENGINE");
console.log("===============================================");
console.log("📦 LIVE FILES:", files.length);
console.log("\n🔧 TOP OPTIMIZATION TARGETS (SAFE MODE)\n");

nodes.slice(0, 10).forEach((n, i) => {
  console.log(`#${i + 1}`);
  console.log("📄 FILE:", n.file);
  console.log("📥 INBOUND:", n.inbound);
  console.log("📤 OUTBOUND:", n.outbound);
  console.log("📊 LOAD SCORE:", n.loadScore);
  console.log("🧠 SUGGESTIONS:");
  suggestFix(n).forEach(s => console.log("   -", s));
  console.log("-----------------------------------");
});

console.log("\n🟢 MODE: READ-ONLY OPTIMIZATION MAP (NO CODE MODIFICATIONS)");
