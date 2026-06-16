const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  let items = [];

  try {
    items = fs.readdirSync(dir);
  } catch (e) {
    return files;
  }

  for (const item of items) {
    const full = path.join(dir, item);

    try {
      const stat = fs.statSync(full);

      if (stat.isDirectory()) {
        if (item === 'node_modules' || item === 'afribk' || item === 'archive') continue;
        walk(full, files);
      } else {
        files.push(full);
      }

    } catch (e) {
      // 🔥 KEY FIX: ignore broken references instead of crashing
      continue;
    }
  }

  return files;
}

module.exports = function scan() {
  return walk('.');
};
