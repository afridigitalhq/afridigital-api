const fs = require("fs");

const file = "core/os/orchestratorOS.js";
const code = fs.readFileSync(file, "utf-8");

function tag(line) {
  if (line.includes("planner") || line.includes("executor")) return "🧠 CORE_REASONING";
  if (line.includes("critic")) return "🔍 VALIDATION_LAYER";
  if (line.includes("toolAgent") || line.includes("executeToolCall")) return "🔧 TOOL_BRIDGE";
  if (line.includes("streamWithTyping")) return "🧵 UX_STREAM";
  if (line.includes("require")) return "📦 DEPENDENCY_EDGE";
  return "▫️ INTERNAL";
}

const lines = code.split("\n");

let buckets = {
  CORE_REASONING: [],
  VALIDATION_LAYER: [],
  TOOL_BRIDGE: [],
  UX_STREAM: [],
  DEPENDENCY_EDGE: [],
  INTERNAL: []
};

lines.forEach((l, i) => {
  const t = tag(l);
  const key = t.replace("🧠 ", "").replace("🔍 ", "").replace("🔧 ", "").replace("🧵 ", "").replace("📦 ", "").replace("▫️ ", "");
  buckets[key].push({ line: i + 1, code: l.trim() });
});

function printBucket(name, icon) {
  console.log("\n" + icon + " " + name);
  console.log("=".repeat(40));
  buckets[name].forEach(x => {
    console.log(`#${x.line}  ${x.code}`);
  });
}

console.log("🧠 KERNEL v6.8 ORCHESTRATION EDGE OPTIMIZER");
console.log("===========================================");

printBucket("CORE_REASONING", "🧠");
printBucket("VALIDATION_LAYER", "🔍");
printBucket("TOOL_BRIDGE", "🔧");
printBucket("UX_STREAM", "🧵");
printBucket("DEPENDENCY_EDGE", "📦");
printBucket("INTERNAL", "▫️");

console.log("\n🟢 MODE: STRUCTURAL DECOMPOSITION ONLY (NO REWRITE)");
