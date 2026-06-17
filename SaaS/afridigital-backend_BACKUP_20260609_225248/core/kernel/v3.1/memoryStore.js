const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'memory/state.json');

function save(state) {
  fs.writeFileSync(FILE, JSON.stringify(state, null, 2));
}

function load() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

module.exports = { save, load };
