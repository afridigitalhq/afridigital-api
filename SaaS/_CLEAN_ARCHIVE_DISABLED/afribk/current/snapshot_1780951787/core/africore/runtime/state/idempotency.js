const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "processed.json");

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  has(id) {
    const db = load();
    return !!db[id];
  },

  mark(id) {
    const db = load();
    db[id] = { ts: Date.now() };
    save(db);
  }
};
