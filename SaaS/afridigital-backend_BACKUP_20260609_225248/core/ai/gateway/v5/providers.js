const mock = require("../../providers/mockProvider");

function selectProvider(req = {}) {
  // SAFE MODE: always mock first (Render-safe)
  return mock;
}

module.exports = { selectProvider };
