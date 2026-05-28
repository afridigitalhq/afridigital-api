const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "trace.log");

module.exports = {
  readLast(n = 20) {
    const lines = fs.existsSync(FILE)
      ? fs.readFileSync(FILE, "utf8").trim().split("\n")
      : [];

    return lines.slice(-n).map(l => {
      try { return JSON.parse(l); } catch { return l; }
    });
  }
};
