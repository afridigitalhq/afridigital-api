const fs = require("fs");

const file = "core/os/orchestratorOS.js";
const code = fs.readFileSync(file, "utf-8");

function classify(line) {
  if (line.includes("planner")) return "DECISION";
  if (line.includes("toolAgent")) return "ROUTING";
  if (line.includes("executor")) return "EXECUTION";
  if (line.includes("critic")) return "VALIDATION";
  if (line.includes("executeToolCall")) return "EXECUTION";
  if (line.includes("streamWithTyping")) return "OUTPUT";
  return "INTERNAL";
}

function cost(role) {
  switch (role) {
    case "DECISION": return 1;
    case "ROUTING": return 0.5;
    case "EXECUTION": return 4;
    case "VALIDATION": return 2;
    case "OUTPUT": return 1;
    default: return 0;
  }
}

const lines = code.split("\n");

let breakdown = [];
let normalizedCost = 0;

let executionSeen = 0;
let validationSeen = 0;

for (let i = 0; i < lines.length; i++) {
  const role = classify(lines[i]);
  const c = cost(role);

  if (role === "EXECUTION") {
    if (executionSeen === 0) normalizedCost += c;
    executionSeen++;
  } 
  else if (role === "VALIDATION") {
    if (validationSeen === 0) normalizedCost += c;
    validationSeen++;
  } 
  else {
    normalizedCost += c;
  }

  if (c > 0) {
    breakdown.push({ line: i + 1, role, cost: c });
  }
}

console.log("🧠 KERNEL v7.0 LIFECYCLE NORMALIZED ENGINE");
console.log("===========================================");
console.log("📄 FILE:", file);

breakdown.forEach((b, i) => {
  console.log(`#${i + 1} [Line ${b.line}] ${b.role} COST=${b.cost}`);
});

console.log("\n📊 NORMALIZED LIFECYCLE COST:", normalizedCost);

if (normalizedCost <= 8) {
  console.log("🟢 SYSTEM HEALTH: OPTIMIZED");
} else if (normalizedCost <= 14) {
  console.log("🟡 SYSTEM HEALTH: MODERATE LOAD");
} else {
  console.log("🔴 SYSTEM HEALTH: HIGH LOAD");
}
