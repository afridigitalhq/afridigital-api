const used = new Set();

function once(key, fn) {
  if (used.has(key)) {
    return { skipped: true };
  }

  used.add(key);
  return fn();
}

module.exports = { once };
