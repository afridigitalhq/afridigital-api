const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require('fs');
const path = require('path');

function log(type, message) {
  const line = `[${new Date().toISOString()}] [${type}] ${message}\n`;
  console.log(line.trim());

  const logFile = path.join(__dirname, '../../logs/system.log');
  fs.appendFileSync(logFile, line);
}

module.exports = { log };
