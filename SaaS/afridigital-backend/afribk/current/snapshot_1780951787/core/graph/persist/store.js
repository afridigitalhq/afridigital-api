const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'snapshots');

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true });
}

function saveExecution(execId, data) {
  fs.writeFileSync(
    path.join(DIR, `${execId}.json`),
    JSON.stringify(data, null, 2)
  );
}

function loadExecution(execId) {
  const file = path.join(DIR, `${execId}.json`);

  if (!fs.existsSync(file)) return null;

  return JSON.parse(fs.readFileSync(file));
}

function listExecutions() {
  return fs.readdirSync(DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

module.exports = {
  saveExecution,
  loadExecution,
  listExecutions
};
