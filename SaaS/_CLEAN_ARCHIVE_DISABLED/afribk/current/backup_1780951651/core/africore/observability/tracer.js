const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "trace.log");

function write(entry) {
  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n");
}

module.exports = {
  trace(event, data = {}) {
    const entry = {
      ts: Date.now(),
      traceId: event.traceId || "unknown",
      type: event.type || "event",
      step: data.step || "unknown",
      user: event.from || event.user,
      meta: data.meta || {},
    };

    write(entry);
    return entry;
  }
};
