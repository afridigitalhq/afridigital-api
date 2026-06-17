const fs = require("fs");

function scanSystem() {
  const files = fs.readdirSync(".");
  return {
    files,
    status: "read-only",
    timestamp: Date.now()
  };
}

module.exports = { scanSystem };
