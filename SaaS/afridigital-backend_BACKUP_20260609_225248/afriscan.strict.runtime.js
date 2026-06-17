const fs = require('fs');
const crypto = require('crypto');

function sha(file) {
  return crypto.createHash('sha256')
    .update(fs.readFileSync(file))
    .digest('hex');
}

const IGNORE = [
  "node_modules",
  "afribk",
  "archive",
  "_SAFE_RESTRUCTURE_BACKUP",
  "core/runtime/backups",
  "obs-dashboard",
  "control-plane/collector"
];

function allowed(path) {
  return !IGNORE.some(x => path.includes(x));
}

function isTrueDuplicate(a, b) {
  if (!allowed(a) || !allowed(b)) return false;
  try {
    return sha(a) === sha(b);
  } catch {
    return false;
  }
}

module.exports = { isTrueDuplicate };
