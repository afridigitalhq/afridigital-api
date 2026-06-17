const fs = require("fs");
const path = require("path");

const DB = path.join(__dirname, "patterns.json");

function load() {
  try { return JSON.parse(fs.readFileSync(DB)); }
  catch { return []; }
}

function save(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

module.exports = {
  learn(execution) {
    const patterns = load();

    patterns.push({
      intent: execution.ai?.category,
      actions: execution.actions,
      success: execution.ok,
      ts: Date.now()
    });

    save(patterns.slice(-500));
  }
};
