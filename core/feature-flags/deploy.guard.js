let locked = false;

function lockProductionFlags() {
  locked = true;
}

function assertMutable() {
  if (locked) {
    throw new Error("Production mode locked: flags are immutable");
  }
}

module.exports = { lockProductionFlags, assertMutable };
