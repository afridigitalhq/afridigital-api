const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "execution.graph.json");

function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

function save(graph) {
  fs.writeFileSync(FILE, JSON.stringify(graph, null, 2));
}

function addNode(node) {
  const graph = load();
  graph.push({
    ...node,
    ts: Date.now()
  });
  save(graph);
}

module.exports = { load, save, addNode };
