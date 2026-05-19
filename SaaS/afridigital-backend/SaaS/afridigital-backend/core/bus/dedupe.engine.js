const { assertApiVersion } = require("../runtime/safety/api.guard");
const seen = new Map();

// keep memory window lightweight
const TTL = 1000 * 60 * 10; // 10 min

exports.check = (key) => {
  const now = Date.now();

  if (seen.has(key)) return false;

  seen.set(key, now);

  // cleanup
  for (const [k, time] of seen.entries()) {
    if (now - time > TTL) seen.delete(k);
  }

  return true;
};
