const { assertApiVersion } = require("../runtime/safety/api.guard");
const crypto = require("crypto");

const memoryStore = new Map();

function generateKey(payload) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}

function isDuplicate(key) {
  return memoryStore.has(key);
}

function record(key, result) {
  memoryStore.set(key, {
    result,
    timestamp: Date.now(),
  });
}

function get(key) {
  return memoryStore.get(key);
}

/**
 * Financial safety wrapper
 */
async function runIdempotent(payload, handler) {
  const key = generateKey(payload);

  if (isDuplicate(key)) {
    return get(key).result;
  }

  const result = await handler(payload);
  record(key, result);

  return result;
}

module.exports = {
  runIdempotent,
  generateKey,
};

