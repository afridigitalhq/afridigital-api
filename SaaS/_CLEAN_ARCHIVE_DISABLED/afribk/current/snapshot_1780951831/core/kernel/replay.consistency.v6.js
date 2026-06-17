
const processed = new Map();

async function isProcessed(id) {
  return processed.has(id);
}

async function markProcessed(id) {
  processed.set(id, Date.now());
}

module.exports = { isProcessed, markProcessed };

