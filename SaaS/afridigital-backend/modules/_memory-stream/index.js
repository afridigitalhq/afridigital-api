const fs = require("fs");

const LOG = "/tmp/memory-stream.log";

function write(event) {
  fs.appendFileSync(LOG, JSON.stringify({
    time: Date.now(),
    event
  }) + "\n");
}

module.exports = { write };
