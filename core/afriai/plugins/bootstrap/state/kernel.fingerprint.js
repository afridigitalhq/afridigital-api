const fs = require("fs");
const crypto = require("crypto");

function hashDir(dir) {
  const files = [];

  function walk(d) {
    fs.readdirSync(d).forEach(f => {
      const full = `${d}/${f}`;
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else {
        files.push(full);
      }
    });
  }

  walk(dir);

  const content = files
    .sort()
    .map(f => fs.readFileSync(f, "utf8"))
    .join("\n");

  return crypto.createHash("sha256").update(content).digest("hex");
}

module.exports = { hashDir };
