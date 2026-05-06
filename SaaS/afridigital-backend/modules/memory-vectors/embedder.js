const crypto = require('crypto');

// Simple embedding mock (replace later with real model)
function embed(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

module.exports = { embed };
