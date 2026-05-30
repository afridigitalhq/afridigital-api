const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(process.cwd(), "core/kafka/log/event.log");

class EventLog {
  append(event) {
    const entry = {
      id: "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      ts: Date.now(),
      ...event
    };

    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n");
    return entry;
  }

  readAll() {
    if (!fs.existsSync(LOG_FILE)) return [];
    return fs.readFileSync(LOG_FILE, "utf-8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map(JSON.parse);
  }

  replay(filterFn = () => true) {
    return this.readAll().filter(filterFn);
  }
}

module.exports = new EventLog();
