const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "events.log");

function append(event) {
  fs.appendFileSync(FILE, JSON.stringify({
    ...event,
    ts: Date.now()
  }) + "\n");
}

function readAll() {
  return fs.readFileSync(FILE, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse);
}

module.exports = { append, readAll };
