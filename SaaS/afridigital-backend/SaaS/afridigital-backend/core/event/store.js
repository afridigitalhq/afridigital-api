const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'event.history.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function save(data) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (e) {}
}

module.exports = { load, save };
