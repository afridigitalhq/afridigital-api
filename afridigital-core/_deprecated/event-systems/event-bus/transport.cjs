const fs = require("fs");
const path = require("path");

const EVENT_LOG = path.join(__dirname, "../../logs/event-stream.jsonl");

function persist(event, payload) {
  const record = {
    event,
    payload,
    timestamp: Date.now()
  };

  fs.appendFileSync(EVENT_LOG, JSON.stringify(record) + "\n");
}

module.exports = { persist };
