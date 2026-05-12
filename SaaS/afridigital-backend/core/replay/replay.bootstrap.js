const { runReplay } = require('./replay.runner');

function bootReplayMode(handlers) {
  return runReplay(handlers);
}

module.exports = { bootReplayMode };
