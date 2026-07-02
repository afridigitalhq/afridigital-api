const fs = require("fs");
const path = require("path");

const memoryFile = path.resolve("storage/vector/knowledge.json");

if (!fs.existsSync(memoryFile)) {
  fs.writeFileSync(memoryFile, JSON.stringify([]));
}

function remember(data) {
  const existing = JSON.parse(fs.readFileSync(memoryFile));
  existing.push({
    ts: Date.now(),
    data
  });

  fs.writeFileSync(memoryFile, JSON.stringify(existing, null, 2));

  console.log("🧠 Memory Written");
}

module.exports = { remember };
