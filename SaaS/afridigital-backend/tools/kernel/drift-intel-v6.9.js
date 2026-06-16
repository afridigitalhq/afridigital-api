const fs = require("fs");

const file = "core/os/orchestratorOS.js";
const code = fs.readFileSync(file, "utf-8");

function detectStage(line) {
  if (line.includes("planner")) return "🧠 PLANNING";
  if (line.includes("executor")) return "⚙️ EXECUTION";
  if (line.includes("critic")) return "🔍 VALIDATION";
  if (line.includes("toolAgent")) return "🔧 TOOL_DECISION";
  if (line.includes("executeToolCall")) return "🚀 TOOL_EXECUTION";
  if (line.includes("streamWithTyping")) return "🧵 STREAMING";
  return "▫️ INTERNAL";
}

const lines = code.split("\n");

/* =========================
   SIMULATION ENGINE STATE
========================= */

let flow = [];
let latency = 0;

function cost(stage) {
  switch (stage) {
    case "🧠 PLANNING": return 1;
    case "⚙️ EXECUTION": return 2;
    case "🔍 VALIDATION": return 2;
    case "🔧 TOOL_DECISION": return 1;
    case "🚀 TOOL_EXECUTION": return 4;
    case "🧵 STREAMING": return 1;
    default: return 0;
  }
}

/* =========================
   TRACE FLOW
========================= */

lines.forEach((l, i) => {
  const stage = detectStage(l);
  const c = cost(stage);

  if (c > 0) {
    flow.push({
      line: i + 1,
      stage,
      cost: c,
      code: l.trim()
    });
    latency += c;
  }
});

/* =========================
   OUTPUT ENGINE
========================= */

console.log("🧠 KERNEL v6.9 ORCHESTRATION SIMULATION ENGINE");
console.log("===============================================");
console.log("📄 FILE:", file);
console.log("\n🔁 EXECUTION FLOW SIMULATION\n");

flow.forEach((f, i) => {
  console.log(`#${i + 1} [Line ${f.line}]`);
  console.log("STAGE:", f.stage);
  console.log("COST:", f.cost);
  console.log("-----------------------------------");
});

console.log("\n⏱️ ESTIMATED LATENCY SCORE:", latency);
console.log("🧠 FLOW DEPTH:", flow.length);

/* =========================
   HEALTH INTERPRETATION
========================= */

if (latency <= 6) {
  console.log("🟢 SYSTEM FLOW: OPTIMIZED");
} else if (latency <= 10) {
  console.log("🟡 SYSTEM FLOW: MODERATE COMPLEXITY");
} else {
  console.log("🔴 SYSTEM FLOW: HIGH EXECUTION COST");
}
