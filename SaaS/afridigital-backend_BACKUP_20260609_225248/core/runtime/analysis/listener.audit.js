/**
 * 🧠 LISTENER COLLAPSE ANALYZER
 * runtime diagnostic tool (non-invasive)
 */

const fs = require("fs");
const path = require("path");

function scan(dir = "core") {
  let count = 0;

  function walk(d) {
    const files = fs.readdirSync(d);
    for (const f of files) {
      const full = path.join(d, f);
      if (fs.statSync(full).isDirectory()) walk(full);
      else {
        try {
          const txt = fs.readFileSync(full, "utf8");
          const matches = (txt.match(/listen\(/g) || []).length;
          count += matches;
        } catch {}
      }
    }
  }

  walk(dir);

  return count;
}

module.exports = {
  scan
};
