const fs = require("fs");

function log(event, data = {}) {
  const entry = {
    ts: new Date().toISOString(),
    event,
    data
  };

  fs.appendFileSync(
    "./afriscan/logs/events.log",
    JSON.stringify(entry) + "\n"
  );
}

module.exports = log;
