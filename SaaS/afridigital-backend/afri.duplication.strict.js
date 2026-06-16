const fs = require('fs');
const crypto = require('crypto');

function hash(file) {
  return crypto.createHash('sha256')
    .update(fs.readFileSync(file))
    .digest('hex');
}

function isTrueDuplicate(fileA, fileB) {
  try {
    return hash(fileA) === hash(fileB);
  } catch {
    return false;
  }
}

module.exports = { isTrueDuplicate };
