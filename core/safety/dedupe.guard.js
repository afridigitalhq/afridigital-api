const executed = new Set();

function runOnce(key, fn) {
  if (executed.has(key)) {
    return { skipped: true, reason: "ALREADY_EXECUTED" };
  }

  executed.add(key);
  return fn();
}

module.exports = { runOnce };
