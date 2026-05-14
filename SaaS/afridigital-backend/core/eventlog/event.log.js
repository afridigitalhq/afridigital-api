const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "afrios.eventlog.jsonl");

function appendEvent(event) {
  const record = JSON.stringify({
    ...event,
    ts: Date.now()
  });

  fs.appendFileSync(LOG_FILE, record + "\n");
  return record;
}

function readAllEvents() {
  if (!fs.existsSync(LOG_FILE)) return [];
  return fs.readFileSync(LOG_FILE, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse);
}

function readFromOffset(offset = 0) {
  return readAllEvents().slice(offset);
}

module.exports = {
  appendEvent,
  readAllEvents,
  readFromOffset
};
