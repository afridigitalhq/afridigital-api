const { getHistory } = require("../../event/bus");

function createSnapshot() {
  return Object.freeze({
    ts: Date.now(),
    eventCount: getHistory().length,
    memoryUsage: process.memoryUsage()
  });
}

module.exports = { createSnapshot };
