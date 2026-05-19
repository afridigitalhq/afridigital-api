const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const MODULES = path.join(ROOT, "modules");

const STATE_FILE = path.join(ROOT, "v5-architecture-state.json");

function log(msg) {
  console.log("[V5-BRAIN]", msg);
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    return { history: {}, failures: {}, weights: {} };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function getModules() {
  return fs.readdirSync(MODULES).filter(m => !m.startsWith("."));
}

function scanDependencies(mod) {
  const file = path.join(MODULES, mod, "index.js");
  if (!fs.existsSync(file)) return [];

  const content = fs.readFileSync(file, "utf-8");

  const matches = [...content.matchAll(/require\(['"`]\.\.\/(.*?)['"`]\)/g)];
  return matches.map(m => m[1]);
}

function buildGraph() {
  const graph = {};
  for (const mod of getModules()) {
    graph[mod] = scanDependencies(mod);
  }
  return graph;
}

function detectRisk(graph) {
  const risk = [];

  for (const mod in graph) {
    for (const dep of graph[mod]) {
      if (!fs.existsSync(path.join(MODULES, dep))) {
        risk.push({ mod, dep });
      }
    }
  }

  return risk;
}

function generateBootPlan(graph, state) {
  const score = (m) => state.weights[m] || 1;

  return Object.keys(graph)
    .sort((a, b) => score(b) - score(a));
}

function quarantine(mod) {
  const src = path.join(MODULES, mod);
  const dest = path.join(MODULES, "_quarantine", mod);

  if (!fs.existsSync(path.join(MODULES, "_quarantine"))) {
    fs.mkdirSync(path.join(MODULES, "_quarantine"));
  }

  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    log(`quarantined ${mod}`);
  }
}

function run() {
  log("V5 AUTONOMOUS ARCHITECTURE BRAIN ACTIVE");

  const state = loadState();
  const graph = buildGraph();
  const risk = detectRisk(graph);

  if (risk.length > 0) {
    log(`risk detected: ${risk.length} issues`);

    for (const r of risk) {
      log(`${r.mod} → missing ${r.dep}`);

      state.failures[r.mod] = (state.failures[r.mod] || 0) + 1;

      if (state.failures[r.mod] > 2) {
        quarantine(r.mod);
      }
    }
  }

  const plan = generateBootPlan(graph, state);

  log("BOOT STRATEGY:");
  plan.forEach((m, i) => log(`${i + 1}. ${m}`));

  state.history[Date.now()] = { risk: risk.length, plan };

  saveState(state);

  if (risk.length > 15) {
    log("SYSTEM BLOCKED: too unstable for boot");
    process.exit(1);
  }

  log("architecture stable");
}

module.exports = { run };
