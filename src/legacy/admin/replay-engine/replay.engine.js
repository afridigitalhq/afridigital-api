const { getAllTraces } = require("./trace.store");

/**
 * Replay system simulates system state evolution over time
 */
function replay({ speed = 1 } = {}) {

  const traces = getAllTraces();

  let index = 0;

  return {
    next() {
      if (index >= traces.length) return null;

      const frame = traces[index];

      index += speed;

      return {
        frame,
        progress: index / traces.length
      };
    },

    reset() {
      index = 0;
    },

    currentIndex() {
      return index;
    }
  };
}

module.exports = { replay };
