const fs = require("fs");

function saveMemory(user, text) {
  const data = { time: Date.now(), user, text };
  fs.appendFileSync("logs/memory.log", JSON.stringify(data) + "\n");
}

function getMemory(user) {
  try {
    const logs = fs.readFileSync("logs/memory.log", "utf8")
      .split("\n")
      .filter(Boolean)
      .map(JSON.parse)
      .filter(x => x.user === user)
      .slice(-5);

    return logs;
  } catch {
    return [];
  }
}

module.exports = { saveMemory, getMemory };
