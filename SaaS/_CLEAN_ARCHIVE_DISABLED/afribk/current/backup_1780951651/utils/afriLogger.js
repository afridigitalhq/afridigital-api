const fs = require("fs");

function logCommand(from, command) {
  try {
    if (!from || !command) return;

    const line = `[${new Date().toISOString()}] ${from} -> ${command}\n`;
    fs.appendFileSync("logs/afri-audit.log", line);
  } catch (e) {
    console.log("Logger error:", e.message);
  }
}

module.exports = { logCommand };
