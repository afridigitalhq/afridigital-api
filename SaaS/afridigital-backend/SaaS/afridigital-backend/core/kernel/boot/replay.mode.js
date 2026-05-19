
// REPLAY MODE BOOTSTRAP (safe startup mode)
const { runReplay } = require('../../replay/replay.runner');

function bootReplayMode(handlers) {
  return runReplay(handlers);
}

module.exports = { bootReplayMode };

