const fs = require("fs");
const path = require("path");

const EVENT_LOG = path.join(__dirname, "../../logs/event-stream.jsonl");

function replay() {
  if (!fs.existsSync(EVENT_LOG)) return [];

  return fs.readFileSync(EVENT_LOG, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(l => JSON.parse(l));
}

module.exports = { replay };
