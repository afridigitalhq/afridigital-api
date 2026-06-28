const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "ci.ledger.log");

function appendEvent(event) {
  const record = {
    ts: Date.now(),
    event
  };
  fs.appendFileSync(LOG_FILE, JSON.stringify(record) + "\n");
  return record;
}

function readEvents() {
  if (!fs.existsSync(LOG_FILE)) return [];
  return fs.readFileSync(LOG_FILE, "utf8")
    .trim()
    .split("\n")
    .map(l => JSON.parse(l));
}

module.exports = { appendEvent, readEvents };

const { emitHUD } = require("../hud/webgl.stream");

function appendEvent(event) {
  const record = {
    ts: Date.now(),
    event
  };

  try {
    emitHUD(record);
  } catch (e) {}

  return record;
}

function tagEventSource(event, source = "system") {
  return {
    ...event,
    source
  };
}

module.exports.tagEventSource = tagEventSource;
