const fs = require("fs");

const file = "core/os/orchestratorOS.js";
const code = fs.readFileSync(file, "utf-8");

function role(line) {
  if (line.includes("planner")) return "DECISION";
  if (line.includes("toolAgent")) return "ROUTING";
  if (line.includes("executor")) return "EXECUTION";
  if (line.includes("executeToolCall")) return "EXECUTION";
  if (line.includes("critic")) return "VALIDATION";
  if (line.includes("streamWithTyping")) return "OUTPUT";
  return null;
}

const graph = [];
const nodes = {
  DECISION: [],
  ROUTING: [],
  EXECUTION: [],
  VALIDATION: [],
  OUTPUT: [],
  INTERNAL: []
};

const lines = code.split("\n");

for (let i = 0; i < lines.length; i++) {
  const r = role(lines[i]);
  if (!r) continue;

  nodes[r].push(i + 1);
  graph.push({ line: i + 1, role: r });
}

function edgeCost(a, b) {
  const map = {
    DECISION: 1,
    ROUTING: 0.5,
    EXECUTION: 4,
    VALIDATION: 2,
    OUTPUT: 1
  };
  return (map[b] || 0) - (map[a] || 0);
}

let transitions = [];
for (let i = 1; i < graph.length; i++) {
  transitions.push({
    from: graph[i - 1].role,
    to: graph[i].role,
    costDelta: edgeCost(graph[i - 1].role, graph[i].role)
  });
}

console.log("\n🧠 KERNEL v7.1 EXECUTION GRAPH VISUALIZER");
console.log("=========================================");

console.log("\n📦 NODE DISTRIBUTION");
for (const k in nodes) {
  console.log(`${k}: ${nodes[k].length} nodes`);
}

console.log("\n🔁 EXECUTION FLOW");
transitions.forEach((t, i) => {
  console.log(`#${i + 1} ${t.from} → ${t.to} (Δ ${t.costDelta})`);
});

const hotspots = transitions.filter(t => t.to === "EXECUTION").length;

console.log("\n🔥 BOTTLENECK SIGNALS");
console.log("EXECUTION ENTRY POINTS:", hotspots);

if (hotspots > 6) {
  console.log("🔴 BOTTLENECK: HIGH EXECUTION PRESSURE");
} else if (hotspots > 3) {
  console.log("🟡 BOTTLENECK: MODERATE EXECUTION PRESSURE");
} else {
  console.log("🟢 BOTTLENECK: STABLE FLOW");
}

console.log("\n🧠 MODE: GRAPH-ONLY ANALYSIS (NO REWRITE)");
