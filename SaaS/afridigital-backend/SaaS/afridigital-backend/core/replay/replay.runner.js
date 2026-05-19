const { rebuildState } = require('./state.builder');

function runReplay(handlers) {
  console.log('[REPLAY] Starting full system rebuild...');
  const state = rebuildState(handlers);
  console.log('[REPLAY] System state rebuilt successfully');
  return state;
}

module.exports = { runReplay };
