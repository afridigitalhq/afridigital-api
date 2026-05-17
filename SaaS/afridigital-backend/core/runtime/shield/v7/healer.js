const fs = require("fs");
const path = require("path");

function repair(filePath, backupContent) {
  try {
    fs.writeFileSync(filePath, backupContent);
    console.log("🛠 SELF-HEAL APPLIED");
  } catch (e) {
    console.log("HEAL FAILED:", e.message);
  }
}

module.exports = { repair };
