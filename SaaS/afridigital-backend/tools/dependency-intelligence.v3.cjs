const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const MODULES = path.join(ROOT, "modules");

function log(msg) {
  console.log("[V3-INTEL]", msg);
}

function getModules() {
  return fs.readdirSync(MODULES).filter(m => !m.startsWith("."));
}

function parseDeps(mod) {
  const file = path.join(MODULES, mod, "index.js");
  if (!fs.existsSync(file)) return [];

  const content = fs.readFileSync(file, "utf-8");

  const matches = [...content.matchAll(/require\(["'`](.*?)["'`]\)/g)];

  return matches.map(m => m[1])
    .filter(p => p.startsWith("..") || p.startsWith("../"));
}

function buildGraph() {
  const graph = {};
  const modules = getModules();

  for (const mod of modules) {
    graph[mod] = parseDeps(mod);
  }

  return graph;
}

function detectMissing(graph) {
  const missing = [];

  for (const mod in graph) {
    for (const dep of graph[mod]) {
      const cleaned = dep.split("/").pop();

      if (!fs.existsSync(path.join(MODULES, cleaned))) {
        missing.push({ mod, dep: cleaned });
      }
    }
  }

  return missing;
}

function createBootPlan(graph) {
  const order = [];
  const visited = new Set();

  function visit(node) {
    if (visited.has(node)) return;
    visited.add(node);

    const deps = graph[node] || [];
    for (const d of deps) {
      const clean = d.split("/").pop();
      if (graph[clean]) visit(clean);
    }

    order.push(node);
  }

  Object.keys(graph).forEach(visit);

  return order;
}

function run() {
  log("V3 DEPENDENCY INTELLIGENCE ACTIVE");

  const graph = buildGraph();
  const missing = detectMissing(graph);
  const plan = createBootPlan(graph);

  if (missing.length > 0) {
    log("⚠️ Missing dependencies detected:");
    missing.forEach(m => log(`${m.mod} → ${m.dep}`));
  }

  log("📊 Boot order:");
  plan.forEach(p => log(`→ ${p}`));

  if (missing.length > 5) {
    log("🛑 SYSTEM BLOCKED: too many missing dependencies");
    process.exit(1);
  }

  log("system safe to boot");
}

module.exports = { run };
