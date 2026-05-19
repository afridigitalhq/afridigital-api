let inFlight = new Set();

function lock(id) {
  if (inFlight.has(id)) return false;
  inFlight.add(id);
  return true;
}

function unlock(id) {
  inFlight.delete(id);
}

module.exports = { lock, unlock };
