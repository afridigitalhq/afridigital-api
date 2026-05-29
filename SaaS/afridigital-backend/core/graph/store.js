const {
  saveExecution,
  loadExecution
} = require('./persist/store');

const graphs = {};
const executions = {};

function createGraph(id, graph) {
  graphs[id] = graph;
  return graph;
}

function getGraph(id) {
  return graphs[id];
}

function createExecution(execId, graphId, state = {}) {
  const exec = {
    graphId,
    state,
    pointer: "start",
    history: [],
    status: "running",
    updatedAt: Date.now()
  };

  executions[execId] = exec;
  saveExecution(execId, exec);

  return exec;
}

function getExecution(execId) {
  return executions[execId] || loadExecution(execId);
}

function updateExecution(execId, patch) {
  const current =
    executions[execId] || loadExecution(execId) || {};

  const updated = {
    ...current,
    ...patch,
    updatedAt: Date.now()
  };

  executions[execId] = updated;
  saveExecution(execId, updated);

  return updated;
}

function hydrateExecutions() {
  const fs = require('fs');
  const path = require('path');

  const DIR = path.join(__dirname, 'persist/snapshots');

  if (!fs.existsSync(DIR)) return;

  const files = fs.readdirSync(DIR);

  for (const file of files) {
    const data = JSON.parse(
      fs.readFileSync(path.join(DIR, file))
    );

    const execId = file.replace('.json', '');
    executions[execId] = data;
  }

  console.log(`♻️ Hydrated ${files.length} executions`);
}

module.exports = {
  createGraph,
  getGraph,
  createExecution,
  getExecution,
  updateExecution,
  hydrateExecutions
};
