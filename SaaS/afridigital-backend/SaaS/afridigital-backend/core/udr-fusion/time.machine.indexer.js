const bus = require('../udr/udr.bus');

console.log('⏳ TIME MACHINE INDEXER ACTIVE');

const history = [];

bus.on('fusion.event', (event) => {
  history.push(event);

  // keep memory bounded
  if (history.length > 10000) {
    history.shift();
  }
});

function replay(moduleId = null) {
  if (!moduleId) return history;

  return history.filter(e => e.module === moduleId);
}

module.exports = { replay };
